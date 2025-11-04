// Listar categorías desde Xano
export async function listCategories({ token } = {}) {
  const headers = { ...(makeAuthHeader(token)) };
  try {
    const res = await fetch(`${STORE_BASE}/categoria`, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
    return (arr || []).map(cat => ({
      id: cat.id ?? cat.categoria_id ?? cat.category_id,
      nombre_categoria: cat.nombre_categoria || cat.name || cat.titulo || cat.title || '',
      raw: cat,
    }));
  } catch {
    return [];
  }
}
// Usaremos fetch nativo en lugar de axios para evitar dependencias
const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE_URL;
const STORE_BASE = import.meta.env.VITE_XANO_STORE_BASE;

// Helpers de token
export function setToken(token, { remember = true } = {}) {
  if (remember) {
    localStorage.setItem("auth_token", token);
    sessionStorage.removeItem("auth_token");
  } else {
    sessionStorage.setItem("auth_token", token);
    localStorage.removeItem("auth_token");
  }
}
export function getToken() {
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token") || null;
}
export function clearToken() {
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}
export const makeAuthHeader = (token = getToken()) => (token ? { Authorization: `Bearer ${token}` } : {});

// === LOGIN ===
export async function authLogin({ email, password, remember = true }) {
  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  const token = data?.token || data?.authToken || data?.jwt || data?.auth?.token;
  if (!token) throw new Error("No se recibió token desde el backend.");
  setToken(token, { remember });
  // Si el login no devuelve user, intentamos obtenerlo desde /auth/me
  try {
    const me = await authMe();
    if (me) localStorage.setItem('auth_user', JSON.stringify(me));
    // devolver un objeto que incluya user cuando sea posible
    return { ...data, user: data.user ?? me };
  } catch {
    // si falla authMe no interrumpimos el flujo
    return data;
  }
}

// === SIGNUP ===  (espera: { name, email, password })
export async function authSignup({ name, email, password, remember = true }) {
  const res = await fetch(`${AUTH_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  const token = data?.token || data?.authToken || data?.jwt || data?.auth?.token;
  if (token) setToken(token, { remember });
  try {
    const me = await authMe();
    if (me) localStorage.setItem('auth_user', JSON.stringify(me));
    return { ...data, user: data.user ?? me };
  } catch {
    return data;
  }
}

export async function authMe() {
  const headers = { ...makeAuthHeader() };
  const res = await fetch(`${AUTH_BASE}/auth/me`, { headers });
  return await res.json();
}

export function authLogout() {
  clearToken();
}


// 1) Función para crear un nuevo producto (sin imágenes inicialmente)
// Parámetros:
// - token: JWT para autenticación
// - payload: objeto con los datos del producto (nombre, precio, etc.)
export async function createProduct(token, payload) {
  const headers = { ...makeAuthHeader(token), "Content-Type": "application/json" };
  // Create product (use spanish endpoint /producto)
  const res = await fetch(`${STORE_BASE}/producto`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const created = await res.json();

  // If the admin provided a disenador_id, try to create the relation in producto_disenador
  try {
    const productId = created?.id || created?.producto_id || created?.data?.id;
    const disenadorId = payload.disenador_id || payload.disenadorId || payload.disenador;
    if (productId && disenadorId) {
      const relRes = await fetch(`${STORE_BASE}/producto_disenador`, {
        method: "POST",
        headers,
        body: JSON.stringify({ producto_id: productId, disenador_id: disenadorId, fecha_asignacion: new Date().toISOString().slice(0,10) }),
      });
      // ignore relation result
      await relRes.json().catch(() => null);
      // try to fetch designer info
      try {
        const dRes = await fetch(`${STORE_BASE}/disenador/${disenadorId}`, { headers });
        const designer = await dRes.json().catch(() => null);
        if (designer) created.disenador = designer;
      } catch {
        // ignore error
      }
    }
  } catch {
    // non-fatal
  }

  return created;
}

// List designers (try multiple possible endpoint names). Returns an array.
export async function listDesigners({ token } = {}) {
  const headers = { ...makeAuthHeader(token) };
  const candidates = ["/disenador"];
  for (const c of candidates) {
    try {
      const res = await fetch(`${STORE_BASE}${c}`, { headers });
      if (!res.ok) continue;
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
      return (arr || []).map(d => ({
        id: d.id ?? d.disenador_id ?? d.person_id,
        nombre_disenador: d.nombre_disenador || d.name || d.nombre || '',
        apellido_disenador: d.apellido_disenador || d.surname || '',
        email_disenador: d.email_disenador || d.email || '',
        telefono_disenador: d.telefono_disenador || d.phone || '',
        raw: d,
      }));
    } catch {
      // try next
    }
  }
  return [];
}

// 2) Función para subir múltiples imágenes al servidor
// Parámetros:
// - token: JWT para autenticación
// - files: array de archivos (objetos File del navegador)
export async function uploadImages(token, files) {
  // Xano suele aceptar 'content[]' y también 'content'
  const fieldNames = ["content[]", "content"];
  const headers = { ...makeAuthHeader(token) }; // ¡NO pongas Content-Type!

  for (const field of fieldNames) {
    try {
      const fd = new FormData();
      for (const f of files) {
        try { fd.append(field, f, f.name); } catch { fd.append(field, f); }
      }

      const res = await fetch(`${STORE_BASE}/upload/image`, {
        method: "POST",
        headers,
        body: fd,
      });

      if (res.status === 400) {
        // opcional: log para saber si el campo no calza
        try { 
          console.warn('uploadImages 400 for field', field, await res.text()); 
        } catch {
          // ignore error reading response text
        }
        continue;
      }
      if (!res.ok) continue;

      const data = await res.json();

      // ←————— DEVUELVE RAW —————→
      // Xano puede responder: array, { files: [...] } o un solo objeto
      const arr = Array.isArray(data)
        ? data
        : (data?.files || data?.data || (data?.path ? [data] : []));
      return arr; // ← ¡sin mapear a {url,raw}!
    } catch (e) {
      console.warn('uploadImages error for field', field, e);
      continue;
    }
  }

  throw new Error('uploadImages: all attempts failed');
}


// 3) Función para asociar imágenes a un producto existente
export async function attachImagesToProduct(token, productId, imagesFullArray) {
  // Si alguien pasó objetos “mutilados”, intenta recuperar el RAW
  const images = imagesFullArray.map(x => x?.raw ? x.raw : x);

  const res = await fetch(
    `${STORE_BASE}/producto/${productId}`,
    {
      method: 'PATCH',
      headers: {
        ...makeAuthHeader(token),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ images })
    }
  );
  const data = await res.json();
  return data;
}

// 4) Función para listar productos con soporte para paginación y búsqueda
// Parámetros (objeto con propiedades opcionales):
// - token: JWT para autenticación (opcional)
// - limit: número máximo de productos a devolver (por defecto 12)
// - offset: número de productos a saltar (para paginación, por defecto 0)
// - q: término de búsqueda (por defecto vacío)
export async function listProducts({ token, limit = 12, offset = 0, q = "" } = {}) {
  // Creamos un objeto para los parámetros de consulta (query params)
  const params = {};
  // Añadimos los parámetros solo si tienen valor
  if (limit != null) params.limit = limit;
  if (offset != null) params.offset = offset;
  if (q) params.q = q; // si tu endpoint no soporta búsqueda, se ignora

  // Realizamos una petición GET para obtener la lista de productos
  // Xano endpoint uses /producto (según la API proporcionada)
  const url = new URL(`${STORE_BASE}/producto`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const headers = { ...makeAuthHeader(token) };
  const res = await fetch(url.toString(), { headers });
  const data = await res.json();
  // data may be an array or { items: [...] }
  const raw = Array.isArray(data) ? data : (data?.items ?? []);

  // Mapamos los campos del API (español) a la estructura que espera la UI
  const mapped = (raw || []).map((it) => {
    // imagen_producto puede ser URL (string) o objeto; intentamos obtener una URL
    let image = null
    if (!it) return null
    if (typeof it.imagen_producto === 'string') image = it.imagen_producto
    else if (it.imagen_producto && typeof it.imagen_producto === 'object') {
      image = it.imagen_producto.path || it.imagen_producto.url || it.imagen_producto[0]
    }

    const price = Number(it.valor_producto ?? it.price ?? 0)

    // Preferimos campos que puedan contener el nombre del diseñador enviado desde admin
    const designerName = it.nombre_diseñador || it.nombre_del_disenador || it.diseñador || it.designer || it.author || it.creator || null
    return {
      id: it.id,
      name: it.nombre_producto || it.name || it.title || 'Producto',
      description: it.descripción || it.descripcion || it.description || '',
      price: isNaN(price) ? 0 : price,
      image: image || '/assets/img/placeholder.png',
      designer: designerName || (it.categoria_id ? `Categoria ${it.categoria_id}` : 'Sin diseñador'),
      raw: it,
    }
  }).filter(Boolean)

  return mapped
}