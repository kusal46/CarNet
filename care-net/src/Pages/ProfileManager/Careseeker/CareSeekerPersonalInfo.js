// src/Pages/Seeker/CareSeekerPersonalInfo.jsx
import React, { useMemo, useState } from "react";

// simple cx helper
const cx = (...c) => c.filter(Boolean).join(" ");

const CARE_TYPES = [
    "Elderly Care",
    "Patient Care",
    "Child Care",
    "Pet Care",
    "Special Needs",
    ];

    function isValidEmail(email) {
    // simple & safe email check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
    }

    function calcAge(isoDate) {
    if (!isoDate) return 0;
    const dob = new Date(isoDate);
    if (Number.isNaN(dob.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
    }

    export default function CareSeekerPersonalInfo() {
    const [avatar, setAvatar] = useState(null);
    const [careTypes, setCareTypes] = useState([]);

    const [form, setForm] = useState({
        fullName: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        location: "",
    });

    // ------- VALIDATION -------
    const errors = useMemo(() => {
        const e = {};

        // Full name: letters & spaces only (no numbers/symbols), at least 2 chars
        if (!form.fullName.trim()) {
        e.fullName = "Full name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(form.fullName.trim())) {
        e.fullName = "Use letters and spaces only.";
        } else if (form.fullName.trim().length < 2) {
        e.fullName = "Name looks too short.";
        }

        // DOB: 16+
        if (!form.dob) {
        e.dob = "Date of birth is required.";
        } else {
        const age = calcAge(form.dob);
        if (age < 16) e.dob = "You must be at least 16 years old.";
        }

        // Gender required
        if (!form.gender) e.gender = "Please select gender.";

        // Phone: exactly 10 digits
        if (!form.phone) {
        e.phone = "Contact number is required.";
        } else if (!/^\d{10}$/.test(form.phone)) {
        e.phone = "Enter exactly 10 digits.";
        }

        // Email
        if (!form.email) {
        e.email = "Email is required.";
        } else if (!isValidEmail(form.email)) {
        e.email = "Enter a valid email address.";
        }

        // Location required
        if (!form.location.trim()) e.location = "Location is required.";

        return e;
    }, [form]);

    const isValid = Object.keys(errors).length === 0;

    // ------- HANDLERS -------
    function toggleCareType(label) {
        setCareTypes((prev) =>
        prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
        );
    }

    function onChange(e) {
        const { name, value } = e.target;

        // live restrictions
        if (name === "fullName") {
        // allow letters & spaces only while typing
        const next = value.replace(/[^A-Za-z\s]/g, "");
        setForm((f) => ({ ...f, fullName: next }));
        return;
        }

        if (name === "phone") {
        // digits only, max length 10
        const digits = value.replace(/\D/g, "").slice(0, 10);
        setForm((f) => ({ ...f, phone: digits }));
        return;
        }

        setForm((f) => ({ ...f, [name]: value }));
    }

    function onAvatarPick(e) {
        const file = e.target.files?.[0];
        if (file) setAvatar(file);
    }

    function onSubmit(e) {
        e.preventDefault();
        if (!isValid) return;

        // Build the payload you need. For now, just show it.
        const payload = {
        ...form,
        careTypes,
        };
        // TODO: send to backend
        console.log("Submit payload:", payload, avatar);
        alert("Form is valid ✅ (see console).");
    }

    return (
        <div className="min-h-screen bg-white p-6 md:p-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[320px,1fr] gap-10">
            {/* LEFT: Avatar + chips */}
            <div className="space-y-8">
            {/* Avatar */}
            <label className="group relative block w-48 h-48 rounded-full overflow-hidden bg-sky-300/70 place-items-center cursor-pointer mx-auto md:mx-0">
                {/* camera icon */}
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-black/70 group-hover:scale-105 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l2-2h3l2-2h4l2 2h3l2 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                />
                </svg>
                <input
                type="file"
                accept="image/*"
                onChange={onAvatarPick}
                className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </label>
            {avatar && (
                <p className="text-center md:text-left text-sm text-gray-600">
                Selected: <span className="font-medium">{avatar.name}</span>
                </p>
            )}

            {/* Care type chips */}
            <div>
                <p className="font-semibold mb-3">Type of Care</p>
                <div className="flex flex-wrap gap-3">
                {CARE_TYPES.map((label) => {
                    const active = careTypes.includes(label);
                    return (
                    <button
                        type="button"
                        key={label}
                        onClick={() => toggleCareType(label)}
                        className={cx(
                        "px-4 py-2 rounded-full border transition",
                        active
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-800 border-blue-400 hover:bg-blue-50"
                        )}
                    >
                        {label}
                    </button>
                    );
                })}
                </div>
            </div>
            </div>

            {/* RIGHT: form */}
            <form
            onSubmit={onSubmit}
            className="bg-gray-200 rounded-[36px] p-6 md:p-10"
            >
            {/* Full name */}
            <div className="mb-5">
                <label className="font-semibold block mb-2">Full Name</label>
                <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="Enter your full name"
                className={cx(
                    "w-full rounded-xl px-4 py-3 outline-none border",
                    errors.fullName
                    ? "border-red-500 bg-red-50"
                    : "border-transparent bg-blue-600 text-white placeholder-white/70"
                )}
                />
                {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
            </div>

            {/* DOB + Gender */}
            <div className="grid md:grid-cols-2 gap-6 mb-5">
                <div>
                <label className="font-semibold block mb-2">Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={onChange}
                    className={cx(
                    "w-full rounded-xl px-4 py-3 outline-none border",
                    errors.dob
                        ? "border-red-500 bg-red-50"
                        : "border-transparent bg-blue-600 text-white"
                    )}
                    max={new Date().toISOString().slice(0, 10)}
                />
                {errors.dob && (
                    <p className="text-red-600 text-sm mt-1">{errors.dob}</p>
                )}
                </div>

                <div>
                <label className="font-semibold block mb-2">Gender</label>
                <select
                    name="gender"
                    value={form.gender}
                    onChange={onChange}
                    className={cx(
                    "w-full rounded-xl px-4 py-3 outline-none border appearance-none",
                    errors.gender
                        ? "border-red-500 bg-red-50"
                        : "border-transparent bg-blue-600 text-white"
                    )}
                >
                    <option value="" className="text-gray-600">
                    Select…
                    </option>
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
                {errors.gender && (
                    <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
                )}
                </div>
            </div>

            {/* Phone */}
            <div className="mb-5">
                <label className="font-semibold block mb-2">Contact Number</label>
                <input
                name="phone"
                inputMode="numeric"
                value={form.phone}
                onChange={onChange}
                placeholder="10-digit number"
                className={cx(
                    "w-full rounded-xl px-4 py-3 outline-none border",
                    errors.phone
                    ? "border-red-500 bg-red-50"
                    : "border-transparent bg-blue-600 text-white placeholder-white/70"
                )}
                />
                <div className="flex items-center justify-between">
                {errors.phone ? (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                ) : (
                    <span className="text-xs text-gray-600 mt-1">
                    {form.phone.length}/10 digits
                    </span>
                )}
                </div>
            </div>

            {/* Email */}
            <div className="mb-5">
                <label className="font-semibold block mb-2">Email</label>
                <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="name@example.com"
                className={cx(
                    "w-full rounded-xl px-4 py-3 outline-none border",
                    errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-transparent bg-blue-600 text-white placeholder-white/70"
                )}
                />
                {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            {/* Location */}
            <div className="mb-8">
                <label className="font-semibold block mb-2">Location</label>
                <input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="City, Country"
                className={cx(
                    "w-full rounded-xl px-4 py-3 outline-none border",
                    errors.location
                    ? "border-red-500 bg-red-50"
                    : "border-transparent bg-blue-600 text-white placeholder-white/70"
                )}
                />
                {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location}</p>
                )}
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button
                type="submit"
                disabled={!isValid}
                className={cx(
                    "px-8 py-3 rounded-xl font-semibold transition shadow-sm",
                    isValid
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-indigo-300 text-white/80 cursor-not-allowed"
                )}
                >
                save
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}
