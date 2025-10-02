// src/Pages/Public/Login.js
import { useState } from "react";
import { apiPost } from "../../api";
import { useAuth } from "../../features/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    async function submit(e) {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
        console.log("[login] submitting /auth/login", { email });

        // Backend should return: { accessToken, role, userId, email }
        const data = await apiPost("/auth/login", { email, password });
        console.log("[login] /auth/login response:", data);

        // Normalize role to what guards expect
        const normalizedRole = String(data.role || "").trim().toLowerCase();

        // Save to context (accepts token or accessToken)
        login({
            token: data.accessToken || data.token,
            role: normalizedRole,
            userId: data.userId,
            email: data.email || email,
        });

        // Role-based redirect
        let dest = "/login";
        if (normalizedRole === "caregiver") dest = "/caregiver/me";
        else if (normalizedRole === "care-seeker") dest = "/care-seeker/home";
        else if (normalizedRole === "admin") dest = "/admin";

        console.log("[login] navigating to:", dest);
        navigate(dest, { replace: true });
        } catch (ex) {
        console.error("[login] FAILED:", ex);
        setErr(ex.message || "Login failed");
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="min-h-screen grid place-items-center p-6">
        <form onSubmit={submit} className="w-full max-w-md border rounded-xl p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-center">Log in to CareNet</h1>

            {err && <div className="bg-red-50 text-red-700 px-3 py-2 rounded">{err}</div>}

            <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
                type="email"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
                type="password"
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            </div>

            <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
            >
            {loading ? "Signing in..." : "Continue"}
            </button>

            <div className="text-center text-sm text-gray-600 pt-2">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-emerald-600 underline">Sign Up</Link>
            </div>
        </form>
        </div>
    );
}
