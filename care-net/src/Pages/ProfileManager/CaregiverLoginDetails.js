// src/Pages/ProfileManager/CaregiverLoginDetails.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { apiGet } from "../../api";

export default function CaregiverLoginDetails() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        (async () => {
        setErr("");
        setLoading(true);
        try {
            console.log("[MyProfile] token present?", !!token);
            // IMPORTANT: only '/me' because BASE already has '/api'
            const me = await apiGet("/me", token);
            console.log("[MyProfile] /api/me response:", me);
            if (alive) setData(me);
        } catch (e) {
            console.error("[MyProfile] /api/me error:", e);
            if (alive) setErr(e.message);
        } finally {
            if (alive) setLoading(false);
        }
        })();
        return () => { alive = false; };
    }, [token]);

    if (loading) return <div className="p-6">Loading…</div>;
    if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
    if (!data) return <div className="p-6">No data.</div>;

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-semibold">My Profile</h2>
        <Row label="Email"      value={data.email} />
        <Row label="First name" value={data.firstName} />
        <Row label="Last name"  value={data.lastName} />
        <Row label="City"       value={data.city} />
        <Row label="Address"    value={data.address} />
        <Row label="Role"       value={data.role} />
        </div>
    );
    }

    function Row({ label, value }) {
    return (
        <div className="flex justify-between border-b py-2">
        <div className="text-gray-600">{label}</div>
        <div className="font-medium">{value ?? "-"}</div>
        </div>
    );
}
