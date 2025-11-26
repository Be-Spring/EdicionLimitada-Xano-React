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
  // Try multiple endpoints and payload shapes because some Xano setups
  // expose different login endpoints or expect `identifier` instead of `email`.
  const endpoints = ['/auth/login_cliente', '/auth/login'];
  const payloads = [
    { email, password },
    { identifier: email, password },
    { username: email, password },
  ];

  let lastError = null;
  for (const ep of endpoints) {
    for (const body of payloads) {
      try {
        const res = await fetch(`${AUTH_BASE}${ep}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          lastError = data?.message || data?.error || `Error login cliente (${res.status})`;
          // try next payload/endpoint
          continue;
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
          try { localStorage.setItem('auth_user', JSON.stringify(user)); } catch {}
        }

        return { token, user, raw: data };
      } catch (err) {
        lastError = err?.message || String(err);
        // try next
      }
    }
  }

  throw new Error(lastError || 'Error al iniciar sesión (cliente)');
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

// ------------------------ REGISTER (try several auth endpoints) ------------------------
export async function authRegister(payload = {}) {
  // try the most likely auth signup path first (your Xano uses /auth/signup)
  const tryPaths = ['/auth/signup', '/auth/register_cliente', '/auth/register', '/auth/create'];
  let lastError = null;
  for (const p of tryPaths) {
    try {
      const res = await fetch(`${AUTH_BASE}${p}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) return data;
      // If server responded but not ok, capture message and try next
      lastError = data?.message || data?.error || `Error registro (${res.status})`;
    } catch (err) {
      lastError = err?.message || String(err);
    }
  }
  // none succeeded
  throw new Error(lastError || 'No se pudo registrar (endpoints de registro no disponibles)');
}

// ------------------------ PRODUCTOS (igual que ya tenías) --------------------
export async function createProduct(token, payload) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // sanitize payload: remove empty strings, coerce numeric fields to numbers
  const bodyToSend = { ...payload };
  // remove client-only keys
  delete bodyToSend.images;
  delete bodyToSend.keepImages;

  // normalize numeric fields
  const toInt = (v) => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? (Math.trunc(n)) : undefined;
  };
  if ('valor_producto' in bodyToSend) bodyToSend.valor_producto = toInt(bodyToSend.valor_producto);
  if ('stock' in bodyToSend) bodyToSend.stock = toInt(bodyToSend.stock);
  if ('categoria' in bodyToSend) {
    const c = toInt(bodyToSend.categoria);
    if (c === undefined) delete bodyToSend.categoria; else bodyToSend.categoria = c;
  }
  if ('disenador' in bodyToSend) {
    const d = toInt(bodyToSend.disenador);
    if (d === undefined) delete bodyToSend.disenador; else bodyToSend.disenador = d;
  }

  // remove any empty-string fields
  Object.keys(bodyToSend).forEach((k) => {
    if (bodyToSend[k] === '') delete bodyToSend[k];
  });

  const res = await fetch(`${API_BASE}/producto`, {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyToSend),
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
    // Normalize different Xano upload shapes into a consistent object with `path`
    let item = null;
    if (Array.isArray(d) && d.length) item = d[0];
    else if (d && d.data && Array.isArray(d.data) && d.data.length) item = d.data[0];
    else item = d;

    if (!item) return null;
    // If server returned a plain string (path/url)
    if (typeof item === 'string') return { path: item };
    // Common variants: `path`, `url`, `file_path`
    if (item.path) return item;
    if (item.url) return { ...item, path: item.url };
    if (item.file_path) return { ...item, path: item.file_path };
    // If the server nested the object under `data` or similar, keep what we have
    return item;
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
        // string path -> wrap and set type
        if (typeof img === 'string') return { path: img, type: 'image' };
        // uploaded object with path
        if (img.path) {
          return {
            path: img.path,
            name: img.name || img.filename || img.fileName,
            mime: img.mime || img.type || img.mimeType,
            type: img.type || 'image',
            size: img.size,
            access: img.access || img.visibility || 'public',
            meta: img.meta && typeof img.meta === 'object' ? img.meta : { width: img.width || 0, height: img.height || 0 },
          };
        }
        // object with url
        if (img.url) return { path: img.url, type: img.type || 'image', meta: img.meta && typeof img.meta === 'object' ? img.meta : { width: img.width || 0, height: img.height || 0 } };
        // fallback: ensure type exists
        return { ...(img || {}), type: img.type || 'image' };
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

// ------------------------ DISEÑADORES ------------------------
export async function listDesigners({ token } = {}) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  try {
    const res = await fetch(`${API_BASE}/disenador`, { headers });
    if (!res.ok) return [];
    const data = await res.json().catch(() => null);
    const arr = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
    return (arr || []).map((d) => ({
      id: d.id,
      nombre_disenador: d.nombre_disenador || d.name || '',
      images: Array.isArray(d.images) ? d.images : (d.images ? [d.images] : []),
      raw: d,
    }));
  } catch (e) {
    return [];
  }
}

