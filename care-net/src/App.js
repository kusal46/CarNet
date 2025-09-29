import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./auth";
import Signup from "./Pages/Public/Signup";
import Login from "./Pages/Public/Login";
import CaregiverProfile from "./Pages/ProfileManager/CaregiverProfile";


// simple guards
function Protected({ children, allow }) {
  const token = auth.token();
  const role  = auth.role();
  if (!token) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(role)) return <Navigate to="/forbidden" replace />;
  return children;
}

function Placeholder({ title }) {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-2xl">{title}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forbidden" element={<Placeholder title="403 — Forbidden" />} />

        {/* ROLE PAGES (examples) */}
        <Route path="/seekers/home" element={
          <Protected allow={["CARE_SEEKER"]}>
            <Placeholder title="Seeker Home" />
          </Protected>
        } />
        <Route path="/caregivers/home" element={
          <Protected allow={["CAREGIVER"]}>
            <CaregiverProfile />
          </Protected>
        } />
        <Route path="/admin" element={
          <Protected allow={["ADMIN"]}>
            <Placeholder title="Admin Dashboard" />
          </Protected>
        } />

        {/* 404 */}
        <Route path="*" element={<Placeholder title="404 — Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
