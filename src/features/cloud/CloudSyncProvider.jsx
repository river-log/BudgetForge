import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import CloudSyncContext from "./CloudSyncContext";

const STORAGE_KEYS = ["budgetforge-bills", "budgetforge-income", "budgetforge-user", "budgetforge-savings", "budgetforge-debts", "budgetforge-budget-categories", "budgetforge-spending-history", "budgetforge-savings-history", "budgetforge-reminder-days", "budgetforge-debt-strategy"];
const DEVICE_KEY = "budgetforge-device-id";
const LOADED_USER_KEY = "budgetforge-cloud-loaded-user";

function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) { deviceId = crypto.randomUUID(); localStorage.setItem(DEVICE_KEY, deviceId); }
  return deviceId;
}

function getSnapshot() { return Object.fromEntries(STORAGE_KEYS.map((key) => [key, localStorage.getItem(key)])); }
function applySnapshot(snapshot) { Object.entries(snapshot || {}).forEach(([key, value]) => { if (STORAGE_KEYS.includes(key)) { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } }); }

export function CloudSyncProvider({ children }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState(isSupabaseConfigured ? "offline" : "not-configured");
  const initialized = useRef(false);
  const lastSnapshot = useRef("");

  const syncNow = useCallback(async () => {
    if (!supabase || !session?.user) return { error: new Error("Sign in to sync your data.") };
    const snapshot = getSnapshot();
    const serialized = JSON.stringify(snapshot);
    if (serialized === lastSnapshot.current) return { error: null };
    setStatus("syncing");
    const { error } = await supabase.from("budgetforge_sync").upsert({ user_id: session.user.id, data: { deviceId: getDeviceId(), snapshot }, updated_at: new Date().toISOString() });
    if (!error) lastSnapshot.current = serialized;
    setStatus(error ? "error" : "synced");
    return { error };
  }, [session]);

  const signIn = useCallback(async (email) => {
    if (!supabase) return { error: new Error("Supabase has not been configured.") };
    return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
  }, []);
  const signOut = useCallback(async () => { if (supabase) await supabase.auth.signOut(); }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user || initialized.current) return undefined;
    initialized.current = true;
    let channel;
    async function connectSync() {
      setStatus("syncing");
      const { data, error } = await supabase.from("budgetforge_sync").select("data").eq("user_id", session.user.id).maybeSingle();
      if (error) { setStatus("error"); return; }
      if (data?.data?.snapshot) {
        lastSnapshot.current = JSON.stringify(data.data.snapshot);
        if (sessionStorage.getItem(LOADED_USER_KEY) !== session.user.id) {
          applySnapshot(data.data.snapshot);
          sessionStorage.setItem(LOADED_USER_KEY, session.user.id);
          setStatus("synced");
          window.location.reload();
          return;
        }
      }
      await syncNow();
      channel = supabase.channel(`budgetforge-sync-${session.user.id}`).on("postgres_changes", { event: "UPDATE", schema: "public", table: "budgetforge_sync", filter: `user_id=eq.${session.user.id}` }, (payload) => {
        const remote = payload.new.data;
        if (remote?.deviceId && remote.deviceId !== getDeviceId()) { lastSnapshot.current = JSON.stringify(remote.snapshot); applySnapshot(remote.snapshot); window.location.reload(); }
      }).subscribe();
    }
    connectSync();
    const interval = window.setInterval(syncNow, 20000);
    return () => { window.clearInterval(interval); channel?.unsubscribe(); };
  }, [session, syncNow]);

  const value = useMemo(() => ({ configured: isSupabaseConfigured, session, status, signIn, signOut, syncNow }), [session, signIn, signOut, status, syncNow]);
  return <CloudSyncContext.Provider value={value}>{children}</CloudSyncContext.Provider>;
}
