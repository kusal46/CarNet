// src/api.js
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export async function apiPost(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new Error(await res.text() || `HTTP ${res.status}`);
    }
    return res.json();
}
