import { Link, NavLink } from "react-router-dom"

export default function SideBar() {
  return (
    <nav className="flex flex-col h-full bg-gray-800 text-white py-8 px-4 w-64 shadow-lg">
      <div className="mb-8 text-2xl font-bold text-center tracking-wide">
        Menu
      </div>
      <NavLink
        to="/"
        className="py-3 px-4 rounded hover:bg-blue-700 transition mb-2"
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/availability"
        className="py-3 px-4 rounded hover:bg-blue-700 transition mb-2"
      >
        Availability
      </NavLink>
      <NavLink
        to="/schedule"
        className="py-3 px-4 rounded hover:bg-blue-700 transition mb-2"
      >
        Schedule
      </NavLink>
      {/* Add more links as needed */}
    </nav>
  )
}
