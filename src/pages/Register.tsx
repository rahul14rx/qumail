import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerThunk } from "../store/authSlice";

// --- ICONS ---
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);
const UserPlusIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
);

export default function Register() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);

  // Form State
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Logic State
  const [localError, setLocalError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setLocalError("Passwords do not match");
    } else {
      setLocalError(null);
    }
  }, [password, confirmPassword]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) return;

    const action = await dispatch(
      registerThunk({ name, username, email, password, confirmPassword })
    );

    if (registerThunk.fulfilled.match(action)) {
      setDone(true);
      setTimeout(() => nav("/login", { replace: true }), 1500);
    }
  }

  const toggleTheme = () => setIsDark(!isDark);
  const s = getStyles(isDark);

  return (
    <div style={s.page}>
      <div style={s.bgPattern} />

      <button onClick={toggleTheme} style={s.themeBtn} title="Toggle Theme">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logoIcon}>
            <UserPlusIcon />
          </div>
          <div>
            <h1 style={s.title}>New Identity</h1>
            <p style={s.sub}>Create your secure QuMail account</p>
          </div>
        </div>

        <form onSubmit={onSubmit} style={s.form}>
          <div style={s.inputGroup}>
            <label style={s.label}>Full Name</label>
            <input
              style={{ ...s.input, ...(focusedField === "name" ? s.inputFocus : {}) }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              placeholder="Alice Quantum"
            />
          </div>

          <div style={s.row}>
            <div style={s.inputGroup}>
              <label style={s.label}>Username</label>
              <input
                style={{ ...s.input, ...(focusedField === "user" ? s.inputFocus : {}) }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField("user")}
                onBlur={() => setFocusedField(null)}
                placeholder="alice"
              />
            </div>
            <div style={s.inputGroup}>
              <label style={s.label}>Email</label>
              <input
                style={{ ...s.input, ...(focusedField === "email" ? s.inputFocus : {}) }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="alice@qumail.com"
              />
            </div>
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>Password</label>
            <input
              style={{ ...s.input, ...(focusedField === "pass" ? s.inputFocus : {}) }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("pass")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
            />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>Confirm Password</label>
            <input
              style={{ ...s.input, ...(focusedField === "cpass" ? s.inputFocus : {}) }}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("cpass")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
            />
          </div>

          {localError ? <div style={s.error}>{localError}</div> : null}
          {error ? <div style={s.error}>{error}</div> : null}
          {done ? <div style={s.ok}>Registration Complete! Redirecting...</div> : null}

          <button 
            style={{...s.button, ...(status === 'loading' || !!localError ? {opacity: 0.7, cursor: 'not-allowed'} : {})}} 
            disabled={status === "loading" || !!localError}
          >
            {status === "loading" ? "Generating Keys..." : "Create Account"}
          </button>
        </form>

        <div style={s.footer}>
          <span>Already initialized?</span>{" "}
          <Link to="/login" style={s.link}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- STYLING SYSTEM (Reused from Login) ---

const getStyles = (isDark: boolean): Record<string, React.CSSProperties> => {
  const colors = isDark ? {
    bg: "#09090b",
    text: "#e2e8f0",
    textSub: "#94a3b8",
    cardBg: "rgba(20, 20, 25, 0.7)",
    border: "rgba(255, 255, 255, 0.1)",
    inputBg: "rgba(0, 0, 0, 0.4)",
    accent: "#3b82f6",
    accentGlow: "rgba(59, 130, 246, 0.5)",
    logoBg: "rgba(59, 130, 246, 0.15)",
    logoColor: "#60a5fa",
  } : {
    bg: "#f8fafc",
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
      width: "min(460px, 90vw)",
      background: colors.cardBg,
      backdropFilter: "blur(12px)",
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
      marginBottom: 24,
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
    form: { display: "grid", gap: 16 },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
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
      width: "100%", // ensure full width in grid
      boxSizing: "border-box",
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
      textAlign: "center" as const,
    },
    ok: {
      background: "rgba(34, 197, 94, 0.1)",
      color: "#22c55e",
      border: "1px solid rgba(34, 197, 94, 0.2)",
      padding: 12,
      borderRadius: 10,
      fontSize: 13,
      textAlign: "center" as const,
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