import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./auth";

// PUBLIC pages
import Signup from "./Pages/Public/Signup";
import Login from "./Pages/Public/Login";

// CAREGIVER pages
import CaregiverProfile from "./Pages/ProfileManager/CaregiverProfile";
import CaregiverDetailsAdd from "./Pages/ProfileManager/CaregiverDetailsAdd";

/** -------- Helpers / Guards -------- */
function Protected({ children, allow }) {
  const token = auth.token();
  const role = auth.role();
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

/** If the user is a caregiver, try to route them to their own profile id.
 * We attempt caregiverId first, then id, otherwise show a helpful message.
 */
function CaregiverHomeRedirect() {
  const u = auth.user?.(); // make sure auth.user() exists in your auth helper
  const myId = u?.caregiverId ?? u?.id;

  if (!myId) {
    return (
      <Placeholder title="No caregiver id found for your account. Please create your profile first." />
    );
  }
  return <Navigate to={`/caregivers/${myId}`} replace />;
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

        {/* CARE SEEKER example page (kept from your file) */}
        <Route
          path="/seekers/home"
          element={
            <Protected allow={["CARE_SEEKER"]}>
              <Placeholder title="Seeker Home" />
            </Protected>
          }
        />

        {/* CAREGIVER */}
        {/* 1) “Home” redirects to the caregiver’s own profile if we have an id */}
        <Route
          path="/caregivers/home"
          element={
            <Protected allow={["CAREGIVER"]}>
              <CaregiverHomeRedirect />
            </Protected>
          }
        />

        {/* 2) Actual profile page expects an :id param */}
        <Route
          path="/caregivers/:id"
          element={
            <Protected allow={["CAREGIVER", "ADMIN"]}>
              <CaregiverProfile />
            </Protected>
          }
        />

        {/* 3) Add/Edit details page */}
        <Route
          path="/caregivers/add-details"
          element={
            <Protected allow={["CAREGIVER"]}>
              <CaregiverDetailsAdd />
            </Protected>
          }
        />

        {/* ADMIN example */}
        <Route
          path="/admin"
          element={
            <Protected allow={["ADMIN"]}>
              <Placeholder title="Admin Dashboard" />
            </Protected>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Placeholder title="404 — Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
