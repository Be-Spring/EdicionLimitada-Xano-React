// src/api/xano.js
// Cliente mínimo para Xano: auth + helpers de productos

const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE;
const API_BASE = import.meta.env.VITE_XANO_STORE_BASE;

// ------------------------ TOKEN ------------------------
export function getToken() {
  return (
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('auth_token') ||
    null
  );
}

// ------------------------ LOGIN ADMIN ------------------------
export async function authLoginAdmin({ email, password, remember = true }) {
  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Error login admin: ${res.status}`;
    throw new Error(msg);
  }

  const token =
    data?.authToken ||
    data?.token ||
    data?.jwt ||
    data?.accessToken ||
    data?.access_token ||
    null;

  const user = data?.user || null;

  if (!token) throw new Error('Servidor no devolvió token');
  if (remember) localStorage.setItem('auth_token', token);
  else sessionStorage.setItem('auth_token', token);

  if (user) {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch {}
  }

  return { token, user, raw: data };
}

// ------------------------ LOGIN CLIENTE ------------------------
export async function authLoginCliente({ email, password, remember = true }) {
  const res = await fetch(`${AUTH_BASE}/auth/login_cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Error login cliente: ${res.status}`;
    throw new Error(msg);
  }

  const token =
    data?.authToken ||
    data?.token ||
    data?.jwt ||
    data?.accessToken ||
    data?.access_token ||
    null;

  const user = data?.user || null;

  if (!token) throw new Error('Servidor no devolvió token');
  if (remember) localStorage.setItem('auth_token', token);
  else sessionStorage.setItem('auth_token', token);

  if (user) {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch {}
  }

  return { token, user, raw: data };
}

// ------------------------ /auth/me ------------------------
export async function authMe() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${AUTH_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  const data = await res.json().catch(() => null);
  // tu auth/me ahora devuelve { user: {...} }
  return data?.user || data || null;
}

// ------------------------ PRODUCTOS (igual que ya tenías) --------------------
export async function createProduct(token, payload) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}/producto`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...payload, images: [] }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Error creando producto: ${res.status}`);
  return data;
}

export async function uploadImages(token, files = []) {
  if (!files || !files.length) return [];
  const uploads = files.map(async (f) => {
    const fd = new FormData();
    fd.append('content', f);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const r = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      body: fd,
      headers,
    });
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
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const body = {
    images: (imagesArr || [])
      .map((img) => {
        if (!img) return null;
        if (typeof img === 'string') return { path: img };
        if (img.path)
          return { path: img.path, name: img.name, mime: img.mime };
        if (img.url) return { path: img.url };
        return img;
      })
      .filter(Boolean),
  };
  const res = await fetch(`${API_BASE}/producto/${productId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(data?.message || `Error actualizando imágenes: ${res.status}`);
  return data;
}

export async function listProducts({ token } = {}) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  try {
    const res = await fetch(`${API_BASE}/producto`, { headers });
    if (!res.ok) return [];
    const data = await res.json().catch(() => null);
    const arr = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
    return (arr || []).map((p) => ({
      id: p.id,
      nombre_producto: p.nombre_producto || p.name || '',
      images: p.images || [],
      raw: p,
    }));
  } catch (e) {
    return [];
  }
}


// --- desde aqui el resto de funciones para producto (createProduct, uploadImages, etc.)

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