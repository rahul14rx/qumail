import { NavLink, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import Inbox from "../pages/Inbox";
import KmTest from "../pages/KmTest";
import Compose from "../pages/Compose"; // <--- 1. ENSURE THIS IMPORT EXISTS
import MessageView from "../pages/MessageView";
// --- ICONS ---
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const LogOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: isActive ? "#ffffff" : "#94a3b8",
  background: isActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
  borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
  fontSize: 14,
  fontWeight: isActive ? 600 : 500,
  transition: "all 0.2s ease",
});

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const getTitle = () => {
    if (location.pathname.includes("km-test")) return "Security / Key Manager";
    if (location.pathname.includes("sent")) return "Sent Items";
    if (location.pathname.includes("compose")) return "New Message";
    return "Inbox";
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logo}>Q</div>
          QuMail
        </div>

        <div style={styles.sectionLabel}>FOLDERS</div>
        <nav style={styles.nav}>
          <NavLink to="/app/inbox" style={linkStyle}>
            <MailIcon /> Inbox
          </NavLink>
          <NavLink to="/app/sent" style={linkStyle}>
            <SendIcon /> Sent
          </NavLink>
          
          <div style={{...styles.sectionLabel, marginTop: 20}}>SECURITY</div>
          <NavLink to="/app/security/km-test" style={linkStyle}>
            <ShieldIcon /> KM Diagnosis
          </NavLink>
        </nav>

        <div style={{ marginTop: "auto" }}>
            <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOutIcon /> Logout
            </button>
            <div style={styles.status}>
            <div style={styles.dot}></div>
            <span style={{ fontSize: 12 }}>System Secure</span>
            </div>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.pageTitle}>{getTitle()}</div>
          
          <div style={styles.searchBar}>
            <input placeholder="Search encrypted mails..." style={styles.searchInput} />
          </div>

          {/* 2. FIXED: Use Absolute Path "/app/compose" */}
          <button onClick={() => navigate('/app/compose')} style={styles.composeBtn}>
            + Compose
          </button>
        </header>

        <div style={styles.content}>
          {/* 3. ENSURE ROUTE EXISTS */}
          <Routes>
            <Route path="/" element={<Navigate to="inbox" replace />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="sent" element={<Inbox />} />
            <Route path="compose" element={<Compose />} />
            <Route path="security/km-test" element={<KmTest />} />
            <Route path="message/:id" element={<MessageView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    height: "100vh",
    display: "flex",
    background: "#09090b", 
    color: "#e2e8f0",
    overflow: "hidden",
  },
  sidebar: {
    width: 260,
    background: "#0c0c10",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    padding: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 32,
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "white",
  },
  logo: {
    width: 32,
    height: 32,
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    fontSize: 18,
    color: "white",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#64748b",
    marginBottom: 8,
    paddingLeft: 12,
    letterSpacing: 0.5,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px 12px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginBottom: 8,
    borderRadius: 8,
    transition: "all 0.2s",
  },
  status: {
    padding: 12,
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#22c55e",
  },
  dot: {
    width: 8,
    height: 8,
    background: "#22c55e",
    borderRadius: "50%",
    boxShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#09090b",
  },
  header: {
    height: 64,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    gap: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 600,
    minWidth: 200,
  },
  searchBar: {
    flex: 1,
    maxWidth: 600,
  },
  searchInput: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 12,
    background: "#18181b",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
    fontSize: 14,
  },
  composeBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  content: {
    flex: 1,
    overflow: "auto",
    padding: 0, 
  }
};