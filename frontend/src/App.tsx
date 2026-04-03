// import Footer from '@/components/Footer'
import { Navigate, Route, Routes } from "react-router-dom"
import "./index.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import KeycloakService from "./auth/keycloakService"
import DashboardPage from "./pages/DashboardPage"
import AvailabilityPage from "./pages/AvailabilityPage"
import SchedulePage from "./pages/SchedulePage"
import ShiftPoolPage from "./pages/ShiftPoolPage"
import StaffManagementPage from "./pages/admin/StaffManagementPage"
import ScheduleBuilderPage from "./pages/admin/ScheduleBuilderPage"
import ShiftPoolAdminPage from "./pages/admin/ShiftPoolAdminPage"
import SettingsPage from "./pages/admin/SettingsPage"
import Layout from "./Layouts/Layout/Layout"
import AccountPage from "./pages/AccountPage"

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="">
            <Route index element={<DashboardPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="availability" element={<AvailabilityPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="shift-pool" element={<ShiftPoolPage />} />
            <Route path="admin/staff" element={<StaffManagementPage />} />
            <Route path="admin/schedules" element={<ScheduleBuilderPage />} />
            <Route path="admin/shift-pool" element={<ShiftPoolAdminPage />} />
            <Route path="admin/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
