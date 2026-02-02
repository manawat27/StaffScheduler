import React from "react"

import { NavLink } from "react-router-dom"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/pay", label: "Pay/COGs" },
  { to: "/content", label: "Content" },
  { to: "/benefits", label: "Benefits" },
  { to: "/settings", label: "Settings" },
]

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-800 to-blue-500 text-white py-3 px-8 shadow flex items-center justify-between">
      {/* Logo / App Name */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-wide">Staff Scheduler</span>
      </div>

      {/* Navigation */}
      <nav className="flex gap-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-white hover:text-blue-200 font-medium transition px-2 py-1 rounded ${isActive ? "bg-blue-900 bg-opacity-40" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User/Profile area */}
      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold border border-blue-300">
          <span className="sr-only">User</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
