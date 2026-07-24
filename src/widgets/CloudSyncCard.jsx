import { useState } from "react";
import { CheckCircle2, Cloud, LogOut, RefreshCw } from "lucide-react";
import { useCloudSync } from "../features/cloud/CloudSyncProvider";

function CloudSyncCard() {
  const cloud = useCloudSync();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function requestLink(event) { event.preventDefault(); const { error } = await cloud.signIn(email.trim()); setMessage(error ? error.message : "Check your email for a secure sign-in link."); }
  async function sync() { const { error } = await cloud.syncNow(); setMessage(error ? error.message : "Your BudgetForge data is synced."); }
  if (!cloud.configured) return <div className="widget cloud-card"><Cloud size={28} /><h2>Cloud sync</h2><p className="text-muted">Supabase setup is required before accounts and multi-device sync can be enabled.</p><span className="cloud-status">Waiting for project configuration</span></div>;
  if (!cloud.session) return <div className="widget cloud-card"><Cloud size={28} /><h2>Cloud sync</h2><p className="text-muted">Sign in with your email to safely sync BudgetForge across your devices.</p><form onSubmit={requestLink}><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /><button type="submit">Send sign-in link</button></form>{message && <p className="cloud-message">{message}</p>}</div>;
  return <div className="widget cloud-card"><CheckCircle2 size={28} /><h2>Cloud sync active</h2><p className="text-muted">Signed in as {cloud.session.user.email}. Changes sync automatically and from your other devices.</p><span className="cloud-status">{cloud.status === "syncing" ? "Syncing…" : cloud.status === "error" ? "Sync needs attention" : "Synced"}</span><div className="cloud-actions"><button onClick={sync}><RefreshCw size={18} /> Sync now</button><button className="secondary-button" onClick={() => cloud.signOut()}><LogOut size={18} /> Sign out</button></div>{message && <p className="cloud-message">{message}</p>}</div>;
}

export default CloudSyncCard;
