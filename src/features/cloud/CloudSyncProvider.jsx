import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import {
  clearCloudOwnerId,
  clearCloudStorage,
  getCloudOwnerId,
  getCloudSnapshot,
  replaceCloudSnapshot,
  serializeCloudSnapshot,
  setCloudOwnerId,
} from "./cloudStorage";
import CloudSyncContext from "./CloudSyncContext";

const DEVICE_KEY = "budgetforge-device-id";
const ISOLATION_RELOAD_KEY = "budgetforge-cloud-isolation-reload-user";

function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, deviceId);
  }

  return deviceId;
}

function CloudSyncProvider({ children }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState(
    isSupabaseConfigured ? "offline" : "not-configured"
  );
  const activeUserId = useRef(null);
  const initialized = useRef(false);
  const guestDataEligible = useRef(false);
  const generation = useRef(0);
  const interval = useRef(null);
  const channel = useRef(null);
  const lastSnapshot = useRef("");

  const isCurrentUser = useCallback((userId, requestGeneration) => (
    activeUserId.current === userId && generation.current === requestGeneration
  ), []);

  const stopSync = useCallback(() => {
    generation.current += 1;
    initialized.current = false;
    lastSnapshot.current = "";

    if (interval.current) {
      window.clearInterval(interval.current);
      interval.current = null;
    }

    if (channel.current) {
      channel.current.unsubscribe();
      channel.current = null;
    }
  }, []);

  const resetUserStorage = useCallback(() => {
    clearCloudStorage();
    clearCloudOwnerId();
  }, []);

  const syncSnapshot = useCallback(async (userId, requestGeneration) => {
    if (!supabase || !isCurrentUser(userId, requestGeneration)) {
      return { error: new Error("Sign in to sync your data.") };
    }

    const snapshot = getCloudSnapshot();
    const serialized = serializeCloudSnapshot(snapshot);

    if (serialized === lastSnapshot.current) {
      setStatus("synced");
      return { error: null };
    }

    setStatus("syncing");

    const { error } = await supabase
      .from("budgetforge_sync")
      .upsert({
        user_id: userId,
        data: {
          deviceId: getDeviceId(),
          snapshot,
        },
        updated_at: new Date().toISOString(),
      });

    if (!isCurrentUser(userId, requestGeneration)) {
      return { error: new Error("Sync session changed.") };
    }

    if (!error) {
      lastSnapshot.current = serialized;
      setCloudOwnerId(userId);
    }

    setStatus(error ? "error" : "synced");
    return { error };
  }, [isCurrentUser]);

  const syncNow = useCallback(async () => {
    const userId = activeUserId.current;
    const requestGeneration = generation.current;

    if (!userId || !initialized.current) {
      return { error: new Error("Sync is still initializing.") };
    }

    return syncSnapshot(userId, requestGeneration);
  }, [syncSnapshot]);

  const signIn = useCallback(async (email) => {
    if (!supabase) {
      return { error: new Error("Supabase has not been configured.") };
    }

    if (
      activeUserId.current === null &&
      getCloudOwnerId() === null
    ) {
      guestDataEligible.current = true;
    }

    return supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    stopSync();
    activeUserId.current = null;
    guestDataEligible.current = false;
    resetUserStorage();
    sessionStorage.removeItem(ISOLATION_RELOAD_KEY);
    setSession(null);
    setStatus(isSupabaseConfigured ? "offline" : "not-configured");

    if (supabase) {
      const result = await supabase.auth.signOut();

      if (!result.error) {
        window.location.reload();
      }

      return result;
    }

    return { error: null };
  }, [resetUserStorage, stopSync]);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let mounted = true;

    function handleSession(nextSession, isInitialSession = false) {
      const previousUserId = activeUserId.current;
      const nextUserId = nextSession?.user?.id || null;

      if (
        isInitialSession &&
        previousUserId === null &&
        nextUserId === null
      ) {
        guestDataEligible.current = true;
      }

      if (previousUserId !== nextUserId) {
        stopSync();

        const storedOwnerId = getCloudOwnerId();
        let shouldReloadForIsolation = false;
        const isGuestToFirstAccount = (
          isInitialSession === false &&
          previousUserId === null &&
          nextUserId !== null &&
          storedOwnerId === null &&
          guestDataEligible.current
        );

        if (nextUserId === null) {
          resetUserStorage();
          guestDataEligible.current = isInitialSession;
          sessionStorage.removeItem(ISOLATION_RELOAD_KEY);
        } else if (
          previousUserId !== null ||
          (!isGuestToFirstAccount && storedOwnerId !== nextUserId)
        ) {
          resetUserStorage();
          guestDataEligible.current = false;
          shouldReloadForIsolation = (
            sessionStorage.getItem(ISOLATION_RELOAD_KEY) !== nextUserId
          );
        }

        activeUserId.current = nextUserId;

        if (shouldReloadForIsolation && mounted) {
          sessionStorage.setItem(ISOLATION_RELOAD_KEY, nextUserId);
          window.location.reload();
          return;
        }

        if (previousUserId !== null && nextUserId === null && mounted) {
          window.location.reload();
          return;
        }
      }

      if (mounted) {
        setSession(nextSession);
        setStatus(nextUserId ? "offline" : (isSupabaseConfigured ? "offline" : "not-configured"));
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        handleSession(data.session, true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => handleSession(nextSession)
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
      stopSync();
    };
  }, [resetUserStorage, stopSync]);

  useEffect(() => {
    const userId = session?.user?.id;

    if (!supabase || !userId || initialized.current) {
      return undefined;
    }

    const requestGeneration = generation.current;
    let cancelled = false;

    async function bootstrap() {
      setStatus("syncing");

      const { data, error } = await supabase
        .from("budgetforge_sync")
        .select("data")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled || !isCurrentUser(userId, requestGeneration)) {
        return;
      }

      if (error) {
        setStatus("error");
        return;
      }

      const remoteSnapshot = data?.data?.snapshot;

      if (remoteSnapshot) {
        const remoteSerialized = serializeCloudSnapshot(remoteSnapshot);
        const localSerialized = serializeCloudSnapshot(getCloudSnapshot());

        if (
          remoteSerialized !== localSerialized ||
          getCloudOwnerId() !== userId
        ) {
          replaceCloudSnapshot(remoteSnapshot);
          setCloudOwnerId(userId);
          lastSnapshot.current = remoteSerialized;
          window.location.reload();
          return;
        }

        lastSnapshot.current = remoteSerialized;
        setCloudOwnerId(userId);
      } else if (!guestDataEligible.current) {
        resetUserStorage();
      }

      if (cancelled || !isCurrentUser(userId, requestGeneration)) {
        return;
      }

      initialized.current = true;
      guestDataEligible.current = false;

      await syncSnapshot(userId, requestGeneration);

      if (cancelled || !isCurrentUser(userId, requestGeneration)) {
        return;
      }

      channel.current = supabase
        .channel(`budgetforge-sync-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "budgetforge_sync",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (!isCurrentUser(userId, requestGeneration)) {
              return;
            }

            const remote = payload.new.data;

            if (remote?.deviceId && remote.deviceId !== getDeviceId()) {
              replaceCloudSnapshot(remote.snapshot);
              setCloudOwnerId(userId);
              lastSnapshot.current = serializeCloudSnapshot(remote.snapshot);
              window.location.reload();
            }
          }
        )
        .subscribe();

      interval.current = window.setInterval(() => {
        syncSnapshot(userId, requestGeneration);
      }, 20000);
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [isCurrentUser, resetUserStorage, session, syncSnapshot]);

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    session,
    status,
    signIn,
    signOut,
    syncNow,
  }), [session, signIn, signOut, status, syncNow]);

  return (
    <CloudSyncContext.Provider value={value}>
      {children}
    </CloudSyncContext.Provider>
  );
}

export { CloudSyncProvider };
