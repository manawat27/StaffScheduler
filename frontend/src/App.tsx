// import Footer from '@/components/Footer'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./index.css"
import KeycloakService from "./auth/keycloakService"
import DashboardPage from "./pages/DashboardPage"
import AvailabilityPage from "./pages/AvailabilityPage"
import SchedulePage from "./pages/SchedulePage"

export default function App() {
  return (
    <Routes>
      {/* Protected */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/availability" element={<AvailabilityPage />} />
      <Route path="/schedule" element={<SchedulePage />} />

      {/* Default */}
      <Route path="/" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
