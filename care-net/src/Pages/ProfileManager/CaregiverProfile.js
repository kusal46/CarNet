// src/Pages/ProfileManager/CaregiverProfile.js
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

const BASE = "http://localhost:8080";

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    if (typeof value === "string") {
      return value.split(",").map(v => v.trim()).filter(Boolean);
    }
    return [];
  }
}

export default function CaregiverProfile() {
  const params = useParams();
  const [search] = useSearchParams();

  // supports /caregivers/:id OR /caregivers/home?id=2
  const routeId = params.id;
  const queryId = search.get("id");
  const storedId = localStorage.getItem("lastCaregiverId");
  const id = routeId ?? queryId ?? storedId ?? null;

  const [cg, setCg] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setErr("No caregiver id provided. Open as /caregivers/2 or /caregivers/home?id=2");
      return;
    }

    setErr("");
    setLoading(true);

    fetch(`${BASE}/api/caregivers/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          const t = await r.text();
          throw new Error(`${r.status}: ${t || r.statusText}`);
        }
        return r.json();
      })
      .then((data) => setCg(data))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const avatarUrl = useMemo(() => {
    if (!cg?.avatarPath) return null;
    if (!cg.avatarPath.startsWith("http")) {
      // If you have FilesController mapped to /files/**
      return `${BASE}/files/${cg.avatarPath.replace(/^\/+/, "")}`;
    }
    return cg.avatarPath;
  }, [cg]);

  const languages = useMemo(() => toArray(cg?.languages), [cg]);
  const skills = useMemo(() => toArray(cg?.skills), [cg]);
  const services = useMemo(() => toArray(cg?.services), [cg]);

  function formatRate(v) {
    if (v == null) return "-";
    const num = typeof v === "number" ? v : Number(v);
    return Number.isFinite(num) ? `$${num.toFixed(2)}/hr` : String(v);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (err) {
    return (
      <div style={{ padding: 20, color: "crimson" }}>
        Failed to load caregiver {id ? `#${id}` : ""}.<br />
        Error: {err}
      </div>
    );
  }
  if (!cg) return <div style={{ padding: 20 }}>No data.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
      <Link to="/caregivers" style={{ textDecoration: "none" }}>
        &larr; Back to list
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${cg.name} avatar`}
              style={{
                width: 180,
                height: 180,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid #ddd",
              }}
            />
          ) : (
            <div
              style={{
                width: 180,
                height: 180,
                display: "grid",
                placeItems: "center",
                borderRadius: 12,
                border: "1px dashed #bbb",
                color: "#888",
              }}
            >
              No Photo
            </div>
          )}
        </div>

        <div>
          <h2 style={{ margin: "0 0 6px" }}>{cg.name}</h2>
          <div style={{ color: "#666", marginBottom: 4 }}>{cg.email}</div>
          <div style={{ color: "#666", marginBottom: 12 }}>{cg.location}</div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <InfoPill label="Available" value={cg.available ? "Yes" : "No"} />
            <InfoPill label="Rate" value={formatRate(cg.rate)} />
          </div>
        </div>
      </div>

      <Section title="Summary">
        <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
          {cg.summary || "-"}
        </p>
      </Section>

      <Section title="Languages">
        <ChipRow items={languages} />
      </Section>

      <Section title="Skills">
        <ChipRow items={skills} />
      </Section>

      <Section title="Services">
        <ChipRow items={services} />
      </Section>

      <Section title="Certifications">
        {(cg.certifications?.length ?? 0) === 0 ? (
          <div>-</div>
        ) : (
          <ul style={{ paddingLeft: 18 }}>
            {cg.certifications.map((c) => {
              const fileHref = c.filePath
                ? (c.filePath.startsWith("http")
                    ? c.filePath
                    : `${BASE}/files/${c.filePath.replace(/^\/+/, "")}`)
                : null;
              return (
                <li key={c.id} style={{ marginBottom: 6 }}>
                  <div>
                    <strong>{c.name}</strong>
                    {c.issuer ? ` — ${c.issuer}` : ""}
                  </div>
                  {fileHref && (
                    <a href={fileHref} target="_blank" rel="noreferrer">
                      {c.fileName || "Open file"}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Work History">
        {(cg.workHistory?.length ?? 0) === 0 ? (
          <div>-</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {cg.workHistory.map((w) => (
              <div
                key={w.id}
                style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}
              >
                <div style={{ color: "#666", fontSize: 13 }}>
                  {w.startDate || "-"} – {w.endDate || "-"}
                </div>
                <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                  {w.descr || "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginTop: 24 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <div style={{ marginTop: 8 }}>{children}</div>
    </section>
  );
}

function ChipRow({ items }) {
  if (!items || items.length === 0) return <div>-</div>;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {items.map((x, i) => (
        <span
          key={i}
          style={{
            padding: "6px 10px",
            border: "1px solid #ddd",
            background: "#fafafa",
            borderRadius: 999,
            fontSize: 13,
          }}
        >
          {x}
        </span>
      ))}
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        background: "#fcfcfc",
        borderRadius: 10,
        padding: "6px 10px",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#777" }}>{label}:</span> <strong>{value}</strong>
    </div>
  );
}
