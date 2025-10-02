// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import RequireAuth from "./features/auth/RequireAuth";

// Layouts
import CareGiverLayout from "./Pages/layouts/CareGiverLayout";
import AdminLayout from "./Pages/layouts/AdminLayout";
import CareSeekerLayout from "./Pages/layouts/CareSeekerLayout";

// Public pages
import Login from "./Pages/Public/Login";
import Signup from "./Pages/Public/Signup";

// Caregiver pages (protected)
import CaregiverHome from "./Pages/ProfileManager/CaregiverProfile";
import CaregiverAdd from "./Pages/ProfileManager/CaregiverDetailsAdd";
import MyProfile from "./Pages/ProfileManager/CaregiverLoginDetails";              // ⬅️ NEW

// Care-seeker pages (protected)
import CareSeekerHome from "./Pages/ProfileManager/Careseeker/CareSeekerPersonalInfo";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<CareSeekerLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<div className="p-6">Unauthorized</div>} />
          </Route>

          {/* Care-seeker (protected) */}
          <Route element={<RequireAuth roles={["caregiver","care-seeker","admin"]} />}>
            <Route element={<CareSeekerLayout />}>
              <Route path="/care-seeker/home" element={<CareSeekerHome />} />
            </Route>
          </Route>

          {/* Caregiver (protected) */}
          <Route element={<RequireAuth roles={["caregiver"]} />}>
            <Route element={<CareGiverLayout />}>
              {/* make /caregiver redirect to /caregiver/me */}
              <Route index element={<Navigate to="/caregiver/me" replace />} />
              <Route path="/caregiver/me" element={<MyProfile />} />     {/* ⬅️ NEW */}
              <Route path="/caregiver/home" element={<CaregiverHome />} />
              <Route path="/caregiver/add" element={<CaregiverAdd />} />
            </Route>
          </Route>

          {/* Admin (protected) */}
          <Route element={<RequireAuth roles={["admin"]} />}>
            <Route
              path="/admin"
              element={<AdminLayout onLogout={() => {}} />}
            >
              <Route index element={<div className="p-6">Admin dashboard</div>} />
            </Route>
          </Route>

          {/* Default: go to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
