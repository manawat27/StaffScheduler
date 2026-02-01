// import Footer from '@/components/Footer'
import { Navigate, Route, Routes } from "react-router-dom"
import "./index.css"
import KeycloakService from "./auth/keycloakService"
import DashboardPage from "./pages/DashboardPage"
import AvailabilityPage from "./pages/AvailabilityPage"
import SchedulePage from "./pages/SchedulePage"
import Layout from "./Layouts/Layout/Layout"

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Layout/>}
      >
        <Route path="">
          <Route 
            index 
            element={<DashboardPage/>} 
          />
          <Route 
            path="availability" 
            element={<AvailabilityPage />} 
          />
          <Route 
            path="schedule" 
            element={<SchedulePage />} 
          />
        </Route>  
      </Route>
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
