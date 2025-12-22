import { useState } from "react";
import { getKeys, KmKeysResponse } from "../services/km";

export default function KmTest() {
  const [slave, setSlave] = useState("bob");
  const [data, setData] = useState<KmKeysResponse | null>(null);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onFetch() {
    try {
      setErr("");
      setLoading(true);
      const res = await getKeys(slave);
      setData(res);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ margin: 0 }}>Security • KM Test</h2>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Fetch quantum keys from KM-mock (ETSI-like API) to prove key delivery works.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
        <label style={{ opacity: 0.9 }}>Recipient (slave_SAE_ID):</label>
        <input
          value={slave}
          onChange={(e) => setSlave(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            outline: "none",
            width: 240,
          }}
        />
        <button
          onClick={onFetch}
          disabled={loading}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.10)",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Fetching..." : "Fetch Key"}
        </button>
      </div>

      {err && (
        <pre style={{ marginTop: 16, padding: 12, background: "#3a1414", borderRadius: 12, overflow: "auto" }}>
          {err}
        </pre>
      )}

      {data && (
        <pre style={{ marginTop: 16, padding: 12, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "auto" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
