import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Small icon components (inline SVG so preview works without extra libs)
const CameraIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
        <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H8l1.2-1.8A2 2 0 0 1 10.8 3h2.4c.66 0 1.28.33 1.65.88L16 6h2.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9Z"/>
        <circle cx="12" cy="13" r="4"/>
    </svg>
    );

    const PlusIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
        <path d="M12 5v14M5 12h14"/>
    </svg>
    );

    const EyeIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
    );

    const SettingsIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82V22a2 2 0 1 1-4 0v-.18A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33H2a2 2 0 1 1 0-4h.18A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.64 2.3l.06.06c.5.5 1.2.67 1.82.33.2-.1.39-.22.55-.37A1.65 1.65 0 0 0 10 2.18V2a2 2 0 1 1 4 0v.18c0 .35.13.69.37.95.16.16.35.28.55.37.62.34 1.32.17 1.82-.33l.06-.06A2 2 0 1 1 21.7 7.64l-.06.06a1.65 1.65 0 0 0-.33 1.82c.1.2.22.39.37.55.26.24.6.37.95.37H22a2 2 0 1 1 0 4h-.18c-.35 0-.69.13-.95.37-.16.16-.28.35-.37.55Z"/>
    </svg>
    );

    const Tag = ({ label, selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-xl border text-sm transition shadow-sm ${
        selected ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50 border-gray-300"
        }`}
    >
        {label}
    </button>
    );

    const Chip = ({ text, onRemove }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-sm">
        {text}
        <button onClick={onRemove} className="rounded-full p-0.5 hover:bg-gray-200" aria-label={`Remove ${text}`}>×</button>
    </span>
    );

    const Field = ({ label, children, required }) => (
    <label className="block">
        <span className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
        </span>
        <div className="mt-1">{children}</div>
    </label>
    );

    export default function CaregiverProfileUI() {
    // Core profile
    const [available, setAvailable] = useState(false);
    const [rate, setRate] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [summary, setSummary] = useState("");
    const navigate = useNavigate();

    // Avatar upload
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);
    const avatarUrl = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile]);

    // Services
    const [services, setServices] = useState({
        "Elderly Care": false,
        "Patient Care": false,
        "Child Care": false,
        "Pet Care": false,
        "Special Needs": false,
    });
    const toggleService = (key) => setServices((s) => ({ ...s, [key]: !s[key] }));

    // Languages & Skills (chips)
    const [langInput, setLangInput] = useState("");
    const [langs, setLangs] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState([]);

    const addChip = (value, setList, setInput) => {
        const v = value.trim();
        if (!v) return;
        setList((list) => (list.includes(v) ? list : [...list, v]));
        setInput("");
    };

    // Certifications
    const [certName, setCertName] = useState("");
    const [certIssuer, setCertIssuer] = useState("");
    const [certFile, setCertFile] = useState(null);
    const [certs, setCerts] = useState([]);

    const addCertification = () => {
        if (!certName || !certIssuer || !certFile) {
        alert("Please fill all certification fields.");
        return;
        }
        setCerts((c) => [
        ...c,
        { name: certName, issuer: certIssuer, fileName: certFile.name, file: certFile },
        ]);
        setCertName("");
        setCertIssuer("");
        setCertFile(null);
    };

    // Working history (now includes company, role, description, startDate, endDate)
    const [whCompany, setWhCompany] = useState("");
    const [whRole, setWhRole] = useState("");
    const [whDescription, setWhDescription] = useState("");
    const [whStart, setWhStart] = useState("");
    const [whEnd, setWhEnd] = useState("");
    const [history, setHistory] = useState([]);

    const addHistory = () => {
        if (!whCompany || !whRole || !whDescription || !whStart || !whEnd) {
        return alert("Please fill all working history fields.");
        }
        setHistory((h) => [
        ...h,
        {
            company: whCompany,
            role: whRole,
            description: whDescription,
            startDate: whStart,
            endDate: whEnd,
        },
        ]);
        setWhCompany("");
        setWhRole("");
        setWhDescription("");
        setWhStart("");
        setWhEnd("");
    };

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();

        // JSON part called "data" — match backend DTO exactly
        const data = {
        available,
        rate: Number(rate),
        name,
        email,
        location,
        summary,
        languages: langs,
        skills,
        services: Object.entries(services).filter(([_, v]) => v).map(([k]) => k),
        certifications: certs.map((c) => ({ name: c.name, issuer: c.issuer })),
        workHistory: history, // already in correct shape
        };
        form.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

        // files
        if (avatarFile) form.append("avatar", avatarFile);
        certs.forEach((c) => {
        if (c.file) form.append("certFiles", c.file); // multiple files under the same key
        });

        try {
        const res = await fetch("http://localhost:8080/api/caregivers", {
            method: "POST",
            body: form,
        });
        const text = await res.text();
        if (!res.ok) {
            console.error("Save failed", res.status, res.statusText, text);
            throw new Error(text || `HTTP ${res.status}`);
        }
        const id = (() => { try { return JSON.parse(text); } catch { return text; } })();
        alert(`✅ Saved! New caregiver id: ${id}`);
        navigate(`/caregivers/${id}`);
        } catch (err) {
        console.error(err);
        alert(`Failed to save: ${err.message || err}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 text-gray-900">
        {/* Top bar */}
        <div className="flex items-center justify-end gap-2 p-4">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-blue-600 bg-white px-3 py-2 text-sm hover:bg-blue-100">
            <EyeIcon className="h-4 w-4" /> See Public View
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white shadow hover:bg-blue-700">
            <SettingsIcon className="h-4 w-4" /> Profile Settings
            </button>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-4 md:grid-cols-[320px,1fr]">
            {/* Left column */}
            <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mx-auto mb-4 relative h-40 w-40">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group absolute inset-0 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden"
                    aria-label="Upload profile photo"
                >
                    {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                    <CameraIcon className="h-8 w-8 text-gray-600 group-hover:scale-110 transition" />
                    )}
                </button>
                {available && <span className="absolute bottom-3 right-3 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white" />}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setAvatarFile(f);
                    }}
                />
                </div>
                <div className="space-y-4">
                <Field label="Rate per hour (LKR)" required>
                    <input value={rate} onChange={(e)=>setRate(e.target.value)} required type="number" placeholder="e.g., 1500" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600" />
                </Field>

                <div>
                    <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Availability</span>
                    <span className="text-sm font-medium">{available ? "ON" : "OFF"}</span>
                    </div>
                    <button
                    type="button"
                    onClick={() => setAvailable((v) => !v)}
                    className={`mt-2 flex h-9 w-16 items-center rounded-full p-1 transition ${available ? "bg-blue-600" : "bg-gray-300"}`}
                    aria-label="Toggle availability"
                    >
                    <span className={`h-7 w-7 rounded-full bg-white shadow transition ${available ? "translate-x-7" : "translate-x-0"}`}></span>
                    </button>
                </div>
                </div>
            </div>

            {/* Languages */}
            <div className="rounded-3xl bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Languages <span className="text-red-600">*</span></span>
                <button type="button" onClick={() => addChip(langInput, setLangs, setLangInput)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 hover:bg-gray-50 "><PlusIcon className="h-4 w-4 text-blue-600 "/></button>
                </div>
                <input
                value={langInput}
                onChange={(e)=>setLangInput(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addChip(langInput,setLangs,setLangInput);} }}
                placeholder="Type a language and press Enter or +"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex flex-wrap gap-2">
                {langs.map((l)=> (<Chip key={l} text={l} onRemove={()=>setLangs(langs.filter(x=>x!==l))}/>))}
                </div>
            </div>

            {/* Skills */}
            <div className="rounded-3xl bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Skills <span className="text-red-600">*</span></span>
                <button type="button" onClick={() => addChip(skillInput, setSkills, setSkillInput)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 hover:bg-gray-50"><PlusIcon className="h-4 w-4 text-blue-600"/></button>
                </div>
                <input
                value={skillInput}
                onChange={(e)=>setSkillInput(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addChip(skillInput,setSkills,setSkillInput);} }}
                placeholder="Type a skill and press Enter or +"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex flex-wrap gap-2">
                {skills.map((s)=> (<Chip key={s} text={s} onRemove={()=>setSkills(skills.filter(x=>x!==s))}/>))}
                </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
                <span className="text-sm font-semibold text-gray-700">Year of expertise <span className="text-red-600">*</span></span>
                <input required type="number" placeholder="e.g., 5" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
                <span className="text-sm font-semibold text-gray-700">Service Radius <span className="text-red-600">*</span></span>
                <input required placeholder="e.g., within 10 km" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
            </div>
            </aside>

            {/* Right column */}
            <main className="space-y-8">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Name" required>
                    <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Your full name" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                </Field>
                <Field label="Email" required>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" placeholder="you@example.com" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                </Field>
                <Field label="Location" required>
                    <input value={location} onChange={(e)=>setLocation(e.target.value)} required placeholder="City, Country" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                </Field>
                <Field label="Add Summary" required>
                    <textarea value={summary} onChange={(e)=>setSummary(e.target.value)} required rows={3} placeholder="Brief summary about you" className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                </Field>
                </div>

                <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700">Services Offered / care type <span className="text-red-600">*</span></h3>
                <div className="mt-3 flex flex-wrap gap-3">
                    {Object.entries(services).map(([label, selected]) => (
                    <Tag key={label} label={label} selected={selected} onClick={() => toggleService(label)} />
                    ))}
                </div>
                </div>
            </div>

            {/* Certifications */}
            <section className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Certifications</h2>
                {certs.length === 0 && <p className="text-sm text-gray-500 mt-1">No certification added yet</p>}

                <div className="mt-4 rounded-2xl border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr,1fr,auto] md:items-end">
                    <Field label="Name" required>
                    <input value={certName} onChange={(e)=>setCertName(e.target.value)} placeholder="Certification name" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                    </Field>
                    <Field label="Issuer" required>
                    <input value={certIssuer} onChange={(e)=>setCertIssuer(e.target.value)} placeholder="Issuing organization" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                    </Field>
                    <div className="space-y-2">
                    <Field label="File" required>
                        <input onChange={(e)=>setCertFile(e.target.files?.[0]||null)} type="file" className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-white hover:file:bg-gray-700"/>
                    </Field>
                    <div className="flex items-center gap-2 text-xs text-gray-500 min-h-[1rem]"/>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button type="button" onClick={addCertification} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                    Add Certification <PlusIcon className="h-4 w-4"/>
                    </button>
                </div>

                {certs.length > 0 && (
                    <ul className="mt-4 list-disc space-y-1 pl-6 text-sm">
                    {certs.map((c, i)=> (
                        <li key={i} className="flex items-center justify-between">
                        <span>{c.name} — {c.issuer} ({c.fileName})</span>
                        </li>
                    ))}
                    </ul>
                )}
                </div>
            </section>

            {/* Working History */}
            <section className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Working History</h2>
                {history.length === 0 && <p className="text-sm text-gray-500 mt-1">No Working History added yet</p>}

                <div className="mt-4 rounded-2xl border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Company" required>
                    <input value={whCompany} onChange={(e)=>setWhCompany(e.target.value)} placeholder="Company / Organization" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                    </Field>
                    <Field label="Role" required>
                    <input value={whRole} onChange={(e)=>setWhRole(e.target.value)} placeholder="e.g., Caregiver" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                    </Field>
                </div>

                <Field label="Description" required>
                    <textarea value={whDescription} onChange={(e)=>setWhDescription(e.target.value)} rows={3} placeholder="Role, duties, and accomplishments" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                </Field>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Field label="Start Date" required>
                    <input value={whStart} onChange={(e)=>setWhStart(e.target.value)} type="date" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                    </Field>
                    <Field label="End Date" required>
                    <input value={whEnd} onChange={(e)=>setWhEnd(e.target.value)} type="date" className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"/>
                    </Field>
                    <div className="flex items-end">
                    <button type="button" onClick={addHistory} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                        Add Working History <PlusIcon className="h-4 w-4"/>
                    </button>
                    </div>
                </div>

                {history.length > 0 && (
                    <ul className="mt-4 list-disc space-y-1 pl-6 text-sm">
                    {history.map((h, i)=> (
                        <li key={i}>
                        <span className="font-medium">{h.company}</span> — {h.role}: {h.description} ({h.startDate} to {h.endDate})
                        </li>
                    ))}
                    </ul>
                )}
                </div>
            </section>

            <div className="flex justify-end pb-8">
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">Save Profile</button>
            </div>
            </main>
        </div>
        </form>
    );
}
