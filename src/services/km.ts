export type KmKey = { key_ID: string; key: string };
export type KmKeysResponse = {
  master_SAE_ID: string;
  slave_SAE_ID: string;
  keys: KmKey[];
};

const base = import.meta.env.VITE_KM_BASE_URL;

export async function getKeys(slaveSaeId: string): Promise<KmKeysResponse> {
  const url = `${base}/api/v1/keys/${encodeURIComponent(slaveSaeId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KM error ${res.status}: ${text}`);
  }

  return res.json();
}
