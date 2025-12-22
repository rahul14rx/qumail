const base = import.meta.env.VITE_MAIL_BASE_URL;

export type PublicUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: string;
};

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = {
  identifier: string; // username OR email
  password: string;
};

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export function registerUser(payload: RegisterPayload) {
  return http<{ ok: true; user: PublicUser }>(`${base}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginPayload) {
  return http<{ ok: true; token: string; user: PublicUser }>(`${base}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function me(token: string) {
  return http<{ ok: true; user: PublicUser }>(`${base}/api/v1/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}
