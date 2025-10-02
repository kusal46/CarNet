import { useState } from "react";
import { apiPost } from "../../api";
import { auth } from "../../auth";
import { Link, useNavigate } from "react-router-dom";
import IMG1 from "../../Assets/google-logo-search-new-svgrepo-com.svg";
import IMG2 from "../../Assets/apple-logo-svgrepo-com.svg";

const roles = [
    { value: "CARE_SEEKER", label: "Care Seeker" },
    { value: "CAREGIVER", label: "Caregiver" },
    ];

    export default function Signup() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        city: "",
        address: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const onChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    async function submit(e) {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
        const data = await apiPost("/auth/register", form);
        auth.save(data);
        if (data.role === "CAREGIVER") navigate("/caregivers/home");
        else if (data.role === "CARE_SEEKER") navigate("/seekers/home");
        else navigate("/login");
        } catch (ex) {
        setErr(ex.message);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white">
        {/* brand */}
        <div className="p-4 text-2xl font-serif text-black">CareNet</div>

        {/* tighter container & card */}
        <div className="mx-auto max-w-xl px-3">
            <div className="mx-auto max-w-lg border rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-semibold text-center">
                Sign up to find work you love
            </h1>

            {/* social row (smaller) */}
            <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="rounded-full border px-3 py-2 text-sm">
                <img
                    src={IMG2}
                    alt="Apple logo"
                    className="inline-block mr-2 size-5"
                />
                Continue with Apple
                </button>
                <button className="rounded-full border px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700">
                <img
                    src={IMG1}
                    alt="Google logo"
                    className="inline-block mr-2 size-6 bg-white rounded-full"
                />
                Continue with Google
                </button>
            </div>

            <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            {err && (
                <div className="mb-3 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
                {err}
                </div>
            )}

            <form onSubmit={submit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium mb-1">
                    First name
                    </label>
                    <input
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    required
                    maxLength={80}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">
                    Last name
                    </label>
                    <input
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    required
                    maxLength={80}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                </div>

                <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                </div>

                <div>
                <label className="block text-xs font-medium mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    minLength={8}
                    required
                    placeholder="Password (8 or more characters)"
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium mb-1">City</label>
                    <input
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">
                    Location
                    </label>
                    <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                </div>

                <div>
                <label className="block text-xs font-medium mb-1">Sign up as</label>
                <select
                    name="role"
                    value={form.role}
                    onChange={onChange}
                    required
                    className="w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="" disabled>
                    Select role
                    </option>
                    {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                        {r.label}
                    </option>
                    ))}
                </select>
                </div>

                {/* checkboxes (kept compact) */}
                <label className="flex items-start gap-2 text-xs text-gray-600">
                <input type="checkbox" className="mt-0.5" />
                Send me helpful emails to find rewarding work and job leads.
                </label>
                <label className="flex items-start gap-2 text-xs text-gray-600">
                <input type="checkbox" required className="mt-0.5" />
                Yes, I understand and agree to the Terms of Service and Privacy
                Policy.
                </label>

                {/* smaller button & centered */}
                <div className="flex justify-center pt-1">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto rounded-full bg-blue-600 px-5 py-2 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Creating..." : "Create my account"}
                </button>
                </div>

                <p className="text-center text-xs text-gray-600">
                Already have an account?{" "}
                <Link className="text-emerald-600 underline" to="/login">
                    Log in
                </Link>
                </p>
            </form>
            </div>
        </div>
        </div>
    );
}
