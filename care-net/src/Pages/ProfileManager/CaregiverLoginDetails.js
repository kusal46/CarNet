// src/Pages/ProfileManager/CaregiverLoginDetails.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { apiGet, apiPut } from "../../api"; // <-- add apiPut

export default function CaregiverLoginDetails() {
    const { token } = useAuth();

    const [data, setData] = useState(null);
    const [form, setForm] = useState(null);      // <-- editable copy
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        (async () => {
        setErr("");
        setLoading(true);
        try {
            const me = await apiGet("/me", token);
            if (alive) {
            setData(me);
            setForm(me);                         // keep an editable copy
            }
        } catch (e) {
            if (alive) setErr(e.message);
        } finally {
            if (alive) setLoading(false);
        }
        })();
        return () => { alive = false; };
    }, [token]);

    async function save() {
        setErr("");
        setSaving(true);
        try {
        // Only send editable fields (email/role usually not editable here)
        const payload = {
            firstName: form.firstName ?? null,
            lastName:  form.lastName  ?? null,
            city:      form.city      ?? null,
            address:   form.address   ?? null,
        };
        const updated = await apiPut("/me", payload, token);
        setData(updated);
        setForm(updated);
        setEditing(false);
        } catch (e) {
        setErr(e.message);
        } finally {
        setSaving(false);
        }
    }

    if (loading) return <div className="p-6">Loading…</div>;
    if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
    if (!data) return <div className="p-6">No data.</div>;

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Profile</h2>
            {!editing ? (
            <button
                className="px-3 py-1 rounded bg-blue-600 text-white"
                onClick={() => setEditing(true)}
            >
                Edit
            </button>
            ) : (
            <div className="flex gap-2">
                <button
                className="px-3 py-1 rounded bg-emerald-600 text-white disabled:opacity-60"
                onClick={save}
                disabled={saving}
                >
                {saving ? "Saving…" : "Save"}
                </button>
                <button
                className="px-3 py-1 rounded border"
                onClick={() => { setForm(data); setEditing(false); }}
                disabled={saving}
                >
                Cancel
                </button>
            </div>
            )}
        </div>

        {/* Email and Role: read-only */}
        <Row label="Email" value={data.email} />
        <Row label="Role"  value={data.role} />

        {/* Editable fields */}
        {!editing ? (
            <>
            <Row label="First name" value={data.firstName} />
            <Row label="Last name"  value={data.lastName} />
            <Row label="City"       value={data.city} />
            <Row label="Address"    value={data.address} />
            </>
        ) : (
            <div className="space-y-3">
            <EditRow
                label="First name"
                value={form.firstName || ""}
                onChange={v => setForm({ ...form, firstName: v })}
            />
            <EditRow
                label="Last name"
                value={form.lastName || ""}
                onChange={v => setForm({ ...form, lastName: v })}
            />
            <EditRow
                label="City"
                value={form.city || ""}
                onChange={v => setForm({ ...form, city: v })}
            />
            <EditRow
                label="Address"
                value={form.address || ""}
                onChange={v => setForm({ ...form, address: v })}
            />
            </div>
        )}
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

    function EditRow({ label, value, onChange }) {
    return (
        <label className="block">
        <div className="text-gray-600 mb-1">{label}</div>
        <input
            className="w-full rounded border px-3 py-2"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
        </label>
    );
}
