const base = import.meta.env.VITE_API_URL || '';

export async function api(path, options = {}, retried = false) {
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && data.code === 'TOKEN_EXPIRED' && !retried) {
      try {
        await fetch(`${base}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
        return api(path, options, true);
      } catch (_) {}
    }
    const err = new Error(data.error || res.statusText);
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
