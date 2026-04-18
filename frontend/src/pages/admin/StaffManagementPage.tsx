import { useEffect, useState } from "react"
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material"
import PeopleIcon from "@mui/icons-material/People"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { toast } from "react-toastify"
import {
  getStaffProfiles,
  getActivePositions,
  getAppUsers,
  createStaffProfile,
  updateStaffProfile,
  getAllTimeOffRequests,
  reviewTimeOff,
  getRoles,
  inviteUser,
} from "../../utils/schedulingApi"
import type {
  StaffProfile,
  Position,
  TimeOffRequest,
} from "../../types/Scheduling"

interface AppUser {
  uuid: string
  first_name: string
  last_name: string
  email: string
  user_name: string
  enabled: boolean
}

export default function StaffManagementPage() {
  const [profiles, setProfiles] = useState<StaffProfile[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [timeOff, setTimeOff] = useState<TimeOffRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [tab, setTab] = useState(0)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<StaffProfile | null>(
    null,
  )
  const [form, setForm] = useState({
    user_uuid: "",
    position_id: "",
    priority: 5,
    max_hours_per_week: 40,
    max_consecutive_days: 5,
    is_active: true,
  })

  // Invite modal state
  const [inviteOpen, setInviteOpen] = useState(false)
  const [roles, setRoles] = useState<{ code: string; description: string }[]>(
    [],
  )
  const [inviteForm, setInviteForm] = useState({
    email: "",
    user_name: "",
    first_name: "",
    last_name: "",
    role: "",
    phone: "",
  })
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [p, u, pos, to] = await Promise.all([
        getStaffProfiles(),
        getAppUsers(),
        getActivePositions(),
        getAllTimeOffRequests(),
      ])
      setProfiles(p)
      setUsers(u)
      setPositions(pos)
      setTimeOff(to)
    } catch {
      setError("Failed to load staff data")
    } finally {
      setLoading(false)
    }
  }

  // Users without a staff profile
  const profiledUserUuids = new Set(profiles.map((p) => p.user_uuid))
  const unprofiledUsers = users.filter((u) => !profiledUserUuids.has(u.uuid))

  function openCreateModal(userUuid?: string) {
    setEditingProfile(null)
    setForm({
      user_uuid: userUuid || "",
      position_id: "",
      priority: 5,
      max_hours_per_week: 40,
      max_consecutive_days: 5,
      is_active: true,
    })
    setModalOpen(true)
  }

  function openEditModal(profile: StaffProfile) {
    setEditingProfile(profile)
    setForm({
      user_uuid: profile.user_uuid,
      position_id: profile.position_id || "",
      priority: profile.priority,
      max_hours_per_week: profile.max_hours_per_week,
      max_consecutive_days: profile.max_consecutive_days,
      is_active: profile.is_active,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    try {
      if (editingProfile) {
        await updateStaffProfile(editingProfile.id, {
          position_id: form.position_id || undefined,
          priority: form.priority,
          max_hours_per_week: form.max_hours_per_week,
          max_consecutive_days: form.max_consecutive_days,
          is_active: form.is_active,
        })
        toast.success("Staff profile updated")
      } else {
        if (!form.user_uuid) {
          toast.error("Please select a user")
          return
        }
        await createStaffProfile({
          user_uuid: form.user_uuid,
          position_id: form.position_id || undefined,
          priority: form.priority,
          max_hours_per_week: form.max_hours_per_week,
          max_consecutive_days: form.max_consecutive_days,
          is_active: form.is_active,
        })
        toast.success("Staff profile created")
      }
      setModalOpen(false)
      await loadData()
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to save staff profile",
      )
    }
  }

  function getUserName(uuid: string) {
    const u = users.find((u) => u.uuid === uuid)
    return u ? `${u.first_name} ${u.last_name}` : uuid
  }

  async function handleReviewTimeOff(
    id: string,
    status: "approved" | "denied",
  ) {
    try {
      await reviewTimeOff(id, status)
      toast.success(`Time-off ${status}`)
      setTimeOff((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t)),
      )
    } catch {
      toast.error("Failed to review time-off request")
    }
  }

  async function openInviteModal() {
    setInviteForm({
      email: "",
      user_name: "",
      first_name: "",
      last_name: "",
      role: "",
      phone: "",
    })
    try {
      const r = await getRoles()
      setRoles(r)
    } catch {
      toast.error("Failed to load roles")
    }
    setInviteOpen(true)
  }

  async function handleInvite() {
    if (
      !inviteForm.email ||
      !inviteForm.first_name ||
      !inviteForm.last_name ||
      !inviteForm.role
    ) {
      toast.error("Please fill in all required fields")
      return
    }
    const userName = inviteForm.user_name || inviteForm.email.split("@")[0]
    setInviting(true)
    try {
      await inviteUser({
        email: inviteForm.email,
        user_name: userName,
        first_name: inviteForm.first_name,
        last_name: inviteForm.last_name,
        role: inviteForm.role,
        phone: inviteForm.phone || undefined,
      })
      toast.success(`Invitation sent to ${inviteForm.email}`)
      setInviteOpen(false)
      await loadData()
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to invite user"
      toast.error(msg)
    } finally {
      setInviting(false)
    }
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  const pendingTimeOff = timeOff.filter((t) => t.status === "pending")

  return (
    <div className="p-6">
      <Box className="flex items-center gap-2 mb-6">
        <PeopleIcon color="primary" fontSize="large" />
        <Typography variant="h4" className="font-bold">
          Staff Management
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={openInviteModal}
        >
          Invite User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} className="mb-4">
        <Tab label={`Staff Profiles (${profiles.length})`} />
        <Tab
          label={`Time-Off Requests${pendingTimeOff.length > 0 ? ` (${pendingTimeOff.length} pending)` : ""}`}
        />
      </Tabs>

      {/* Tab 0: Staff Profiles */}
      {tab === 0 && (
        <>
          {unprofiledUsers.length > 0 && (
            <Alert severity="info" className="mb-4">
              {unprofiledUsers.length} user(s) without a staff profile.
              <Button
                size="small"
                className="ml-2"
                onClick={() => openCreateModal()}
              >
                Create Profile
              </Button>
            </Alert>
          )}

          <Box className="flex justify-end mb-3">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openCreateModal()}
              disabled={unprofiledUsers.length === 0}
            >
              New Staff Profile
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Position</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Priority</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Max Hrs/Wk</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Max Days</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{getUserName(profile.user_uuid)}</TableCell>
                    <TableCell>{profile.position?.name || "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={profile.priority}
                        size="small"
                        color={profile.priority >= 7 ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>{profile.max_hours_per_week}</TableCell>
                    <TableCell>{profile.max_consecutive_days}</TableCell>
                    <TableCell>
                      <Chip
                        label={profile.is_active ? "Active" : "Inactive"}
                        size="small"
                        color={profile.is_active ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => openEditModal(profile)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {profiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No staff profiles yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Tab 1: Time-Off Requests */}
      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Staff</strong>
                </TableCell>
                <TableCell>
                  <strong>Dates</strong>
                </TableCell>
                <TableCell>
                  <strong>Reason</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeOff.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    {getUserName(req.staff_profile?.user_uuid || "")}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      req.start_date + "T00:00:00",
                    ).toLocaleDateString()}{" "}
                    –{" "}
                    {new Date(req.end_date + "T00:00:00").toLocaleDateString()}
                  </TableCell>
                  <TableCell>{req.reason || "—"}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        req.status.charAt(0).toUpperCase() + req.status.slice(1)
                      }
                      size="small"
                      color={
                        req.status === "approved"
                          ? "success"
                          : req.status === "denied"
                            ? "error"
                            : "warning"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {req.status === "pending" && (
                      <Box className="flex gap-1 justify-end">
                        <Button
                          size="small"
                          color="success"
                          variant="outlined"
                          onClick={() =>
                            handleReviewTimeOff(req.id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleReviewTimeOff(req.id, "denied")}
                        >
                          Deny
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {timeOff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No time-off requests
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProfile ? "Edit Staff Profile" : "Create Staff Profile"}
        </DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          {!editingProfile && (
            <TextField
              select
              label="User"
              fullWidth
              margin="normal"
              value={form.user_uuid}
              onChange={(e) =>
                setForm((f) => ({ ...f, user_uuid: e.target.value }))
              }
            >
              {unprofiledUsers.map((u) => (
                <MenuItem key={u.uuid} value={u.uuid}>
                  {u.first_name} {u.last_name} ({u.email})
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            select
            label="Position"
            fullWidth
            margin="normal"
            value={form.position_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, position_id: e.target.value }))
            }
          >
            <MenuItem value="">None</MenuItem>
            {positions.map((pos) => (
              <MenuItem key={pos.id} value={pos.id}>
                {pos.name}
              </MenuItem>
            ))}
          </TextField>

          <Box className="mt-4">
            <Typography gutterBottom>Priority: {form.priority}</Typography>
            <Slider
              value={form.priority}
              onChange={(_, v) =>
                setForm((f) => ({ ...f, priority: v as number }))
              }
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <TextField
            label="Max Hours/Week"
            type="number"
            fullWidth
            margin="normal"
            value={form.max_hours_per_week}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                max_hours_per_week: parseInt(e.target.value) || 0,
              }))
            }
            slotProps={{ htmlInput: { min: 1, max: 168 } }}
          />

          <TextField
            label="Max Consecutive Days"
            type="number"
            fullWidth
            margin="normal"
            value={form.max_consecutive_days}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                max_consecutive_days: parseInt(e.target.value) || 0,
              }))
            }
            slotProps={{ htmlInput: { min: 1, max: 14 } }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.is_active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingProfile ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite User Modal */}
      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={inviteForm.email}
            onChange={(e) => {
              const email = e.target.value
              setInviteForm((f) => ({
                ...f,
                email,
                user_name: f.user_name || "",
              }))
            }}
            onBlur={() => {
              if (inviteForm.email && !inviteForm.user_name) {
                setInviteForm((f) => ({
                  ...f,
                  user_name: f.email.split("@")[0],
                }))
              }
            }}
          />
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            required
            value={inviteForm.first_name}
            onChange={(e) =>
              setInviteForm((f) => ({ ...f, first_name: e.target.value }))
            }
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            required
            value={inviteForm.last_name}
            onChange={(e) =>
              setInviteForm((f) => ({ ...f, last_name: e.target.value }))
            }
          />
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            required
            value={inviteForm.user_name}
            onChange={(e) =>
              setInviteForm((f) => ({ ...f, user_name: e.target.value }))
            }
            helperText="Auto-filled from email, but can be changed"
          />
          <TextField
            select
            label="Role"
            fullWidth
            margin="normal"
            required
            value={inviteForm.role}
            onChange={(e) =>
              setInviteForm((f) => ({ ...f, role: e.target.value }))
            }
          >
            {roles.map((r) => (
              <MenuItem key={r.code} value={r.code}>
                {r.description}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Phone (optional)"
            fullWidth
            margin="normal"
            value={inviteForm.phone}
            onChange={(e) =>
              setInviteForm((f) => ({ ...f, phone: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleInvite}
            disabled={inviting}
          >
            {inviting ? "Sending…" : "Send Invite"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
