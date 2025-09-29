const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

export async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data?.message || data?.error || "Request failed";
        throw new Error(msg);
    }
    return data;
}
