import { Grid } from "@mui/system"
import { useEffect, useState } from "react"
import { AppUser } from "../types/AppUser"
import KeycloakService from "../auth/keycloakService"
import Button from "@mui/material/Button"
import EditIcon from "@mui/icons-material/Edit"

export default function AccountPage() {
  const [userInfo, setUserInfo] = useState<AppUser>()

  useEffect(() => {
    const userInfo = KeycloakService.getUserInfo()
    const test = KeycloakService.getOrganizationFromToken()
    console.log("Organization from token:", test)
    if (userInfo) {
      console.log("User Info:", userInfo)
      //   setUserInfo(userInfo)
    }
  }, [])

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <div className="mb-8 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col min-w-[120px] min-h-[100px]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">Personal Information</div>
              <Button variant="contained">
                Edit
                <EditIcon />
              </Button>
            </div>
            <hr className="h-px w-full mb-4 bg-gray-400" />
            <Grid container spacing={2} className="mb-7">
              <Grid size={3}>
                <div className="text-sm text-gray-600">First Name</div>
                <div className="text-base font-medium">John</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Last Name</div>
                <div className="text-base font-medium">Doe</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">
                  Date of Birth (YYYY-MM-DD)
                </div>
                <div className="text-base font-medium">01-01-1990</div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Email Address</div>
                <div className="text-base font-medium">
                  john.doe@example.com
                </div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Phone Number</div>
                <div className="text-base font-medium">Doe</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">User Role</div>
                <div className="text-base font-medium">
                  john.doe@example.com
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        <div className="mb-8 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col min-w-[120px] min-h-[100px]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">Personal Information</div>
              <Button variant="contained">
                Edit
                <EditIcon />
              </Button>
            </div>
            <hr className="h-px w-full mb-4 bg-gray-400" />
            <Grid container spacing={2} className="mb-7">
              <Grid size={3}>
                <div className="text-sm text-gray-600">First Name</div>
                <div className="text-base font-medium">John</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Last Name</div>
                <div className="text-base font-medium">Doe</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">
                  Date of Birth (YYYY-MM-DD)
                </div>
                <div className="text-base font-medium">01-01-1990</div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Email Address</div>
                <div className="text-base font-medium">
                  john.doe@example.com
                </div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Phone Number</div>
                <div className="text-base font-medium">Doe</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">User Role</div>
                <div className="text-base font-medium">
                  john.doe@example.com
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  )
}
