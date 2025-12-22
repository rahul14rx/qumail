import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchInboxThunk } from "../store/mailStore";
import { useLocation, useNavigate } from "react-router-dom"; // <--- Import useLocation

// --- ICONS ---
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const UnlockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
);
const SentPlaneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

export default function Inbox() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // <--- Check current URL
  
  const { user } = useAppSelector((s) => s.auth);
  const { inbox, sent, loading, error } = useAppSelector((s) => s.mail);

  // 1. DETERMINE MODE: Are we in Inbox or Sent?
  const isSentBox = location.pathname.includes("sent");
  
  // 2. SELECT DATA: Pick the right list
  const mails = isSentBox ? sent : inbox;

  // Auto-fetch on mount
  useEffect(() => {
    if (user?.username) {
      dispatch(fetchInboxThunk(user.username));
    }
  }, [user, dispatch]);

  const handleRefresh = () => {
    if (user?.username) dispatch(fetchInboxThunk(user.username));
  };

  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.count}>
            {/* Dynamic Title */}
            {isSentBox ? "Sent Items" : "Inbox"} • {mails.length} messages
        </div>
        <button onClick={handleRefresh} style={styles.refreshBtn} disabled={loading}>
          <RefreshIcon /> {loading ? "Syncing..." : "Refresh"}
        </button>
      </div>

      {/* Error Banner */}
      {error && <div style={styles.error}>Error: {error}</div>}

      {/* Email List */}
      <div style={styles.list}>
        {mails.length === 0 && !loading ? (
          <div style={styles.empty}>
            {isSentBox ? "No sent messages found." : "Inbox is empty."}
          </div>
        ) : (
          mails.map((mail) => (
            <div 
                key={mail.id} 
                style={styles.row}
                onClick={() => navigate(`/app/message/${mail.id}`)}
            >
              {/* Avatar: Show 'To' for Sent box, 'From' for Inbox */}
              <div style={styles.avatar}>
                {isSentBox ? mail.to[0].toUpperCase() : mail.from[0].toUpperCase()}
              </div>
              
              <div style={styles.content}>
                <div style={styles.topRow}>
                  {/* Sender/Receiver Label */}
                  <span style={styles.sender}>
                    {isSentBox ? <>To: {mail.to}</> : mail.from}
                  </span>
                  <span style={styles.date}>
                    {new Date(mail.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div style={styles.subjectRow}>
                  {isSentBox && <span style={{marginRight: 6, display:'flex'}}><SentPlaneIcon/></span>}
                  <span style={styles.subject}>{mail.subject || "(No Subject)"}</span>
                  
                  {/* Security Badge */}
                  {mail.level === 4 ? (
                    <span title="Unsecured" style={{marginLeft: 8}}><UnlockIcon/></span>
                  ) : (
                    <span title="Encrypted" style={{marginLeft: 8}}><LockIcon/></span>
                  )}
                </div>
                
                <div style={styles.preview}>
                  {mail.body.substring(0, 60)}...
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { height: "100%", display: "flex", flexDirection: "column", color: "#e2e8f0" },
  toolbar: {
    padding: "12px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  count: { fontSize: 13, color: "#94a3b8", fontWeight: 600 },
  refreshBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e2e8f0",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
  },
  error: { padding: 12, background: "#451a1a", color: "#f87171", fontSize: 13, textAlign: "center" },
  list: { flex: 1, overflowY: "auto" },
  empty: { padding: 40, textAlign: "center", opacity: 0.5, fontStyle: "italic" },
  
  row: {
    display: "flex",
    gap: 16,
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  avatar: {
    width: 40, height: 40, borderRadius: "50%",
    background: "linear-gradient(135deg, #475569, #334155)",
    display: "grid", placeItems: "center", fontWeight: 600,
    fontSize: 16, color: "white", flexShrink: 0,
  },
  content: { flex: 1, minWidth: 0 },
  topRow: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  sender: { fontWeight: 600, fontSize: 14, color: "#fff" },
  date: { fontSize: 12, color: "#64748b" },
  subjectRow: { display: "flex", alignItems: "center", marginBottom: 4 },
  subject: { fontSize: 14, color: "#e2e8f0", fontWeight: 500 },
  preview: { fontSize: 13, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
};