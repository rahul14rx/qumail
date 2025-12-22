import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginThunk, meThunk } from "../store/authSlice";

// Simple icons as components (so we don't crash if you lack an icon library)
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);
const LockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default function Login() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const { token, user, status, error } = useAppSelector((s) => s.auth);

  // State for inputs
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  // State for Theme (Default to Dark)
  const [isDark, setIsDark] = useState(true);

  // Focus states for style interactions
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (token && !user) dispatch(meThunk(token));
  }, [token, user, dispatch]);

  useEffect(() => {
    if (token && user) nav("/app", { replace: true });
  }, [token, user, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await dispatch(loginThunk({ identifier, password }));
  }

  const toggleTheme = () => setIsDark(!isDark);
  
  // Get active styles based on theme
  const s = getStyles(isDark);

  return (
    <div style={s.page}>
      {/* Background Pattern */}
      <div style={s.bgPattern} />

      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} style={s.themeBtn} title="Toggle Theme">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div style={s.card}>
        {/* Header Section */}
        <div style={s.header}>
          <div style={s.logoIcon}>
            <LockIcon />
          </div>
          <div>
            <h1 style={s.title}>QuMail</h1>
            <p style={s.sub}>Quantum-Secured Communication</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={onSubmit} style={s.form}>
          
          <div style={s.inputGroup}>
            <label style={s.label}>Username or Email</label>
            <input
              style={{
                ...s.input,
                ...(focusedField === "id" ? s.inputFocus : {}),
              }}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onFocus={() => setFocusedField("id")}
              onBlur={() => setFocusedField(null)}
              autoComplete="username"
              placeholder="alice@qumail.com"
            />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>Password</label>
            <input
              style={{
                ...s.input,
                ...(focusedField === "pass" ? s.inputFocus : {}),
              }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("pass")}
              onBlur={() => setFocusedField(null)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {error ? <div style={s.error}>{error}</div> : null}

          <button 
            style={{...s.button, ...(status === 'loading' ? {opacity: 0.7} : {})}} 
            disabled={status === "loading"}
          >
            {status === "loading" ? "Decrypting Access..." : "Secure Login"}
          </button>
        </form>

        <div style={s.footer}>
          <span>New Identity?</span>{" "}
          <Link to="/register" style={s.link}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- STYLING SYSTEM ---

const getStyles = (isDark: boolean): Record<string, React.CSSProperties> => {
  const colors = isDark ? {
    bg: "#09090b", // Deep black/slate
    text: "#e2e8f0",
    textSub: "#94a3b8",
    cardBg: "rgba(20, 20, 25, 0.7)",
    border: "rgba(255, 255, 255, 0.1)",
    inputBg: "rgba(0, 0, 0, 0.4)",
    accent: "#3b82f6", // Blue
    accentGlow: "rgba(59, 130, 246, 0.5)",
    logoBg: "rgba(59, 130, 246, 0.15)",
    logoColor: "#60a5fa",
  } : {
    bg: "#f8fafc", // Light gray/white
    text: "#1e293b",
    textSub: "#64748b",
    cardBg: "rgba(255, 255, 255, 0.8)",
    border: "rgba(0, 0, 0, 0.06)",
    inputBg: "#ffffff",
    accent: "#2563eb",
    accentGlow: "rgba(37, 99, 235, 0.3)",
    logoBg: "rgba(37, 99, 235, 0.1)",
    logoColor: "#2563eb",
  };

  return {
    page: {
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: colors.bg,
      color: colors.text,
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
      transition: "background 0.3s ease",
    },
    // The "2D" Grid Pattern
    bgPattern: {
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: isDark 
        ? "radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)"
        : "radial-gradient(#000000 1px, transparent 1px), radial-gradient(#000000 1px, transparent 1px)",
      backgroundSize: "40px 40px",
      backgroundPosition: "0 0, 20px 20px",
      opacity: isDark ? 0.07 : 0.05,
      zIndex: 0,
    },
    themeBtn: {
      position: "absolute",
      top: 20,
      right: 20,
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: "50%",
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: colors.text,
      zIndex: 10,
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    card: {
      width: "min(400px, 90vw)",
      background: colors.cardBg,
      backdropFilter: "blur(12px)", // Glassmorphism
      WebkitBackdropFilter: "blur(12px)",
      border: `1px solid ${colors.border}`,
      borderRadius: 24,
      padding: 32,
      zIndex: 1,
      boxShadow: isDark 
        ? "0 20px 40px -10px rgba(0,0,0,0.5)" 
        : "0 20px 40px -10px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 32,
    },
    logoIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      background: colors.logoBg,
      color: colors.logoColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    title: { margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" },
    sub: { margin: 0, fontSize: 13, color: colors.textSub, marginTop: 2 },
    form: { display: "grid", gap: 20 },
    inputGroup: { display: "grid", gap: 8 },
    label: { fontSize: 13, fontWeight: 500, color: colors.textSub, marginLeft: 4 },
    input: {
      padding: "12px 16px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: 15,
      outline: "none",
      transition: "all 0.2s ease",
    },
    inputFocus: {
      borderColor: colors.accent,
      boxShadow: `0 0 0 3px ${colors.accentGlow}`,
    },
    button: {
      marginTop: 8,
      padding: "14px",
      borderRadius: 12,
      border: "none",
      background: `linear-gradient(135deg, ${colors.accent}, ${isDark ? '#2563eb' : '#1d4ed8'})`,
      color: "white",
      fontWeight: 600,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: `0 4px 12px ${colors.accentGlow}`,
      transition: "transform 0.1s ease",
    },
    error: {
      background: "rgba(239, 68, 68, 0.1)",
      color: "#ef4444",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      padding: 12,
      borderRadius: 10,
      fontSize: 13,
      textAlign: "center" as const, // TS compatibility
    },
    footer: { 
      marginTop: 24, 
      textAlign: "center" as const, 
      fontSize: 14, 
      color: colors.textSub 
    },
    link: { 
      color: colors.accent, 
      fontWeight: 500, 
      textDecoration: "none",
      marginLeft: 4,
    },
  };
};