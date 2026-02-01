// import Footer from '@/components/Footer'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./index.css"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DashboardPage from "./pages/DashboardPage"
import AvailabilityPage from "./pages/AvailabilityPage"
import SchedulePage from "./pages/SchedulePage"
import LoginPage from "./pages/LoginPage"

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/availability" element={<AvailabilityPage />} />
      <Route path="/schedule" element={<SchedulePage />} />

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
