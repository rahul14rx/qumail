import "dotenv/config";
import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";

const app = express();

// allow all origins (works even for Electron/file:// origin "null")
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 5050);
const MASTER_SAE_ID = process.env.MASTER_SAE_ID ?? "alice";
const KEY_BYTES = Number(process.env.KEY_BYTES ?? 32);

// "alice::bob" -> [{ key_ID, key }]
const store = new Map();

const pairKey = (master, slave) => `${master}::${slave}`;

function issueKeys(master, slave, count = 1) {
  const k = pairKey(master, slave);
  const arr = store.get(k) || [];

  for (let i = 0; i < count; i++) {
    arr.push({
      key_ID: uuidv4(),
      key: randomBytes(KEY_BYTES).toString("base64"),
    });
  }

  store.set(k, arr);
  return arr.slice(-count);
}

app.get("/", (_req, res) => {
  res.json({ service: "km-mock", ok: true, master_SAE_ID: MASTER_SAE_ID });
});

app.get("/health", (_req, res) => {
  res.json({ status: "UP", master_SAE_ID: MASTER_SAE_ID });
});

app.get("/api/v1/keys/:slave", (req, res) => {
  const slave = String(req.params.slave || "").trim();
  const size = Number(req.query.size || 1);
  if (!slave) return res.status(400).json({ error: "Missing slave_SAE_ID" });

  const keys = issueKeys(MASTER_SAE_ID, slave, Math.max(1, Math.min(size, 10)));
  res.json({ master_SAE_ID: MASTER_SAE_ID, slave_SAE_ID: slave, keys });
});

app.get("/api/v1/keys", (req, res) => {
  const slave = String(req.query.slave_SAE_ID || "").trim();
  const size = Number(req.query.size || 1);
  if (!slave) return res.status(400).json({ error: "Missing slave_SAE_ID" });

  const keys = issueKeys(MASTER_SAE_ID, slave, Math.max(1, Math.min(size, 10)));
  res.json({ master_SAE_ID: MASTER_SAE_ID, slave_SAE_ID: slave, keys });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`km-mock running on http://127.0.0.1:${PORT}`);
});
// Fetch a specific key by key_ID (so receiver can decrypt)
app.get("/api/v1/key/:keyId", (req, res) => {
  const keyId = String(req.params.keyId || "").trim();
  const slave = String(req.query.slave_SAE_ID || "").trim();
  const master = String(req.query.master_SAE_ID || MASTER_SAE_ID).trim();

  if (!keyId) return res.status(400).json({ error: "Missing keyId" });
  if (!slave) return res.status(400).json({ error: "Missing slave_SAE_ID" });

  const k = pairKey(master, slave);
  const arr = store.get(k) || [];
  const found = arr.find((x) => x.key_ID === keyId);

  if (!found) return res.status(404).json({ error: "Key not found" });

  res.json({ master_SAE_ID: master, slave_SAE_ID: slave, key: found });
});
