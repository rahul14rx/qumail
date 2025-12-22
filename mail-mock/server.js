import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 6060);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const adapter = new JSONFile(path.join(__dirname, "maildb.json"));
const db = new Low(adapter, { messages: [], users: [] });

await db.read();
db.data ||= { messages: [], users: [] };
db.data.users ||= [];
db.data.messages ||= [];
await db.write();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "25mb" }));

app.get("/", (_req, res) => res.json({ service: "mail-mock", ok: true }));
app.get("/health", (_req, res) => res.json({ status: "UP" }));

function publicUser(u) {
  return { id: u.id, name: u.name, username: u.username, email: u.email, createdAt: u.createdAt };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
}

/**
 * AUTH: REGISTER
 * POST /api/v1/auth/register
 * body: { name, username, email, password, confirmPassword }
 */
app.post("/api/v1/auth/register", async (req, res) => {
  const { name, username, email, password, confirmPassword } = req.body ?? {};

  if (!name || !username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Missing fields" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  await db.read();
  const emailLower = String(email).trim().toLowerCase();
  const usernameLower = String(username).trim().toLowerCase();

  const emailTaken = db.data.users.find((u) => u.email.toLowerCase() === emailLower);
  if (emailTaken) return res.status(409).json({ error: "Email already registered" });

  const usernameTaken = db.data.users.find((u) => u.username.toLowerCase() === usernameLower);
  if (usernameTaken) return res.status(409).json({ error: "Username already taken" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: nanoid(),
    name: String(name).trim(),
    username: usernameLower,
    email: emailLower,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.data.users.push(user);
  await db.write();

  res.json({ ok: true, user: publicUser(user) });
});

/**
 * AUTH: LOGIN (identifier can be email OR username)
 * POST /api/v1/auth/login
 * body: { identifier, password }
 */
app.post("/api/v1/auth/login", async (req, res) => {
  const { identifier, password } = req.body ?? {};
  if (!identifier || !password) return res.status(400).json({ error: "Missing identifier/password" });

  await db.read();
  const idLower = String(identifier).trim().toLowerCase();

  const user =
    db.data.users.find((u) => u.email.toLowerCase() === idLower) ||
    db.data.users.find((u) => u.username.toLowerCase() === idLower);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user);
  res.json({ ok: true, token, user: publicUser(user) });
});

/**
 * AUTH: ME
 * GET /api/v1/auth/me
 */
app.get("/api/v1/auth/me", authRequired, async (req, res) => {
  await db.read();
  const user = db.data.users.find((u) => u.id === req.auth.sub);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ ok: true, user: publicUser(user) });
});

// ====== MAIL ENDPOINTS (unchanged for now) ======

// SEND MAIL
app.post("/api/v1/send", async (req, res) => {
  const { from, to, subject = "", body = "", cipher = null, meta = {} } = req.body ?? {};
  if (!from || !to) return res.status(400).json({ error: "Missing from/to" });

  const msg = {
    id: nanoid(),
    from,
    to,
    subject,
    body,     // plaintext for now (later: remove)
    cipher,   // later: encrypted envelope
    meta,
    createdAt: new Date().toISOString(),
    readAt: null
  };

  db.data.messages.push(msg);
  await db.write();

  res.json({ ok: true, id: msg.id });
});

// INBOX
app.get("/api/v1/inbox/:user", async (req, res) => {
  const user = String(req.params.user || "").trim();
  await db.read();

  const messages = db.data.messages
    .filter((m) => m.to === user)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  res.json({ user, messages });
});

// SENT
app.get("/api/v1/sent/:user", async (req, res) => {
  
  const user = String(req.params.user || "").trim();
  await db.read();

  const messages = db.data.messages
    .filter((m) => m.from === user)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  res.json({ user, messages });
});

// READ ONE MESSAGE
app.get("/api/v1/message/:id", async (req, res) => {
  const id = String(req.params.id || "");
  await db.read();

  const msg = db.data.messages.find((m) => m.id === id);
  if (!msg) return res.status(404).json({ error: "Not found" });

  res.json(msg);
});

app.listen(PORT, () => {
  console.log(`mail-mock running on http://localhost:${PORT}`);
});
