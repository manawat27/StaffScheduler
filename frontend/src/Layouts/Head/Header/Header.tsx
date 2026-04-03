import { NavLink } from "react-router-dom"
import Grid from "@mui/material/Grid"
import PersonIcon from "@mui/icons-material/Person"

const Header = (props: { userName: string; userRole?: string }) => {
  return (
    <Grid
      className="w-full bg-gradient-to-r from-blue-800 to-blue-500 text-white py-8 px-8 shadow flex items-center"
      container
      spacing={2}
    >
      <Grid size={8}>
        <span className="text-xl font-bold tracking-wide">Staff Scheduler</span>
      </Grid>
      <Grid size={4} className="flex justify-end items-center">
        <NavLink
          to="/account"
          className="text-white hover:underline flex items-center"
        >
          <PersonIcon className="mr-2" />
          <span className="flex flex-col leading-tight">
            <span>{props.userName}</span>
            {props.userRole && (
              <span className="text-xs opacity-75">
                {props.userRole.toUpperCase()}
              </span>
            )}
          </span>
        </NavLink>
      </Grid>
    </Grid>
  )
}

export default Header
