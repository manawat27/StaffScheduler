import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import MenuIcon from "@mui/icons-material/Menu"
import GroupsIcon from "@mui/icons-material/Groups"
import PersonIcon from "@mui/icons-material/Person"
import DashboardIcon from "@mui/icons-material/Dashboard"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import CorporateFareIcon from "@mui/icons-material/CorporateFare"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import PeopleIcon from "@mui/icons-material/People"
import BuildIcon from "@mui/icons-material/Build"
import SettingsIcon from "@mui/icons-material/Settings"
import AssignmentIcon from "@mui/icons-material/Assignment"
import LogoutIcon from "@mui/icons-material/Logout"
import KeycloakService from "@/auth/keycloakService"

const navLinkClass = (isActive: boolean, collapsed: boolean) =>
  `py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-medium
  ${collapsed ? "justify-center px-2" : ""}
  ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`

export default function SideBar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isManager, setIsManager] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed")
    return stored === "true"
  })

  useEffect(() => {
    const userRole = KeycloakService.getUserInfo()?.roles || []
    if (userRole.includes("admin")) {
      setIsAdmin(true)
      setIsManager(true)
    }
    if (userRole.includes("manager")) {
      setIsManager(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed.toString())
  }, [collapsed])

  const firstName = KeycloakService.getUserInfo()?.firstName || ""

  return (
    <nav
      className={`flex flex-col min-h-screen bg-white border-r border-slate-200 py-6 px-3 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"}`}
    >
      {/* Logo + collapse */}
      <div className="flex items-center justify-between mb-6 px-1">
        {!collapsed && (
          <span className="text-lg font-bold text-slate-800 tracking-tight">
            Staff Scheduler
          </span>
        )}
        <button
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MenuIcon fontSize="small" />
        </button>
      </div>

      {/* User card */}
      {!collapsed && (
        <div className="mb-6 mx-1 p-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">
                Hi, {firstName}!
              </span>
              <span className="text-xs text-slate-500">Welcome back</span>
            </div>
          </div>
        </div>
      )}

      {/* Main nav card */}
      <div className="flex-1 flex flex-col gap-1 mx-1">
        <NavLink
          to="/account"
          className={({ isActive }) => navLinkClass(isActive, collapsed)}
          title="My Profile"
        >
          <PersonIcon fontSize="small" />
          {!collapsed && "My Profile"}
        </NavLink>
        <NavLink
          to="/"
          end
          className={({ isActive }) => navLinkClass(isActive, collapsed)}
          title="Dashboard"
        >
          <DashboardIcon fontSize="small" />
          {!collapsed && "Dashboard"}
        </NavLink>
        <NavLink
          to="/shift-pool"
          className={({ isActive }) => navLinkClass(isActive, collapsed)}
          title="Shift Pool"
        >
          <GroupsIcon fontSize="small" />
          {!collapsed && "Shift Pool"}
        </NavLink>
        <NavLink
          to="/availability"
          className={({ isActive }) => navLinkClass(isActive, collapsed)}
          title="Availability"
        >
          <EventAvailableIcon fontSize="small" />
          {!collapsed && "Availability"}
        </NavLink>
        <NavLink
          to="/schedule"
          className={({ isActive }) => navLinkClass(isActive, collapsed)}
          title="Schedule"
        >
          <CalendarMonthIcon fontSize="small" />
          {!collapsed && "Schedule"}
        </NavLink>

        {/* Manager section */}
        {isManager && (
          <>
            {!collapsed && (
              <div className="mt-5 mb-1 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Management
              </div>
            )}
            {collapsed && <div className="my-2 border-t border-slate-200" />}
            <NavLink
              to="/admin/staff"
              className={({ isActive }) => navLinkClass(isActive, collapsed)}
              title="Staff Management"
            >
              <PeopleIcon fontSize="small" />
              {!collapsed && "Staff"}
            </NavLink>
            <NavLink
              to="/admin/schedules"
              className={({ isActive }) => navLinkClass(isActive, collapsed)}
              title="Schedule Builder"
            >
              <BuildIcon fontSize="small" />
              {!collapsed && "Schedule Builder"}
            </NavLink>
            <NavLink
              to="/admin/shift-pool"
              className={({ isActive }) => navLinkClass(isActive, collapsed)}
              title="Shift Pool Mgmt"
            >
              <AssignmentIcon fontSize="small" />
              {!collapsed && "Pool Mgmt"}
            </NavLink>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) => navLinkClass(isActive, collapsed)}
              title="Settings"
            >
              <SettingsIcon fontSize="small" />
              {!collapsed && "Settings"}
            </NavLink>
          </>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => navLinkClass(isActive, collapsed)}
            title="Organization"
          >
            <CorporateFareIcon fontSize="small" />
            {!collapsed && "Organization"}
          </NavLink>
        )}
      </div>

      {/* Logout at bottom */}
      <div className="mt-auto mx-1 pt-4 border-t border-slate-200">
        <a
          href="#"
          className={`py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 ${collapsed ? "justify-center px-2" : ""}`}
          onClick={() => KeycloakService.kcLogout()}
          title="Logout"
        >
          <LogoutIcon fontSize="small" />
          {!collapsed && "Logout"}
        </a>
      </div>
    </nav>
  )
}
