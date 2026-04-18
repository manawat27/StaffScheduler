import Header from "../Head/Header/Header"
import Footer from "../Footer/Footer"
import { Outlet } from "react-router-dom"

import SideBar from "../SideBar/SideBar"
import { useState, useEffect } from "react"
import KeycloakService from "../../auth/keycloakService"

export default function Layout() {
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.title = "Staff Scheduler"
    const userName =
      KeycloakService.getUserInfo()?.lastName +
      ", " +
      KeycloakService.getUserInfo()?.firstName
    setUserName(userName || "")
    const userRole = (KeycloakService.getUserInfo()?.roles[0] || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase())
    setUserRole(userRole)
  }, [])
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Sidebar — hidden on mobile, shown as drawer when open */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SideBar onNavigate={() => setMobileOpen(false)} />
      </div>
      {/* Right side: header + content + footer */}
      <div className="flex flex-col flex-1 min-h-screen min-w-0">
        {/* Header */}
        <Header
          userName={userName}
          userRole={userRole}
          onMenuToggle={() => setMobileOpen((o) => !o)}
        />
        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-6 overflow-auto">
          <Outlet />
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
