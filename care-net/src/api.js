// src/api.js
const BASE = "http://localhost:8080/api";

/**
 * Low-level fetch wrapper with:
 *  - BASE + path building
 *  - JSON body/response handling
 *  - Authorization: Bearer <token> (if provided or found in localStorage)
 *  - Helpful console logs
 */
export async function api(path, { method = "GET", token, body, headers = {} } = {}) {
    const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
    const bearer = token ?? localStorage.getItem("token");

    const init = {
        method,
        headers: {
        Accept: "application/json",
        ...headers,
        },
    };
    if (bearer) init.headers.Authorization = `Bearer ${bearer}`;
    if (body != null) {
        init.headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(body);
    }

    console.log("[api]", method, url, bearer ? "(auth)" : "(no auth)", body ?? "");

    const res = await fetch(url, init);
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }
    console.log("[api]  response", res.status, data);

    if (!res.ok) {
        const message = typeof data === "string" ? data : (data?.message || res.statusText);
        const err = new Error(`${res.status}: ${message}`);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

// Convenience helpers
export const apiGet    = (path, token)       => api(path, { method: "GET", token });
export const apiPost   = (path, body, token) => api(path, { method: "POST", body, token });
export const apiPut    = (path, body, token) => api(path, { method: "PUT",  body, token });
export const apiDelete = (path, token)       => api(path, { method: "DELETE", token });
