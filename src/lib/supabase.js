import { createClient } from "@supabase/supabase-js";
import { isNativePlatform } from "../native/platform";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key, {
  auth: {
    flowType: isNativePlatform() ? "pkce" : "implicit",
    detectSessionInUrl: !isNativePlatform(),
  },
}) : null;
export const isSupabaseConfigured = Boolean(supabase);
