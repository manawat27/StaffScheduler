import { NavLink } from "react-router-dom"
import PersonIcon from "@mui/icons-material/Person"

const Header = (props: { userName: string; userRole?: string }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-8 flex items-center justify-between">
      <div />
      <NavLink
        to="/account"
        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors no-underline"
      >
        <span className="flex flex-col items-end leading-tight">
          <span className="text-sm font-semibold text-slate-800">
            {props.userName}
          </span>
          {props.userRole && (
            <span className="text-[11px] text-slate-400 font-medium">
              {props.userRole.toUpperCase()}
            </span>
          )}
        </span>
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <PersonIcon fontSize="small" />
        </div>
      </NavLink>
    </header>
  )
}

export default Header
