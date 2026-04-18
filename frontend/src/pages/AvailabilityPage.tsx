import { useEffect, useState } from "react"
import {
  Paper,
  Typography,
  Box,
  Switch,
  Button,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import AddIcon from "@mui/icons-material/Add"
import { toast } from "react-toastify"
import {
  getMyStaffProfile,
  getAvailability,
  setAvailability,
  getTimeOffByStaffProfile,
  createTimeOffRequest,
} from "../utils/schedulingApi"
import type {
  Availability,
  StaffProfile,
  TimeOffRequest,
} from "../types/Scheduling"

const DAYS = [
  { idx: 0, label: "Sunday" },
  { idx: 1, label: "Monday" },
  { idx: 2, label: "Tuesday" },
  { idx: 3, label: "Wednesday" },
  { idx: 4, label: "Thursday" },
  { idx: 5, label: "Friday" },
  { idx: 6, label: "Saturday" },
]

const STATUS_COLORS: Record<string, "warning" | "success" | "error"> = {
  pending: "warning",
  approved: "success",
  denied: "error",
}

export default function AvailabilityPage() {
  const [profile, setProfile] = useState<StaffProfile | null>(null)
  const [availability, setAvailabilityState] = useState<
    Record<number, boolean>
  >({})
  const [timeOffs, setTimeOffs] = useState<TimeOffRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Time-off form
  const [showForm, setShowForm] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const prof = await getMyStaffProfile()
      setProfile(prof)
      if (prof) {
        const avail = await getAvailability(prof.id)
        const map: Record<number, boolean> = {}
        for (const day of DAYS) {
          const entry = avail.find((a) => a.day_of_week === day.idx)
          map[day.idx] = entry ? entry.is_available : true
        }
        setAvailabilityState(map)

        const tors = await getTimeOffByStaffProfile(prof.id)
        setTimeOffs(tors)
      }
    } catch {
      setError("Failed to load availability data")
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveAvailability() {
    if (!profile) return
    setSaving(true)
    try {
      const entries = DAYS.map((d) => ({
        day_of_week: d.idx,
        is_available: availability[d.idx] ?? true,
      }))
      await setAvailability(profile.id, entries)
      toast.success("Availability saved")
    } catch {
      toast.error("Failed to save availability")
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmitTimeOff() {
    if (!profile || !startDate || !endDate) return
    if (endDate < startDate) {
      toast.error("End date must be after start date")
      return
    }
    setSubmitting(true)
    try {
      await createTimeOffRequest({
        staff_profile_id: profile.id,
        start_date: startDate,
        end_date: endDate,
        reason: reason || undefined,
      })
      toast.success("Time-off request submitted")
      setShowForm(false)
      setStartDate("")
      setEndDate("")
      setReason("")
      const tors = await getTimeOffByStaffProfile(profile.id)
      setTimeOffs(tors)
    } catch {
      toast.error("Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  if (!profile) {
    return (
      <div>
        <Typography variant="h5" className="font-bold mb-4 text-lg sm:text-2xl">
          Availability
        </Typography>
        <Alert severity="info">
          Your staff profile has not been set up yet. Please contact your
          manager.
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <Box className="flex items-center gap-2 mb-4 sm:mb-6">
        <EventAvailableIcon color="primary" fontSize="large" />
        <Typography variant="h5" className="font-bold text-lg sm:text-2xl">
          Availability
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Weekly Availability Grid */}
      <Paper elevation={1} className="p-6 mb-6">
        <Typography variant="h6" className="font-semibold mb-4">
          Weekly Availability
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          Toggle the days you are available to work. This is your recurring
          weekly schedule.
        </Typography>
        <Box className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {DAYS.map((day) => (
            <Paper
              key={day.idx}
              variant="outlined"
              className={`p-4 text-center transition-colors ${
                availability[day.idx]
                  ? "bg-green-50 border-green-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              <Typography variant="subtitle2" className="font-semibold mb-2">
                {day.label}
              </Typography>
              <Switch
                checked={availability[day.idx] ?? true}
                onChange={(_, checked) =>
                  setAvailabilityState((prev) => ({
                    ...prev,
                    [day.idx]: checked,
                  }))
                }
                color="success"
              />
              <Typography
                variant="caption"
                className={`block ${
                  availability[day.idx] ? "text-green-700" : "text-red-700"
                }`}
              >
                {availability[day.idx] ? "Available" : "Unavailable"}
              </Typography>
            </Paper>
          ))}
        </Box>
        <Box className="mt-4 flex justify-end">
          <Button
            variant="contained"
            onClick={handleSaveAvailability}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Availability"}
          </Button>
        </Box>
      </Paper>

      {/* Time Off Requests */}
      <Paper elevation={1} className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-semibold">
            Time Off Requests
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Request Time Off"}
          </Button>
        </Box>

        {showForm && (
          <>
            <Paper variant="outlined" className="p-4 mb-4 bg-gray-50">
              <Box className="flex flex-wrap gap-4 items-end">
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  size="small"
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  size="small"
                />
                <TextField
                  label="Reason (optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  size="small"
                  className="flex-1"
                />
                <Button
                  variant="contained"
                  onClick={handleSubmitTimeOff}
                  disabled={submitting || !startDate || !endDate}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Paper>
            <Divider className="mb-4" />
          </>
        )}

        {timeOffs.length === 0 ? (
          <Alert severity="info">No time-off requests yet.</Alert>
        ) : (
          <Box className="space-y-2">
            {timeOffs.map((tor) => (
              <Paper
                key={tor.id}
                variant="outlined"
                className="p-3 flex items-center justify-between"
              >
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {new Date(
                      tor.start_date + "T00:00:00",
                    ).toLocaleDateString()}{" "}
                    –{" "}
                    {new Date(tor.end_date + "T00:00:00").toLocaleDateString()}
                  </Typography>
                  {tor.reason && (
                    <Typography variant="caption" color="text.secondary">
                      {tor.reason}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={
                    tor.status.charAt(0).toUpperCase() + tor.status.slice(1)
                  }
                  color={STATUS_COLORS[tor.status]}
                  size="small"
                  variant="outlined"
                />
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </div>
  )
}
