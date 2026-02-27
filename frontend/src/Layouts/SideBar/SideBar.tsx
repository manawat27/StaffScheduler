import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import MenuIcon from "@mui/icons-material/Menu"
import GroupsIcon from "@mui/icons-material/Groups"
import PersonIcon from "@mui/icons-material/Person"
import DashboardIcon from "@mui/icons-material/Dashboard"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import CorporateFareIcon from "@mui/icons-material/CorporateFare"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon } from "@hugeicons/core-free-icons"
import LogoutIcon from "@mui/icons-material/Logout"
import KeycloakService from "@/auth/keycloakService"

export default function SideBar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed")
    return stored === "true"
  })

  useEffect(() => {
    const userRole = KeycloakService.getUserInfo()?.roles || []
    if (userRole.includes("admin")) {
      // set isAdmin to true if user has admin role
      setIsAdmin(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed.toString())
  }, [collapsed])
  return (
    <nav
      className={`flex flex-col min-h-screen bg-gray-800 text-white py-8 px-4 shadow-lg transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
    >
      <button
        className="mb-6 self-end bg-gray-700 hover:bg-gray-600 rounded p-2 focus:outline-none"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <a>
          <MenuIcon />
        </a>
      </button>
      <div
        className={`mb-8 text-2xl font-bold flex items-center justify-center ${collapsed ? "hidden" : ""}`}
      >
        <HugeiconsIcon
          icon={UserCircleIcon}
          size={90}
          color="currentColor"
          strokeWidth={1.5}
        />
        <span className="ml-2">
          Hi, {KeycloakService.getUserInfo()?.firstName}!
        </span>
      </div>
      <NavLink
        to="/account"
        className={({ isActive }) =>
          `py-3 px-4 rounded hover:bg-blue-700 transition mb-2 flex items-center ${collapsed ? "justify-center" : ""} ${isActive ? "bg-blue-700" : ""}`
        }
        title="My Profile"
      >
        <PersonIcon className="mr-2" />
        {!collapsed && "My Profile"}
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `py-3 px-4 rounded hover:bg-blue-700 transition mb-2 flex items-center ${collapsed ? "justify-center" : ""} ${isActive ? "bg-blue-700" : ""}`
        }
        title="Dashboard"
      >
        <DashboardIcon className="mr-2" />
        {!collapsed && "Dashboard"}
      </NavLink>
      <NavLink
        to="/shift-pool"
        className={({ isActive }) =>
          `py-3 px-4 rounded hover:bg-blue-700 transition mb-2 flex items-center ${collapsed ? "justify-center" : ""} ${isActive ? "bg-blue-700" : ""}`
        }
        title="Shift Pool"
      >
        <GroupsIcon className="mr-2" />
        {!collapsed && "Shift Pool"}
      </NavLink>
      <NavLink
        to="/schedule"
        className={({ isActive }) =>
          `py-3 px-4 rounded hover:bg-blue-700 transition mb-2 flex items-center ${collapsed ? "justify-center" : ""} ${isActive ? "bg-blue-700" : ""}`
        }
        title="Schedule"
      >
        <CalendarMonthIcon className="mr-2" />
        {!collapsed && "Schedule"}
      </NavLink>

      {isAdmin && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `py-3 px-4 rounded hover:bg-blue-700 transition mb-2 flex items-center ${collapsed ? "justify-center" : ""} ${isActive ? "bg-blue-700" : ""}`
          }
          title="Organization"
        >
          <CorporateFareIcon className="mr-2" />
          {!collapsed && "Organization"}
        </NavLink>
      )}

      <a
        href="#"
        className={`py-3 px-4 rounded hover:bg-blue-700 transition mb-2 flex items-center ${collapsed ? "justify-center" : ""}`}
        onClick={() => KeycloakService.kcLogout()}
        title="Logout"
      >
        <LogoutIcon className="mr-2" />
        {!collapsed && "Logout"}
      </a>
    </nav>
  )
}
