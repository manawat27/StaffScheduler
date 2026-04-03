import Header from "../Head/Header/Header"
import Footer from "../Footer/Footer"
import { Outlet } from "react-router-dom"

import SideBar from "../SideBar/SideBar"
import { useState, useEffect } from "react"
import KeycloakService from "@/auth/keycloakService"

export default function Layout() {
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    document.title = "Staff Scheduler"
    const userName =
      KeycloakService.getUserInfo()?.lastName +
      ", " +
      KeycloakService.getUserInfo()?.firstName
    setUserName(userName || "")
    const userRole = KeycloakService.getUserInfo()?.roles[0]
    setUserRole(userRole || "")
  }, [])
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header userName={userName} userRole={userRole} />
      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />
        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}
