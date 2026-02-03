/**
 * API client – uses token from localStorage in Authorization header (no cookies).
 * Same-origin requests go through Vite proxy to the backend.
 */
const TOKEN_KEY = 'accessToken';
const base = import.meta.env.VITE_API_URL || '';

function getToken() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  } catch (_) {
    return null;
  }
}

export function setToken(token) {
  try {
    if (typeof window !== 'undefined' && token) localStorage.setItem(TOKEN_KEY, token);
  } catch (_) {}
}

export function clearToken() {
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
  } catch (_) {}
}

export async function api(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${base}${normalizedPath}`;
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(url, {
    ...options,
    headers,
    // No credentials so we don't rely on cookies
    credentials: 'omit',
  });
  let data = {};
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (_) {}
  if (!res.ok) {
    const msg = data.error || res.statusText || 'Request failed';
    const err = new Error(msg);
    err.status = res.status;
    err.code = data.code;
    throw err;
  }
  return data;
}

export function get(path) {
  return api(path, { method: 'GET' });
}

export function post(path, body) {
  return api(path, { method: 'POST', body: JSON.stringify(body) });
}

export function patch(path, body) {
  return api(path, { method: 'PATCH', body: JSON.stringify(body) });
}
