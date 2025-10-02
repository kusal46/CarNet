import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function CareGiverLayout() {
    return (
        <div className="min-h-screen">
        <header className="p-4 border-b">
            <nav className="flex gap-4">
            <Link to="/caregiver/me">Home</Link>
            <Link to="/caregiver/add">Add Details</Link>
            </nav>
        </header>
        <main className="p-4">
            <Outlet />
        </main>
        </div>
    );
}
