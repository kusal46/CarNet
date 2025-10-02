// src/features/auth/AuthContext.js
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthCtx = createContext(null);

function normalizeRole(r) {
    const v = String(r || "").trim().toLowerCase();
    if (v === "caregiver" || v === "care-giver") return "caregiver";
    if (v === "care-seeker" || v === "careseeker" || v === "seeker") return "care-seeker";
    if (v === "admin") return "admin";
    return v || ""; // unknown role -> ""
    }

    const STORAGE_KEYS = {
    token: "token",
    role: "role",
    userId: "userId",
    email: "email",
    };

    export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem(STORAGE_KEYS.token) || "";
        const role = normalizeRole(localStorage.getItem(STORAGE_KEYS.role) || "");
        const userId = localStorage.getItem(STORAGE_KEYS.userId) || "";
        const email = localStorage.getItem(STORAGE_KEYS.email) || "";
        // DEBUG
        console.log("[auth] initial from storage:", { token, role, userId, email });
        return { token, role, userId, email };
    });

    useEffect(() => {
        console.log("[auth] current state:", auth);
    }, [auth]);

    function login(payload) {
        // Accept either token or accessToken to be safe
        const token = payload?.token || payload?.accessToken || payload?.jwt || "";
        const role = normalizeRole(payload?.role);
        const userId = String(payload?.userId ?? "");
        const email = payload?.email ?? "";

        console.log("[auth] login() called with:", payload);
        console.log("[auth] normalized:", { token, role, userId, email });

        // Persist
        localStorage.setItem(STORAGE_KEYS.token, token);
        localStorage.setItem(STORAGE_KEYS.role, role);
        localStorage.setItem(STORAGE_KEYS.userId, userId);
        localStorage.setItem(STORAGE_KEYS.email, email);

        setAuth({ token, role, userId, email });

        // DEBUG
        console.log("[auth] after login localStorage:", {
        token: localStorage.getItem(STORAGE_KEYS.token),
        role: localStorage.getItem(STORAGE_KEYS.role),
        userId: localStorage.getItem(STORAGE_KEYS.userId),
        email: localStorage.getItem(STORAGE_KEYS.email),
        });
    }

    function logout() {
        console.log("[auth] logout()");
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.role);
        localStorage.removeItem(STORAGE_KEYS.userId);
        localStorage.removeItem(STORAGE_KEYS.email);
        setAuth({ token: "", role: "", userId: "", email: "" });
    }

    const value = useMemo(() => ({ ...auth, login, logout }), [auth]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
    }

    export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
