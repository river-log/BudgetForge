import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://budget-forge.com",
  "http://localhost:5173",
  "capacitor://localhost",
  "https://localhost",
]);

function corsHeaders(origin: string | null) {
  const allowed = origin && allowedOrigins.has(origin) ? origin : "https://budget-forge.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function response(origin: string | null, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (request.method !== "POST") return response(origin, 405, { error: "method_not_allowed" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("Authorization");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) return response(origin, 500, { error: "server_configuration" });
  if (!authorization?.startsWith("Bearer ")) return response(origin, 401, { error: "unauthorized" });

  const token = authorization.slice("Bearer ".length);
  const verifier = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: userError } = await verifier.auth.getUser(token);
  if (userError || !user) return response(origin, 401, { error: "unauthorized" });

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: recordsError } = await admin.from("budgetforge_sync").delete().eq("user_id", user.id);
  if (recordsError) return response(origin, 500, { error: "cloud_delete_failed" });

  const { error: authError } = await admin.auth.admin.deleteUser(user.id);
  if (authError) {
    return response(origin, 500, {
      error: "auth_delete_failed",
      recoverable: true,
    });
  }
  return response(origin, 200, { deleted: true });
});
