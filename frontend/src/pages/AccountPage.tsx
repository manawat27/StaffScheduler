import { Grid } from "@mui/system"
import { useEffect, useState } from "react"
import KeycloakService from "../auth/keycloakService"
import Button from "@mui/material/Button"
import EditIcon from "@mui/icons-material/Edit"
import { AppUser } from "../types/AppUser"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import EditUserInfo from "../components/EditUserInfo"

export default function AccountPage() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }))

  const [userInfo, setUserInfo] = useState<AppUser | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editField, setEditField] = useState<string | null>(null)

  const handleEditClose = (updatedFields?: Partial<AppUser>) => {
    if (updatedFields && userInfo) {
      setUserInfo({ ...userInfo, ...updatedFields })
    }
    setIsEditOpen(false)
  }

  useEffect(() => {
    const userInfo = KeycloakService.getUserInfo()
    if (userInfo) {
      setUserInfo(userInfo)
    }
  }, [])

  const editUserInfo = (field: string) => {
    if (field == "edit-personal-info") {
      setEditField("Personal Information")
    } else if (field == "edit-address") {
      setEditField("Address")
    }
    setIsEditOpen(true)
  }

  return (
    <>
      <div className="p-6">
        {isEditOpen && (
          <EditUserInfo
            editField={editField ?? ""}
            userInfo={userInfo}
            onClose={handleEditClose}
          />
        )}
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <div className="mb-8 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col min-w-[120px] min-h-[100px]">
            <Grid container spacing={2}>
              <Grid size={2}>{/* place profile photo component here */}</Grid>
              <Grid size={10}>
                <Stack spacing={1}>
                  <div className="font-semibold">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </div>
                  <div className="text-xs font-medium">
                    {userInfo?.roles
                      ?.map((r) => r.charAt(0).toUpperCase() + r.slice(1))
                      .join(", ")}
                  </div>
                  <div className="text-xs font-medium">City, Country</div>
                </Stack>
              </Grid>
            </Grid>
          </div>
        </div>
        <div className="mb-8 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col min-w-[120px] min-h-[100px]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">Personal Information</div>
              <Button
                id="edit-personal-info"
                variant="contained"
                onClick={() => editUserInfo("edit-personal-info")}
              >
                Edit
                <EditIcon />
              </Button>
            </div>
            <hr className="h-px w-full mb-4 bg-gray-400" />
            <Grid container spacing={2} className="mb-7">
              <Grid size={3}>
                <div className="text-sm text-gray-600">First Name</div>
                <div className="text-base font-medium">
                  {userInfo?.firstName}
                </div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Last Name</div>
                <div className="text-base font-medium">
                  {userInfo?.lastName}
                </div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">
                  Date of Birth (YYYY-MM-DD)
                </div>
                <div className="text-base font-medium">
                  {userInfo?.dateOfBirth}
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Email Address</div>
                <div className="text-base font-medium">{userInfo?.email}</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Phone Number</div>
                <div className="text-base font-medium">{userInfo?.phone}</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">User Role</div>
                <div className="text-base font-medium">
                  {userInfo?.roles
                    ?.map((r) => r.charAt(0).toUpperCase() + r.slice(1))
                    .join(", ")}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        <div className="mb-8 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col min-w-[120px] min-h-[100px]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">Address</div>
              <Button
                id="edit-address"
                variant="contained"
                onClick={() => editUserInfo("edit-address")}
              >
                Edit
                <EditIcon />
              </Button>
            </div>
            <hr className="h-px w-full mb-4 bg-gray-400" />
            <Grid container spacing={2} className="mb-7">
              <Grid size={3}>
                <div className="text-sm text-gray-600">Country</div>
                <div className="text-base font-medium">{userInfo?.country}</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">City</div>
                <div className="text-base font-medium">{userInfo?.city}</div>
              </Grid>
              <Grid size={3}>
                <div className="text-sm text-gray-600">Postal Code</div>
                <div className="text-base font-medium">
                  {userInfo?.postalCode}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  )
}
