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
import CloseIcon from "@mui/icons-material/Close"
import KeycloakService from "@/auth/keycloakService"

const navLinkClass = (isActive: boolean, compact: boolean) =>
  `py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-medium
  ${compact ? "justify-center px-2" : ""}
  ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`

export default function SideBar({ onNavigate }: { onNavigate?: () => void }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isManager, setIsManager] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed")
    return stored === "true"
  })
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768,
  )

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  useEffect(() => {
    const userRoles = KeycloakService.getUserInfo()?.roles || []
    const managementRoles = [
      "admin",
      "general_manager",
      "front_of_house_manager",
    ]
    if (userRoles.includes("admin")) {
      setIsAdmin(true)
    }
    if (managementRoles.some((r) => userRoles.includes(r))) {
      setIsManager(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed.toString())
  }, [collapsed])

  const firstName = KeycloakService.getUserInfo()?.firstName || ""

  // On mobile, always show expanded regardless of collapsed state
  const compact = collapsed && !isMobile

  return (
    <nav
      className={`flex flex-col min-h-screen bg-white border-r border-slate-200 py-6 px-3 transition-all duration-300 ${compact ? "w-[72px]" : "w-64"}`}
    >
      {/* Logo + collapse / close */}
      <div className="flex items-center justify-between mb-6 px-1">
        {!compact && (
          <span className="text-lg font-bold text-slate-800 tracking-tight">
            Staff Scheduler
          </span>
        )}
        {/* Desktop collapse toggle */}
        <button
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors hidden md:block"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MenuIcon fontSize="small" />
        </button>
        {/* Mobile close button */}
        <button
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors md:hidden"
          onClick={onNavigate}
          aria-label="Close menu"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* User card */}
      {!compact && (
        <div className="mb-6 mx-1 p-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-800 truncate">
                Hi, {firstName}!
              </span>
              <span className="text-xs text-slate-500">Welcome back</span>
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <div className="flex-1 flex flex-col gap-1 mx-1">
        <NavLink
          to="/account"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive, compact)}
          title="My Profile"
        >
          <PersonIcon fontSize="small" />
          {!compact && "My Profile"}
        </NavLink>
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive, compact)}
          title="Dashboard"
        >
          <DashboardIcon fontSize="small" />
          {!compact && "Dashboard"}
        </NavLink>
        <NavLink
          to="/shift-pool"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive, compact)}
          title="Shift Pool"
        >
          <GroupsIcon fontSize="small" />
          {!compact && "Shift Pool"}
        </NavLink>
        <NavLink
          to="/availability"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive, compact)}
          title="Availability"
        >
          <EventAvailableIcon fontSize="small" />
          {!compact && "Availability"}
        </NavLink>
        <NavLink
          to="/schedule"
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive, compact)}
          title="Schedule"
        >
          <CalendarMonthIcon fontSize="small" />
          {!compact && "Schedule"}
        </NavLink>

        {/* Manager section */}
        {isManager && (
          <>
            {!compact && (
              <div className="mt-5 mb-1 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Management
              </div>
            )}
            {compact && <div className="my-2 border-t border-slate-200" />}
            <NavLink
              to="/admin/staff"
              onClick={onNavigate}
              className={({ isActive }) => navLinkClass(isActive, compact)}
              title="Staff Management"
            >
              <PeopleIcon fontSize="small" />
              {!compact && "Staff"}
            </NavLink>
            <NavLink
              to="/admin/schedules"
              onClick={onNavigate}
              className={({ isActive }) => navLinkClass(isActive, compact)}
              title="Schedule Builder"
            >
              <BuildIcon fontSize="small" />
              {!compact && "Schedule Builder"}
            </NavLink>
            <NavLink
              to="/admin/shift-pool"
              onClick={onNavigate}
              className={({ isActive }) => navLinkClass(isActive, compact)}
              title="Shift Pool Mgmt"
            >
              <AssignmentIcon fontSize="small" />
              {!compact && "Pool Mgmt"}
            </NavLink>
            <NavLink
              to="/admin/settings"
              onClick={onNavigate}
              className={({ isActive }) => navLinkClass(isActive, compact)}
              title="Settings"
            >
              <SettingsIcon fontSize="small" />
              {!compact && "Settings"}
            </NavLink>
          </>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            onClick={onNavigate}
            className={({ isActive }) => navLinkClass(isActive, compact)}
            title="Organization"
          >
            <CorporateFareIcon fontSize="small" />
            {!compact && "Organization"}
          </NavLink>
        )}
      </div>

      {/* Logout at bottom */}
      <div className="mt-auto mx-1 pt-4 border-t border-slate-200">
        <a
          href="#"
          className={`py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 ${compact ? "justify-center px-2" : ""}`}
          onClick={() => KeycloakService.kcLogout()}
          title="Logout"
        >
          <LogoutIcon fontSize="small" />
          {!compact && "Logout"}
        </a>
      </div>
    </nav>
  )
}
