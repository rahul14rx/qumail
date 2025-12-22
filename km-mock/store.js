const crypto = require("crypto");

const pools = new Map();

function poolKey(master, slave) {
  return `${master}::${slave}`;
}

function issueKeys(master, slave, number, sizeBytes) {
  const k = poolKey(master, slave);
  if (!pools.has(k)) pools.set(k, []);
  const pool = pools.get(k);

  const keys = [];
  for (let i = 0; i < number; i++) {
    const buf = crypto.randomBytes(sizeBytes);
    const key_ID = crypto.randomUUID();

    const entry = {
      key_ID,
      key: buf.toString("base64"),
      created_at: new Date().toISOString()
    };

    pool.push(entry);
    keys.push({ key_ID, key: entry.key });
  }

  return { keys };
}

function getPoolStats() {
  const out = {};
  for (const [k, arr] of pools.entries()) {
    out[k] = { count: arr.length, last_created_at: arr.at(-1)?.created_at ?? null };
  }
  return out;
}

module.exports = { issueKeys, getPoolStats };
