import { useMemo, useState } from "react";
import { apiPost } from "../../api";
import "./caregiver-details-add.css";

const SERVICE_OPTIONS = [
    "Elderly Care",
    "Patient Care",
    "Child Care",
    "Pet Care",
    "Special Needs",
    ];

    export default function CaregiverDetailsAdd() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        location: "",
        summary: "",
        hourlyRateLkr: "",
        availability: true,
        yearsOfExpertise: "",
        serviceRadiusKm: "",
        languages: [],
        skills: [],
        servicesOffered: [],
        certifications: [], // {name, issuer, fileName}
        workHistory: [],     // {description, startDate, endDate}
        profileImageUrl: "",
    });

    const [temp, setTemp] = useState({
        language: "",
        skill: "",
        certName: "",
        certIssuer: "",
        certFileName: "",
        workDescription: "",
        workStart: "",
        workEnd: "",
    });

    // avatar upload (just preview + store as data URL; keep simple)
    const [avatarPreview, setAvatarPreview] = useState(null);
    function onAvatarChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(f);
        // store as data URL — in a real app switch to multipart and upload to S3
        setForm(v => ({ ...v, profileImageUrl: "dataurl" }));
    }

    function toggleService(s) {
        setForm(v => ({
        ...v,
        servicesOffered: v.servicesOffered.includes(s)
            ? v.servicesOffered.filter(x => x !== s)
            : [...v.servicesOffered, s],
        }));
    }

    function addLanguage() {
        const val = temp.language.trim();
        if (!val) return;
        setForm(v => ({ ...v, languages: [...v.languages, val] }));
        setTemp(t => ({ ...t, language: "" }));
    }
    function removeLanguage(i) {
        setForm(v => ({ ...v, languages: v.languages.filter((_, idx) => idx !== i) }));
    }

    function addSkill() {
        const val = temp.skill.trim();
        if (!val) return;
        setForm(v => ({ ...v, skills: [...v.skills, val] }));
        setTemp(t => ({ ...t, skill: "" }));
    }
    function removeSkill(i) {
        setForm(v => ({ ...v, skills: v.skills.filter((_, idx) => idx !== i) }));
    }

    function onCertFile(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        setTemp(t => ({ ...t, certFileName: f.name }));
    }
    function addCertification() {
        if (!temp.certName.trim() && !temp.certIssuer.trim() && !temp.certFileName) return;
        setForm(v => ({
        ...v,
        certifications: [
            ...v.certifications,
            { name: temp.certName.trim(), issuer: temp.certIssuer.trim(), fileName: temp.certFileName || "" },
        ],
        }));
        setTemp(t => ({ ...t, certName: "", certIssuer: "", certFileName: "" }));
    }
    function removeCertification(i) {
        setForm(v => ({ ...v, certifications: v.certifications.filter((_, idx) => idx !== i) }));
    }

    function addWork() {
        if (!temp.workDescription.trim()) return;
        setForm(v => ({
        ...v,
        workHistory: [
            ...v.workHistory,
            { description: temp.workDescription.trim(), startDate: temp.workStart || "", endDate: temp.workEnd || "" },
        ],
        }));
        setTemp(t => ({ ...t, workDescription: "", workStart: "", workEnd: "" }));
    }
    function removeWork(i) {
        setForm(v => ({ ...v, workHistory: v.workHistory.filter((_, idx) => idx !== i) }));
    }

    const [status, setStatus] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("saving");
        try {
        const payload = {
            ...form,
            hourlyRateLkr: form.hourlyRateLkr ? Number(form.hourlyRateLkr) : null,
            yearsOfExpertise: form.yearsOfExpertise ? Number(form.yearsOfExpertise) : null,
            serviceRadiusKm: form.serviceRadiusKm ? Number(form.serviceRadiusKm) : null,
            about: form.summary, // backend field name in the earlier example
            skills: form.skills.join(", "),
        };
        const saved = await apiPost("/api/caregivers", payload);
        setStatus("saved (id " + saved.id + ")");
        } catch (err) {
        setStatus(err.message || "error");
        }
    }

    return (
        <div className="cg-wrap">
        <header className="cg-header">
            <button className="cg-btn ghost" onClick={() => window.open("/public/caregiver", "_blank")}>
            See Public View
            </button>
            <button className="cg-btn primary" onClick={() => (window.location.href = "/profile/settings")}>
            Profile Settings
            </button>
        </header>

        <form className="cg-grid" onSubmit={handleSubmit}>
            {/* LEFT COLUMN */}
            <aside className="cg-left">
            <div className="cg-avatar">
                <label className="cg-avatar__label">
                <input type="file" accept="image/*" onChange={onAvatarChange} hidden />
                {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" />
                ) : (
                    <div className="cg-avatar__placeholder">
                    <span role="img" aria-label="camera">📷</span>
                    </div>
                )}
                </label>
                <span className="cg-avatar__dot" />
            </div>

            <div className="cg-field">
                <label>Rate per hour (LKR)</label>
                <input
                type="number"
                value={form.hourlyRateLkr}
                onChange={e => setForm({ ...form, hourlyRateLkr: e.target.value })}
                />
            </div>

            <div className="cg-field">
                <label>Availability</label>
                <button
                type="button"
                className={"cg-toggle " + (form.availability ? "on" : "off")}
                onClick={() => setForm(v => ({ ...v, availability: !v.availability }))}
                >
                <span className="ball" />
                <span className="label">{form.availability ? "ON" : "OFF"}</span>
                </button>
            </div>

            <div className="cg-field">
                <label>Languages</label>
                <div className="cg-addline">
                <input
                    placeholder="Add a language"
                    value={temp.language}
                    onChange={e => setTemp(t => ({ ...t, language: e.target.value }))}
                />
                <button type="button" className="cg-add" onClick={addLanguage}>＋</button>
                </div>
                {!!form.languages.length && (
                <ul className="cg-pills">
                    {form.languages.map((l, i) => (
                    <li className="pill" key={i}>
                        {l}
                        <button type="button" onClick={() => removeLanguage(i)}>×</button>
                    </li>
                    ))}
                </ul>
                )}
            </div>

            <div className="cg-field">
                <label>Skills</label>
                <div className="cg-addline">
                <input
                    placeholder="Add a skill"
                    value={temp.skill}
                    onChange={e => setTemp(t => ({ ...t, skill: e.target.value }))}
                />
                <button type="button" className="cg-add" onClick={addSkill}>＋</button>
                </div>
                {!!form.skills.length && (
                <ul className="cg-pills">
                    {form.skills.map((s, i) => (
                    <li className="pill" key={i}>
                        {s}
                        <button type="button" onClick={() => removeSkill(i)}>×</button>
                    </li>
                    ))}
                </ul>
                )}
            </div>

            <div className="cg-field">
                <label>Year of expertise</label>
                <input
                type="number"
                value={form.yearsOfExpertise}
                onChange={e => setForm({ ...form, yearsOfExpertise: e.target.value })}
                />
            </div>

            <div className="cg-field">
                <label>Service Radius (km)</label>
                <input
                type="number"
                value={form.serviceRadiusKm}
                onChange={e => setForm({ ...form, serviceRadiusKm: e.target.value })}
                />
            </div>
            </aside>

            {/* RIGHT COLUMN */}
            <main className="cg-right">
            <div className="cg-field">
                <label>Name</label>
                <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            </div>

            <div className="cg-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="cg-field">
                <label>Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>

            <div className="cg-field">
                <label>Add Summary</label>
                <textarea rows={4} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
            </div>

            <div className="cg-field">
                <label>Services Offered / care type</label>
                <div className="cg-chips">
                {SERVICE_OPTIONS.map(s => (
                    <button
                    key={s}
                    type="button"
                    className={"chip " + (form.servicesOffered.includes(s) ? "active" : "")}
                    onClick={() => toggleService(s)}
                    >
                    {s}
                    </button>
                ))}
                </div>
            </div>

            <section className="cg-card">
                <h3>Certifications</h3>
                {!form.certifications.length && <p className="muted">No certification added yet</p>}
                {form.certifications.length > 0 && (
                <ul className="cg-list">
                    {form.certifications.map((c, i) => (
                    <li key={i}>
                        <strong>{c.name || "Untitled"}</strong> — {c.issuer || "Unknown"}
                        {c.fileName ? ` (${c.fileName})` : ""}
                        <button className="link" type="button" onClick={() => removeCertification(i)}>Remove</button>
                    </li>
                    ))}
                </ul>
                )}
                <div className="cg-certline">
                <input placeholder="Name" value={temp.certName} onChange={e => setTemp(t => ({ ...t, certName: e.target.value }))} />
                <input placeholder="Issuer" value={temp.certIssuer} onChange={e => setTemp(t => ({ ...t, certIssuer: e.target.value }))} />
                <label className="file-btn">
                    <input type="file" onChange={onCertFile} hidden />
                    Choose File
                </label>
                <span className="file-name">{temp.certFileName || "No file location"}</span>
                <button type="button" className="cg-add" onClick={addCertification}>＋ Add Certification</button>
                </div>
            </section>

            <section className="cg-card">
                <h3>Working History</h3>
                {!form.workHistory.length && <p className="muted">No Working History added yet</p>}
                {form.workHistory.length > 0 && (
                <ul className="cg-list">
                    {form.workHistory.map((w, i) => (
                    <li key={i}>
                        <div>{w.description}</div>
                        <div className="muted">{w.startDate || "—"} → {w.endDate || "—"}</div>
                        <button className="link" type="button" onClick={() => removeWork(i)}>Remove</button>
                    </li>
                    ))}
                </ul>
                )}
                <textarea
                rows={3}
                placeholder="Describe your role, duties, achievements..."
                value={temp.workDescription}
                onChange={e => setTemp(t => ({ ...t, workDescription: e.target.value }))}
                />
                <div className="cg-dates">
                <div>
                    <label>Start Date</label>
                    <input type="date" value={temp.workStart} onChange={e => setTemp(t => ({ ...t, workStart: e.target.value }))} />
                </div>
                <div>
                    <label>End Date</label>
                    <input type="date" value={temp.workEnd} onChange={e => setTemp(t => ({ ...t, workEnd: e.target.value }))} />
                </div>
                <button type="button" className="cg-add" onClick={addWork}>＋ Add Working His</button>
                </div>
            </section>

            <footer className="cg-actions">
                <button className="cg-btn primary" type="submit" disabled={status === "saving"}>Save Profile</button>
                {status && <span className="status">{status}</span>}
            </footer>
            </main>
        </form>
        </div>
    );
}