export async function createDesigner(token, payload = {}) {
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  // send only name on create; images will be attached afterwards if any
  const body = { nombre_disenador: payload.nombre_disenador || payload.name || '' };
  const res = await fetch(`${API_BASE}/disenador`, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Error creando diseñador: ${res.status}`);
  const created = data;
  // handle images (files + kept)
  const files = payload.images || [];
  const kept = payload.keepImages || [];
  const uploaded = await uploadImages(token, files || []);
  const finalImages = [ ...(kept || []), ...(uploaded || []) ]
    .map(im => {
      if (!im) return null;
      if (typeof im === 'string') return { path: im, type: 'image' };
      if (im.path) return { path: im.path, name: im.name || im.filename, mime: im.mime || im.type, type: im.type || 'image', size: im.size, access: im.access || 'public', meta: im.meta || (im.width || im.height ? { width: im.width || 0, height: im.height || 0 } : {}) };
      if (im.url) return { path: im.url, type: im.type || 'image', meta: im.meta || {} };
      return null; // ensure we don't pass objects without path/url
    })
    .filter(it => it && it.path);
  if (finalImages.length) {
    // Always send an array for images (backend usually expects an array)
    const imagesPayload = finalImages;
    const patchRes = await fetch(`${API_BASE}/disenador/${created.id}`, { method: 'PATCH', headers, body: JSON.stringify({ images: imagesPayload }) });
    const patched = await patchRes.json().catch(() => null);
    if (!patchRes.ok) throw new Error(patched?.message || `Error attach diseñador images: ${patchRes.status}`);
    return patched;
  }
  return created;
}

export async function updateDesigner(token, designerId, payload = {}) {
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const bodyFields = { nombre_disenador: payload.nombre_disenador || payload.name };
  const res = await fetch(`${API_BASE}/disenador/${designerId}`, { method: 'PATCH', headers, body: JSON.stringify(bodyFields) });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Error actualizando diseñador: ${res.status}`);
  // handle images
  const files = payload.images || [];
  const kept = payload.keepImages || [];
  const uploaded = await uploadImages(token, files || []);
  const finalImages = [ ...(kept || []), ...(uploaded || []) ].map(im => {
    if (!im) return null;
    if (typeof im === 'string') return { path: im, type: 'image' };
    if (im.path) return { path: im.path, name: im.name || im.filename, mime: im.mime || im.type, type: im.type || 'image', size: im.size, access: im.access || 'public', meta: im.meta || (im.width || im.height ? { width: im.width || 0, height: im.height || 0 } : {}) };
    if (im.url) return { path: im.url, type: im.type || 'image', meta: im.meta || {} };
    return im;
  }).filter(Boolean);
  if (finalImages.length) {
    const imagesPayload = finalImages;
    const patchRes = await fetch(`${API_BASE}/disenador/${designerId}`, { method: 'PATCH', headers, body: JSON.stringify({ images: imagesPayload }) });
    const patched = await patchRes.json().catch(() => null);
    if (!patchRes.ok) throw new Error(patched?.message || `Error attach diseñador images: ${patchRes.status}`);
    return patched;
  }
  return data;
}

