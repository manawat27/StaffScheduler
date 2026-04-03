// import Footer from '@/components/Footer'
import { Navigate, Route, Routes } from "react-router-dom"
import "./index.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import KeycloakService from "./auth/keycloakService"
import DashboardPage from "./pages/DashboardPage"
import AvailabilityPage from "./pages/AvailabilityPage"
import SchedulePage from "./pages/SchedulePage"
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
          </Route>
        </Route>
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
