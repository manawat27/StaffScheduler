import { useEffect, useState } from "react"
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material"
import GroupsIcon from "@mui/icons-material/Groups"
import { toast } from "react-toastify"
import {
  getOpenPoolShifts,
  getMyPoolRequests,
  requestPoolShift,
} from "../utils/schedulingApi"
import type { ScheduleShift, ShiftPoolRequest } from "../types/Scheduling"

function formatTime(time: string) {
  const [h, m] = time.split(":")
  const hour = parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${display}:${m} ${ampm}`
}

const REQUEST_STATUS_COLORS: Record<string, "warning" | "success" | "error"> = {
  pending: "warning",
  approved: "success",
  denied: "error",
}

export default function ShiftPoolPage() {
  const [openShifts, setOpenShifts] = useState<ScheduleShift[]>([])
  const [myRequests, setMyRequests] = useState<ShiftPoolRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [requesting, setRequesting] = useState<string | null>(null)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [shifts, requests] = await Promise.all([
        getOpenPoolShifts(),
        getMyPoolRequests(),
      ])
      setOpenShifts(shifts)
      setMyRequests(requests)
    } catch {
      setError("Failed to load shift pool data")
    } finally {
      setLoading(false)
    }
  }

  async function handleRequest(shiftId: string) {
    setRequesting(shiftId)
    try {
      await requestPoolShift(shiftId)
      toast.success("Shift requested! Your manager will review it.")
      await loadData()
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to request shift"
      toast.error(msg)
    } finally {
      setRequesting(null)
    }
  }

  // Check if user already requested a shift
  const requestedShiftIds = new Set(myRequests.map((r) => r.schedule_shift_id))

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div>
      <Box className="flex items-center gap-2 mb-4 sm:mb-6">
        <GroupsIcon color="primary" fontSize="large" />
        <Typography variant="h5" className="font-bold text-lg sm:text-2xl">
          Shift Pool
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} className="mb-4">
        <Tab label={`Open Shifts (${openShifts.length})`} />
        <Tab label={`My Requests (${myRequests.length})`} />
      </Tabs>

      {/* Tab 0: Open Shifts */}
      {tab === 0 && (
        <>
          {openShifts.length === 0 ? (
            <Alert severity="info">
              No open shifts available for your position right now.
            </Alert>
          ) : (
            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openShifts.map((shift) => {
                const alreadyRequested = requestedShiftIds.has(shift.id)
                return (
                  <Paper
                    key={shift.id}
                    elevation={2}
                    className="p-4 flex flex-col justify-between"
                  >
                    <Box>
                      <Box className="flex items-center justify-between mb-2">
                        <Typography variant="subtitle1" className="font-bold">
                          {shift.shift_type?.name}
                        </Typography>
                        <Chip
                          label={shift.position?.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(shift.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="mt-1"
                      >
                        {formatTime(shift.shift_type?.start_time || "")} –{" "}
                        {formatTime(shift.shift_type?.end_time || "")}
                      </Typography>
                    </Box>
                    <Box className="mt-3">
                      {alreadyRequested ? (
                        <Chip
                          label="Already Requested"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          disabled={requesting === shift.id}
                          onClick={() => handleRequest(shift.id)}
                        >
                          {requesting === shift.id
                            ? "Requesting..."
                            : "Request This Shift"}
                        </Button>
                      )}
                    </Box>
                  </Paper>
                )
              })}
            </Box>
          )}
        </>
      )}

      {/* Tab 1: My Requests */}
      {tab === 1 && (
        <>
          {myRequests.length === 0 ? (
            <Alert severity="info">You haven't requested any shifts yet.</Alert>
          ) : (
            <Box className="space-y-2">
              {myRequests.map((req) => (
                <Paper
                  key={req.id}
                  variant="outlined"
                  className="p-4 flex items-center justify-between"
                >
                  <Box>
                    <Typography variant="subtitle2" className="font-medium">
                      {req.schedule_shift?.shift_type?.name} –{" "}
                      {req.schedule_shift?.position?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {req.schedule_shift?.date &&
                        new Date(
                          req.schedule_shift.date + "T00:00:00",
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Requested{" "}
                      {new Date(req.requested_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      req.status.charAt(0).toUpperCase() + req.status.slice(1)
                    }
                    color={REQUEST_STATUS_COLORS[req.status]}
                    size="small"
                    variant="outlined"
                  />
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}
    </div>
  )
}
