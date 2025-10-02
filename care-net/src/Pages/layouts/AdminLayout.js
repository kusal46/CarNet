import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="min-h-screen">
        <header className="p-4 border-b">
            <nav className="flex gap-4">
            <Link to="/admin">Dashboard</Link>
            </nav>
        </header>
        <main className="p-4">
            <Outlet />
        </main>
        </div>
    );
}
