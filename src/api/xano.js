// Minimal Xano client: auth + store helpers used by the app
const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE;
const API_BASE = import.meta.env.VITE_XANO_STORE_BASE;

export function getToken() {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null;
}

export async function authLogin({ email, password, remember = true }) {
  const res = await fetch(`${AUTH_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  const data = await res.json().catch(() => null);
  const token = data?.token || data?.authToken || data?.jwt || data?.accessToken || data?.access_token || null;
  if (token) {
    if (remember) localStorage.setItem('auth_token', token); else sessionStorage.setItem('auth_token', token);
  }
  
    // Intenta obtener el usuario normalizado desde /auth/me o desde endpoints alternativos
    try {
      const me = await authMe();
      if (me) {
        try { localStorage.setItem('auth_user', JSON.stringify(me)); } catch (e) {}
        return { ...data, token, user: me };
      }
    } catch (e) {
      // no interrumpir: devolver lo que tengamos
    }

    return { ...data, token };
}

export async function authMe() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${AUTH_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const payload = data?.user ?? data?.data ?? data;

  // If the auth response already contains role/status, return it directly
  const rolRaw = payload?.rol ?? payload?.role ?? '';
  const estadoRaw = payload?.estado ?? payload?.status ?? '';
  if (rolRaw && estadoRaw) return payload;

  // To avoid many failing/404 requests in environments where no user table endpoints exist,
  // only attempt ONE optional enrichment call when an explicit endpoint is configured via
  // VITE_XANO_USER_ENDPOINT. This prevents the noisy candidate probing seen in Network.
  const configuredUserEndpoint = import.meta.env.VITE_XANO_USER_ENDPOINT;
  if (configuredUserEndpoint) {
    try {
      // Allow the configured endpoint to be either a full URL or a relative path.
      let url = configuredUserEndpoint;
      if (!/^https?:\/\//i.test(url)) {
        // ensure proper joining
        url = `${API_BASE.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
      }

      // If placeholder {id} exists, replace it; otherwise, if endpoint contains a query,
      // try to append email param when available.
      if (payload?.id) url = url.replace('{id}', encodeURIComponent(payload.id));
      if (!url.includes('?') && payload?.email) url = `${url}?email=${encodeURIComponent(payload.email)}`;

      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) {
        const extra = await r.json().catch(() => null);
        const cand = extra?.user ?? extra?.data ?? extra ?? (Array.isArray(extra) ? extra[0] : null);
        if (cand) {
          const cRol = cand?.rol ?? cand?.role ?? '';
          const cEst = cand?.estado ?? cand?.status ?? '';
          if (cRol || cEst) {
            return { ...payload, rol: cRol || payload?.rol, estado: cEst || payload?.estado, extra: cand };
          }
        }
      }
    } catch (e) {
      // ignore and fall through to return payload
    }
  }

  // No enrichment available — return payload as-is to avoid multiple 404 requests.
  return payload;
}

export async function createProduct(token, payload) {
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${API_BASE}/producto`, { method: 'POST', headers, body: JSON.stringify({ ...payload, images: [] }) });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Error creando producto: ${res.status}`);
  return data;
}

export async function uploadImages(token, files = []) {
  if (!files || !files.length) return [];
  const uploads = files.map(async (f) => {
    const fd = new FormData(); fd.append('content', f);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const r = await fetch(`${API_BASE}/upload/image`, { method: 'POST', body: fd, headers });
    const d = await r.json().catch(() => null);
    if (!r.ok) throw new Error(d?.message || `Error subiendo imagen: ${r.status}`);
    if (Array.isArray(d)) return d[0] ?? null;
    if (d?.data && Array.isArray(d.data)) return d.data[0] ?? null;
    return d;
  });
  const results = await Promise.all(uploads);
  return results.filter(Boolean);
}

export async function attachImagesToProduct(token, productId, imagesArr = []) {
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const body = { images: (imagesArr || []).map(img => {
    if (!img) return null; if (typeof img === 'string') return { path: img }; if (img.path) return { path: img.path, name: img.name, mime: img.mime }; if (img.url) return { path: img.url }; return img;
  }).filter(Boolean) };
  const res = await fetch(`${API_BASE}/producto/${productId}`, { method: 'PATCH', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Error actualizando imágenes: ${res.status}`);
  return data;
}

export async function listProducts({ token } = {}) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  try {
    const res = await fetch(`${API_BASE}/producto`, { headers });
    if (!res.ok) return [];
    const data = await res.json().catch(() => null);
    const arr = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
    return (arr || []).map(p => ({ id: p.id, nombre_producto: p.nombre_producto || p.name || '', images: p.images || [], raw: p }));
  } catch (e) { return []; }
}