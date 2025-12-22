import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { sendMailThunk } from "../services/mail";

// --- ICONS ---
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default function Compose() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  // Default to Plaintext (Level 4) for now. We will upgrade this later.
  const securityLevel = 4;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const payload = {
        from: user.username,
        to,
        subject,
        body,
        level: securityLevel,
      };

      await dispatch(sendMailThunk(payload)).unwrap();
      
      alert("✅ Message Sent!");
      nav("/app/inbox"); // Redirect to inbox after sending
    } catch (err: any) {
      alert("❌ Failed to send: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Top Action Bar */}
      <div style={styles.header}>
        <h2 style={styles.title}>New Message</h2>
        <div style={styles.actions}>
          <button type="button" onClick={() => nav(-1)} style={styles.cancelBtn}>
            Discard
          </button>
          <button onClick={handleSend} disabled={loading} style={styles.sendBtn}>
            {loading ? "Sending..." : <><SendIcon /> Send</>}
          </button>
        </div>
      </div>

      {/* Security Badge */}
      <div style={styles.securityBar}>
        <div style={styles.badge}>
           <span style={{color: '#ef4444'}}>●</span> Unsecured (Level 4)
        </div>
        <div style={styles.info}>
          Messages are sent in plaintext. Upgrade security level to encrypt.
        </div>
      </div>

      {/* Form Fields */}
      <form style={styles.form}>
        
        {/* TO Input */}
        <div style={styles.inputRow}>
          <div style={styles.iconWrapper}><UserIcon /></div>
          <input
            style={styles.input}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To (username, e.g. 'bob')"
            autoFocus
          />
        </div>

        {/* SUBJECT Input */}
        <div style={styles.inputRow}>
          <span style={styles.label}>Subject:</span>
          <input
            style={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What is this about?"
          />
        </div>

        {/* BODY Textarea */}
        <textarea
          style={styles.textarea}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your message here..."
        />
      </form>
    </div>
  );
}

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#09090b", // Ensure dark background
    color: "#e2e8f0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  title: { margin: 0, fontSize: 20, fontWeight: 600 },
  actions: { display: "flex", gap: 12 },
  
  securityBar: {
    background: "rgba(255,255,255,0.02)",
    padding: "8px 24px",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 16,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,0.05)",
    padding: "4px 10px",
    borderRadius: 12,
    fontWeight: 500,
    color: "#cbd5e1",
  },
  info: { opacity: 0.5 },

  form: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "0 24px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  label: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 500,
    minWidth: 60,
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#fff", // Bright text
    fontSize: 15,
    outline: "none",
    fontFamily: "inherit",
  },
  textarea: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 15,
    padding: "24px 0",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    lineHeight: 1.6,
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#94a3b8",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
  sendBtn: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "8px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
};