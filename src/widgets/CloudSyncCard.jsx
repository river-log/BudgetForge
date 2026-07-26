import { useState } from "react";
import { CheckCircle2, Cloud, LogOut, RefreshCw } from "lucide-react";
import useCloudSync from "../features/cloud/useCloudSync";
import { useConnectivity } from "../native/useConnectivity";

function CloudSyncCard() {
  const cloud = useCloudSync();
  const online = useConnectivity();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function requestLink(event) { event.preventDefault(); if (busy) return; setBusy(true); const { error } = await cloud.signIn(email.trim()); setMessage(error ? error.message : "Check your email for a secure sign-in link."); setBusy(false); }
  async function sync() { if (busy) return; setBusy(true); const { error } = await cloud.syncNow(); setMessage(error ? error.message : "Your BudgetForge data is synced."); setBusy(false); }
  if (!cloud.configured) return <div className="widget cloud-card"><Cloud size={28} /><h2>Cloud sync</h2><p className="text-muted">Supabase setup is required before accounts and multi-device sync can be enabled.</p><span className="cloud-status">Waiting for project configuration</span></div>;
  if (!cloud.session) return <div className="widget cloud-card"><Cloud size={28} aria-hidden="true" /><h2>Cloud sync</h2><p className="text-muted">Sign in with your email to safely sync BudgetForge across your devices.</p><form onSubmit={requestLink}><label className="sr-only" htmlFor="cloud-sync-email">Email address</label><input id="cloud-sync-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={busy} /><button type="submit" disabled={busy}>{busy ? "Sending…" : "Send sign-in link"}</button></form>{cloud.authError && <p className="cloud-message cloud-message--error" role="alert">{cloud.authError}</p>}{message && <p className="cloud-message" role="status" aria-live="polite">{message}</p>}</div>;
  return <div className="widget cloud-card"><CheckCircle2 size={28} aria-hidden="true" /><h2>Cloud sync active</h2><p className="text-muted">Signed in as {cloud.session.user.email}. Changes sync automatically and from your other devices.</p><span className="cloud-status" role="status" aria-live="polite">{cloud.status === "syncing" ? "Syncing…" : cloud.status === "error" ? "Sync needs attention" : "Synced"}</span><div className="cloud-actions"><button onClick={sync} disabled={busy || !online}><RefreshCw size={18} aria-hidden="true" /> {busy ? "Syncing…" : online ? "Sync now" : "Offline"}</button><button className="secondary-button" onClick={() => cloud.signOut()} disabled={busy}><LogOut size={18} aria-hidden="true" /> Sign out</button></div>{message && <p className="cloud-message" role="status" aria-live="polite">{message}</p>}</div>;
}

export default CloudSyncCard;
