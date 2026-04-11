import { NavLink } from "react-router-dom"
import PersonIcon from "@mui/icons-material/Person"
import MenuIcon from "@mui/icons-material/Menu"

const Header = (props: {
  userName: string
  userRole?: string
  onMenuToggle?: () => void
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-3 px-4 sm:py-4 sm:px-8 flex items-center justify-between">
      {/* Mobile hamburger */}
      <button
        className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors md:hidden"
        onClick={props.onMenuToggle}
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </button>
      {/* Spacer on desktop */}
      <div className="hidden md:block" />
      <NavLink
        to="/account"
        className="flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors no-underline"
      >
        <span className="flex flex-col items-end leading-tight">
          <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-none">
            {props.userName}
          </span>
          {props.userRole && (
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              {props.userRole.toUpperCase()}
            </span>
          )}
        </span>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
          <PersonIcon fontSize="small" />
        </div>
      </NavLink>
    </header>
  )
}

export default Header
