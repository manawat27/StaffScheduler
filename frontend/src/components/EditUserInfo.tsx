import Button from "@mui/material/Button"
import { AppUser } from "../types/AppUser"
import { Grid } from "@mui/system"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { AppRoles } from "../types/AppRoles"
import KeycloakService from "../auth/keycloakService"
import { useState } from "react"
import config from "../config"
import { toast } from "react-toastify"
import axios from "axios"
import { updateUserInfo } from "../utils/api"

interface EditUserInfoProps {
  editField: string
  userInfo: AppUser | null
  onClose: (updatedFields?: Partial<AppUser>) => void
}

export default function EditUserInfo({
  editField,
  userInfo,
  onClose,
}: EditUserInfoProps) {
  const [firstName, setFirstName] = useState(userInfo?.firstName ?? "")
  const [lastName, setLastName] = useState(userInfo?.lastName ?? "")
  const [email, setEmail] = useState(userInfo?.email ?? "")
  const [phone, setPhone] = useState(userInfo?.phone ?? "")
  const [dateOfBirth, setDateOfBirth] = useState(userInfo?.dateOfBirth ?? "")
  const [roles, setRoles] = useState<string[]>(userInfo?.roles ?? [])
  const [country, setCountry] = useState(userInfo?.country ?? "")
  const [city, setCity] = useState(userInfo?.city ?? "")
  const [postalCode, setPostalCode] = useState(userInfo?.postalCode ?? "")
  const [saving, setSaving] = useState(false)

  const handleRolesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    setRoles(typeof value === "string" ? value.split(",") : value)
  }

  const handleSave = async () => {
    if (!userInfo?.uuid) return
    setSaving(true)
    try {
      const token = KeycloakService.getToken()
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
      await updateUserInfo(userInfo.uuid, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        date_of_birth: dateOfBirth,
        role: { code: roles[0] ?? "" },
        country,
        city,
        postal_code: postalCode,
      })
      toast.success("Changes saved successfully!")
      onClose({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        roles,
        country,
        city,
        postalCode,
      })
    } catch (err) {
      console.error("Failed to save changes", err)
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Failed to save changes")
      } else {
        toast.error("Failed to save changes")
      }
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit {editField}</h2>
        {editField === "Personal Information" && (
          <div className="space-y-9">
            <Grid container spacing={2} className="mb-7">
              <Grid size={6}>
                <label className="text-sm text-gray-600">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </Grid>
              <Grid size={6}>
                <label className="text-sm text-gray-600">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className="mb-7">
              <Grid size={12}>
                <label className="text-sm text-gray-600">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className="mb-7">
              <Grid size={12}>
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className="mb-7">
              <Grid size={12}>
                <label className="text-sm text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className="mb-7">
              <Grid size={12}>
                <label className="text-sm text-gray-600">User Role</label>
                {KeycloakService.getUserRoles().some(
                  (r) => r === AppRoles.Admin || r === AppRoles.Manager,
                ) ? (
                  <Select<string[]>
                    label="User Role"
                    multiple
                    value={roles}
                    onChange={handleRolesChange}
                    className="w-full"
                  >
                    {Object.entries(AppRoles).map(([key, value]) => (
                      <MenuItem key={value} value={value}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 mt-1"
                    disabled
                    value={userInfo?.roles
                      ?.map((r) => r.charAt(0).toUpperCase() + r.slice(1))
                      .join(", ")}
                  />
                )}
              </Grid>
            </Grid>
          </div>
        )}
        {editField === "Address" && (
          <div className="space-y-9">
            <Grid container spacing={2} className="mb-7">
              <Grid size={6}>
                <label className="text-sm text-gray-600">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </Grid>
              <Grid size={6}>
                <label className="text-sm text-gray-600">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </Grid>
              <Grid size={6}>
                <label className="text-sm text-gray-600">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </Grid>
            </Grid>
          </div>
        )}
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
