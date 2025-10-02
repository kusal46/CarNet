import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function CareSeekerLayout() {
    return (
        <div className="min-h-screen">
        <header className="p-4 border-b">
            <nav className="flex gap-4">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/care-seeker/home">Home</Link>
            </nav>
        </header>
        <main className="p-4">
            <Outlet />
        </main>
        </div>
    );
}
