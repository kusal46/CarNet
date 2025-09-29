import { useMemo } from "react";
import {
    MapPin,
    ShieldCheck,
    Clock,
    Star,
    Link as LinkIcon,
    Pencil,
    Plus,
    ChevronRight,
    } from "lucide-react";

    export default function CaregiverProfile() {
    // TODO: replace these with real data from your API
    const profile = useMemo(
        () => ({
        name: "Thanuja N.",
        verified: true,
        location: "Colombo, Sri Lanka",
        localTime: "5:14 pm local time",
        hourlyRate: 15,
        title: "A Frontend web designer with React.js experience",
        bio:
            "Hello! Welcome to my profile. I'm a professional motion graphic designer and video animator. I have two years of experience working as a freelancer. Below is a sample of some of the projects I have done so far.",
        software: [
            "Adobe After Effects",
            "Adobe Photoshop",
            "Adobe Premiere Pro",
            "Adobe Illustrator",
        ],
        portfolio: [
            {
            id: "1",
            title: "Gaming Website Landing Page UI Designing",
            image:
                "https://images.unsplash.com/photo-1607259471882-37f3d44a3f66?q=80&w=1200&auto=format&fit=crop",
            },
            {
            id: "2",
            title: "Mobile UI/UX Design",
            image:
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
            },
            {
            id: "3",
            title:
                "Website Landing pages and Dashboard UI/UX Design",
            image:
                "https://images.unsplash.com/photo-1551281044-8d8c6d97efc7?q=80&w=1200&auto=format&fit=crop",
            },
        ],
        connects: 110,
        hoursPerWeek: "< 30 hrs/week",
        noContractPref: true,
        languages: [
            { name: "English", level: "Fluent" },
            { name: "Spanish", level: "Basic" },
        ],
        verifications: [{ name: "ID", status: "Unverified" }],
        skills: [
            "Adobe After Effects",
            "Adobe Illustrator",
            "Adobe XD",
            "Logo Animation",
            "Video Editing",
            "Graphics",
            "Premiere Pro",
            "Maxon Cinema 4D",
            "UI/UX Prototyping",
            "Blender",
            "Motion Graphics",
            "UI Animation",
            "Mobile UI Design",
        ],
        workHistory: [],
        projectCatalog: [],
        social: [{ label: "See public view", href: "/" }],
        }),
        []
    );

    return (
        <div className="min-h-screen bg-neutral-50">
        {/* Top bar */}
        <div className="border-b bg-white">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                <img
                    alt={profile.name}
                    className="h-full w-full object-cover"
                    src="https://i.pravatar.cc/120?img=5"
                />
                </div>
                <div className="leading-tight">
                <div className="flex items-center gap-2">
                    <h1 className="font-semibold">{profile.name}</h1>
                    {profile.verified && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                        <ShieldCheck className="h-4 w-4" />
                        Verify your identity
                    </span>
                    )}
                </div>
                <div className="text-xs text-neutral-500 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location} – {profile.localTime}
                </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {profile.social.map((s) => (
                <a
                    key={s.label}
                    href={s.href}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-blue-50"
                >
                    <LinkIcon className="h-4 w-4" />
                    {s.label}
                </a>
                ))}
                <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Profile settings
                </button>
            </div>
            </div>
        </div>

        {/* Main */}
        <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column (sidebar) */}
            <aside className="lg:col-span-3 space-y-4">
            <Card>
                <div className="flex items-center justify-between">
                <h3 className="font-semibold">Promote with ads</h3>
                <Pencil className="h-4 w-4 text-neutral-400" />
                </div>
                <div className="mt-3 text-sm text-neutral-600 space-y-3">
                <Row label="Availability badge" value="Off" />
                <Row label="Boost your profile" value="Off" />
                </div>
            </Card>

            <Card>
                <h3 className="font-semibold">Connects: {profile.connects}</h3>
                <div className="mt-3 flex gap-2">
                <button className="btn-outline">View details</button>
                <button className="btn-outline">Buy Connects</button>
                </div>
            </Card>

            <Card>
                <h3 className="font-semibold">Video introduction</h3>
                <button className="mt-3 btn-icon">
                <Plus className="h-4 w-4" />
                </button>
            </Card>

            <Card>
                <h3 className="font-semibold">Hours per week</h3>
                <div className="mt-2 text-sm text-neutral-700">
                {profile.hoursPerWeek}
                </div>
                {profile.noContractPref && (
                <div className="text-xs text-neutral-500">
                    No contract-to-hire preference set
                </div>
                )}
            </Card>

            <Card>
                <h3 className="font-semibold">Languages</h3>
                <ul className="mt-2 space-y-1 text-sm">
                {profile.languages.map((l) => (
                    <li key={l.name} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-neutral-500">{l.level}</span>
                    </li>
                ))}
                </ul>
            </Card>

            <Card>
                <h3 className="font-semibold">Verifications</h3>
                <ul className="mt-2 space-y-2 text-sm">
                {profile.verifications.map((v) => (
                    <li key={v.name} className="flex items-center justify-between">
                    <span>{v.name}: </span>
                    <span className="text-neutral-500">{v.status}</span>
                    </li>
                ))}
                </ul>
            </Card>
            </aside>

            {/* Right column (main content) */}
            <main className="lg:col-span-9 space-y-6">
            <Card>
                <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                    <h2 className="font-semibold">
                        {profile.title}
                    </h2>
                    <button className="btn-icon" title="Edit title">
                        <Pencil className="h-4 w-4" />
                    </button>
                    </div>
                    <p className="mt-2 text-sm text-neutral-700 max-w-3xl">
                    {profile.bio}
                    </p>
                    <div className="mt-3 text-xs text-neutral-500">
                    <span className="font-medium text-neutral-700">
                        Types of Software I Work With:
                    </span>{" "}
                    {profile.software.join(", ")}.
                    </div>
                </div>

                <Rate rate={profile.hourlyRate} />
                </div>
            </Card>

            {/* Portfolio */}
            <Card>
                <div className="flex items-center justify-between">
                <h3 className="font-semibold">Portfolio</h3>
                <div className="flex items-center gap-2">
                    <Tab active>Published</Tab>
                    <Tab>Drafts</Tab>
                </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.portfolio.map((p) => (
                    <PortfolioCard key={p.id} item={p} />
                ))}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 text-sm text-emerald-700">
                <button className="inline-flex items-center gap-1 hover:underline">
                    more <ChevronRight className="h-4 w-4" />
                </button>
                </div>
            </Card>

            {/* Work history */}
            <Card>
                <h3 className="font-semibold">Work history</h3>
                {profile.workHistory.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-500">No items</p>
                ) : (
                <ul className="mt-3 space-y-3">
                    {profile.workHistory.map((w) => (
                    <li key={w.id}>{w.title}</li>
                    ))}
                </ul>
                )}
            </Card>

            {/* Skills */}
            <Card>
                <div className="flex items-center justify-between">
                <h3 className="font-semibold">Skills</h3>
                <button className="btn-icon" title="Edit skills">
                    <Pencil className="h-4 w-4" />
                </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                    <span
                    key={s}
                    className="rounded-2xl border px-3 py-1 text-sm bg-white"
                    >
                    {s}
                    </span>
                ))}
                </div>
            </Card>

            {/* Project catalog (placeholder) */}
            <Card>
                <h3 className="font-semibold">Your project catalog</h3>
                <p className="mt-2 text-sm text-neutral-600">
                Create projects as a way to earn on our platform.{" "}
                <a href="#" className="text-emerald-700 hover:underline">
                    Create a project
                </a>
                .
                </p>
            </Card>
            </main>
        </div>
        </div>
    );
    }

    /* ---------- Small building blocks ---------- */

    function Card({ children }) {
    return (
        <section className="rounded-2xl border bg-white p-4 shadow-sm">{children}</section>
    );
    }

    function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">{label}</span>
        <span className="text-sm">{value}</span>
        </div>
    );
    }

    function Tab({ children, active = false }) {
    return (
        <button
        className={
            "rounded-full px-3 py-1 text-sm " +
            (active
            ? "bg-neutral-900 text-white"
            : "border text-neutral-700 hover:bg-neutral-50")
        }
        >
        {children}
        </button>
    );
    }

    function Rate({ rate }) {
    return (
        <div className="shrink-0 text-right">
        <div className="text-sm text-neutral-500">/hr</div>
        <div className="text-2xl font-semibold">${rate.toFixed(2)}</div>
        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-amber-600">
            <Star className="h-4 w-4 fill-current" />
            Top Rated
        </div>
        </div>
    );
    }

    function PortfolioCard({ item }) {
    return (
        <article className="overflow-hidden rounded-2xl border bg-white">
        <div className="aspect-[16/10] w-full overflow-hidden">
            <img
            alt={item.title}
            src={item.image}
            className="h-full w-full object-cover"
            loading="lazy"
            />
        </div>
        <div className="p-3">
            <h4 className="text-sm font-medium leading-snug">{item.title}</h4>
        </div>
        </article>
    );
    }

    /* Utility buttons */
    function BtnBase({ className = "", ...props }) {
    return (
        <button
        className={
            "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm " +
            className
        }
        {...props}
        />
    );
    }
    function BtnOutline(props) {
    return <BtnBase className="hover:bg-neutral-50" {...props} />;
    }
    function BtnIcon(props) {
    return <BtnBase className="p-2 text-neutral-500" {...props} />;
}

// Expose utility classes
const button = "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50";
