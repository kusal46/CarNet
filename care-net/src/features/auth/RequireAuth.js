// src/features/auth/RequireAuth.js
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ roles }) {
  const { token, role } = useAuth();
  const loc = useLocation();

  console.log("[guard] location:", loc.pathname, "token?", !!token, "role:", role, "allowed:", roles);

  if (!token) {
    console.warn("[guard] no token -> redirect /login");
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  if (roles && roles.length > 0 && !roles.includes(role)) {
    console.warn("[guard] role not allowed -> /unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