export async function deleteDesigner(token, designerId) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${API_BASE}/disenador/${designerId}`, { method: 'DELETE', headers });
  if (!res.ok) {
    const d = await res.json().catch(() => null);
    throw new Error(d?.message || `Error eliminando diseñador: ${res.status}`);
  }
  return true;
}

export async function listProducts({ token } = {}) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  try {
    const res = await fetch(`${API_BASE}/producto`, { headers });
    if (!res.ok) return [];
    const data = await res.json().catch(() => null);
    const arr = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
    return (arr || []).map((p) => {
      const designerObj = p.disenador || p.disenador_id || p.disenador_nombre || null;
      const disenador_nombre = (typeof designerObj === 'object' ? (designerObj.nombre_disenador || designerObj.name) : (p.disenador_nombre || designerObj || ''));
      return {
        id: p.id,
        nombre_producto: p.nombre_producto || p.name || '',
        valor_producto: p.valor_producto ?? p.price ?? p.precio ?? 0,
        price: p.valor_producto ?? p.price ?? p.precio ?? 0,
        images: p.images || [],
        disenador: designerObj,
        disenador_nombre,
        categoria: p.categoria || p.categoria_id || null,
        stock: p.stock ?? p.cantidad ?? p.inventory ?? 0,
        raw: p,
      }
    });
  } catch (e) {
    return [];
  }
}

export async function listCategories({ token } = {}) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  try {
    const res = await fetch(`${API_BASE}/categoria`, { headers });
    if (!res.ok) return [];
    const data = await res.json().catch(() => null);
    const arr = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
    return (arr || []).map((c) => ({ id: c.id, tipo_producto: c.tipo_producto || c.nombre || c.name || '', raw: c }));
  } catch (e) {
    return [];
  }
}


// (duplicate helper implementations removed — keep single definitions above)

// ------------------------ USUARIOS (CRUD) ------------------------
export async function listUsers({ token } = {}) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  try {
    const res = await fetch(`${API_BASE}/user`, { headers });
    if (!res.ok) return [];
    const data = await res.json().catch(() => null);
    const arr = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
    return (arr || []).map((u) => ({
      id: u.id,
      nombre: u.nombre || u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim(),
      email: u.email,
      rol: u.rol || u.role || '',
      estado: u.estado || u.status || '',
      telefono: u.telefono || u.phone || '',
      comuna: u.comuna || u.city || '',
      direccion_envio: u.direccion_envio || u.address || '',
      raw: u,
    }));
  } catch (e) {
    return [];
  }
}

export async function createUser(token, payload = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  // normalize common spanish -> api field names
  const bodyToSend = { ...payload };
  if (payload.nombre && !payload.name) bodyToSend.name = payload.nombre;
  // keep both keys if you want, but backend usually wants 'name'
  const res = await fetch(`${API_BASE}/user`, {
    method: 'POST',
    headers,
    body: JSON.stringify(bodyToSend),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || data || `Error creando usuario: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function updateUser(token, userId, payload = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  // normalize payload: ensure 'name' exists if backend requires it
  const bodyToSend = { ...payload };
  if (payload.nombre && !payload.name) bodyToSend.name = payload.nombre;
  const res = await fetch(`${API_BASE}/user/${userId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(bodyToSend),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || data || `Error actualizando usuario: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function deleteUser(token, userId) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`${API_BASE}/user/${userId}`, { method: 'DELETE', headers });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || `Error eliminando usuario: ${res.status}`);
  }
  return true;
}


// ------------------------ ORDENES ------------------------

// GET /orden  -> devuelve todas las órdenes
export async function listOrdenes({ token } = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE}/orden`, {
    method: 'GET',
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Error cargando órdenes: ${res.status}`;
    throw new Error(msg);
  }

  // Xano suele devolver array directamente, o dentro de data/items
  const arr = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
  return arr || [];
}

// PATCH /orden/{orden_id}  -> actualiza el campo estado
export async function updateOrdenEstado({ token, ordenId, estado }) {
  if (!ordenId) throw new Error('ordenId es requerido');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}/orden/${ordenId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ estado }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Error actualizando orden: ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

// ------------------------ ÓRDENES ------------------------
// Crea una orden con estado "pendiente"
export async function createOrden({ token, userId, total, estado = 'pendiente' }) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const body = {
    user_id: userId,
    total,
    estado,
    // opcional: si tu tabla tiene fecha_orden, puedes setearla aquí
    fecha_orden: new Date().toISOString(),
  };

  const res = await fetch(`${API_BASE}/orden`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Error creando orden: ${res.status}`);
  }
  return data;
}

