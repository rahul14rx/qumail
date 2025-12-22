import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

// --- ICONS ---
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default function MessageView() {
  const { id } = useParams();
  const nav = useNavigate();
  
  // Find the message in our Redux store (Inbox or Sent)
  const mail = useAppSelector((s) => 
    s.mail.inbox.find((m) => m.id === id) || 
    s.mail.sent.find((m) => m.id === id)
  );

  if (!mail) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
        Message not found. <br/>
        <button onClick={() => nav(-1)} style={{marginTop: 10, cursor: "pointer", background: "none", border: "1px solid #555", color: "white", padding: "5px 10px", borderRadius: 5}}>
            Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header / Toolbar */}
      <div style={styles.toolbar}>
        <button onClick={() => nav(-1)} style={styles.backBtn} title="Back">
          <ArrowLeftIcon />
        </button>
        <div style={styles.toolbarTitle}>Message Details</div>
      </div>

      <div style={styles.content}>
        {/* Subject Line */}
        <div style={styles.headerSection}>
          <h1 style={styles.subject}>{mail.subject}</h1>
          <div style={styles.metaRow}>
            {mail.level === 4 ? (
                <span style={styles.badgeUnsecure}>Unsecured Level 4</span>
            ) : (
                <span style={styles.badgeSecure}><LockIcon /> Quantum Encrypted</span>
            )}
            <span style={styles.date}>
              {new Date(mail.timestamp || Date.now()).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sender Info */}
        <div style={styles.senderSection}>
          <div style={styles.avatar}><UserIcon /></div>
          <div>
            <div style={styles.fromText}>
              <span style={{color: '#fff', fontWeight: 600}}>{mail.from}</span>
              <span style={{color: '#94a3b8'}}> to </span>
              <span style={{color: '#fff'}}>{mail.to}</span>
            </div>
            <div style={styles.idText}>Message ID: {mail.id}</div>
          </div>
        </div>

        {/* The Email Body */}
        <div style={styles.bodyBox}>
          {mail.body}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { height: "100%", display: "flex", flexDirection: "column", background: "#09090b", color: "#e2e8f0" },
  toolbar: {
    padding: "12px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  backBtn: {
    background: "transparent", border: "none", color: "#e2e8f0", 
    cursor: "pointer", display: "flex", alignItems: "center", padding: 4, borderRadius: 4,
  },
  toolbarTitle: { fontSize: 14, fontWeight: 500, color: "#94a3b8" },
  content: { padding: "24px 40px", overflowY: "auto", flex: 1 },
  
  headerSection: { marginBottom: 32 },
  subject: { fontSize: 24, fontWeight: 600, margin: "0 0 12px 0", color: "#fff" },
  metaRow: { display: "flex", alignItems: "center", gap: 16 },
  
  badgeSecure: { display: "flex", alignItems: "center", gap: 6, background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500 },
  badgeUnsecure: { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500 },
  date: { fontSize: 13, color: "#64748b" },

  senderSection: { display: "flex", gap: 16, marginBottom: 32, alignItems: "center" },
  avatar: { width: 48, height: 48, background: "rgba(255,255,255,0.05)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  fromText: { fontSize: 15 },
  idText: { fontSize: 12, color: "#64748b", marginTop: 2, fontFamily: "monospace" },

  bodyBox: {
    fontSize: 16, lineHeight: 1.6, color: "#e2e8f0", 
    whiteSpace: "pre-wrap", // Preserves line breaks
  },
};