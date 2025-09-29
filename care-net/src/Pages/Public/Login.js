import { useState } from "react";
import { apiPost } from "../../api";
import { auth } from "../../auth";
import { Link, useNavigate } from "react-router-dom";
import IMG1 from "../../Assets/google-logo-search-new-svgrepo-com.svg";
import IMG2 from "../../Assets/apple-logo-svgrepo-com.svg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setErr(""); setLoading(true);
        try {
        // POST -> { accessToken, tokenType, userId, role }
        const data = await apiPost("/auth/login", { email, password });
        auth.save(data);

        // role-based redirect
        if (data.role === "CAREGIVER") navigate("/caregivers/home");
        else if (data.role === "CARE_SEEKER") navigate("/seekers/home");
        else navigate("/admin");
        } catch (ex) {
        setErr(ex.message || "Login failed");
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white font-poppins flex flex-col">
            {/* brand */}
            <div className="p-6 text-3xl font-semibold">CareNet</div>

            <div className="mx-auto max-w-xl px-4 flex-1 flex flex-col">
                <div className="mx-auto w-full rounded-xl border shadow-sm p-8 shadow-blue-300">
                    <h1 className="text-3xl font-semibold text-center mb-6">Log in to CarNet</h1>

                    {err && (
                        <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
                            {err}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Username or Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Continue"}
                        </button>

                        {/* divider & social placeholders */}
                        <div className="my-2 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span className="text-sm text-gray-500">or</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <button type="button" className="w-full rounded-md border py-2">
                            <img src={IMG1} alt="Google logo" className="inline-block mr-2 size-7" />
                            Continue with Google
                        </button>
                        <button type="button" className="w-full rounded-md border py-2">
                            <img src={IMG2} alt="Apple logo" className="inline-block mr-2 size-7" />
                            Continue with Apple
                        </button>

                        <div className="text-center text-sm text-gray-600 pt-4">
                            Don’t have an account?{" "}
                            <Link to="/signup" className="text-emerald-600 underline">Sign Up</Link>
                        </div>
                    </form>
                </div>
                {/* This empty div ensures flex-1 fills space above footer */}
            </div>
            <div className="mt-5 bg-black text-white py-6 text-center text-sm">
                © 2015 - {new Date().getFullYear()} CarNet® Global Inc. •{" "}
                <a href="/signup" className="underline">Privacy Policy</a> • Your Privacy Choices
            </div>
        </div>
    );
}
