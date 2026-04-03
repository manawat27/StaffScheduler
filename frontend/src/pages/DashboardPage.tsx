import { useEffect, useState } from "react"
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import GroupsIcon from "@mui/icons-material/Groups"
import EventBusyIcon from "@mui/icons-material/EventBusy"
import {
  getMyShifts,
  getOpenPoolShifts,
  getMyTimeOffRequests,
} from "../utils/schedulingApi"
import type {
  ScheduleShift,
  ShiftPoolRequest,
  TimeOffRequest,
} from "../types/Scheduling"

function formatTime(time: string) {
  const [h, m] = time.split(":")
  const hour = parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${display}:${m} ${ampm}`
}

export default function DashboardPage() {
  const [upcomingShifts, setUpcomingShifts] = useState<ScheduleShift[]>([])
  const [openPoolCount, setOpenPoolCount] = useState(0)
  const [pendingTimeOff, setPendingTimeOff] = useState<TimeOffRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [shifts, pool, timeOff] = await Promise.all([
          getMyShifts().catch(() => []),
          getOpenPoolShifts().catch(() => []),
          getMyTimeOffRequests().catch(() => []),
        ])
        // Show shifts for the next 7 days
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const nextWeek = new Date(today)
        nextWeek.setDate(nextWeek.getDate() + 7)
        const upcoming = (shifts as ScheduleShift[])
          .filter((s) => {
            const d = new Date(s.date + "T00:00:00")
            return d >= today && d <= nextWeek
          })
          .sort((a, b) => a.date.localeCompare(b.date))
        setUpcomingShifts(upcoming)
        setOpenPoolCount((pool as ScheduleShift[]).length)
        setPendingTimeOff(
          (timeOff as TimeOffRequest[]).filter((t) => t.status === "pending"),
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className="p-6">
      <Typography variant="h4" className="font-bold mb-6">
        Dashboard
      </Typography>

      {/* Summary cards */}
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Paper className="p-4 flex items-center gap-3" elevation={2}>
          <CalendarMonthIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h5" className="font-bold">
              {upcomingShifts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shifts this week
            </Typography>
          </Box>
        </Paper>
        <Paper className="p-4 flex items-center gap-3" elevation={2}>
          <GroupsIcon color="secondary" fontSize="large" />
          <Box>
            <Typography variant="h5" className="font-bold">
              {openPoolCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Open pool shifts
            </Typography>
          </Box>
        </Paper>
        <Paper className="p-4 flex items-center gap-3" elevation={2}>
          <EventBusyIcon color="warning" fontSize="large" />
          <Box>
            <Typography variant="h5" className="font-bold">
              {pendingTimeOff.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending time-off requests
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Upcoming shifts list */}
      <Typography variant="h6" className="mb-3 font-semibold">
        Upcoming Shifts
      </Typography>
      {upcomingShifts.length === 0 ? (
        <Alert severity="info" className="mb-4">
          No shifts scheduled for the next 7 days.
        </Alert>
      ) : (
        <Box className="space-y-2 mb-4">
          {upcomingShifts.map((shift) => (
            <Paper
              key={shift.id}
              variant="outlined"
              className="p-3 flex items-center justify-between"
            >
              <Box>
                <Typography variant="subtitle2" className="font-medium">
                  {new Date(shift.date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { weekday: "long", month: "short", day: "numeric" },
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(shift.shift_type?.start_time || "")} –{" "}
                  {formatTime(shift.shift_type?.end_time || "")}
                </Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Chip
                  label={shift.shift_type?.name}
                  size="small"
                  sx={{
                    backgroundColor:
                      shift.shift_type?.name === "Morning"
                        ? "#FFF3E0"
                        : "#E3F2FD",
                  }}
                />
                <Chip
                  label={shift.position?.name}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Pending time off */}
      {pendingTimeOff.length > 0 && (
        <>
          <Typography variant="h6" className="mb-3 font-semibold">
            Pending Time-Off Requests
          </Typography>
          <Box className="space-y-2">
            {pendingTimeOff.map((req) => (
              <Paper
                key={req.id}
                variant="outlined"
                className="p-3 flex items-center justify-between"
              >
                <Typography variant="body2">
                  {new Date(req.start_date + "T00:00:00").toLocaleDateString()}{" "}
                  – {new Date(req.end_date + "T00:00:00").toLocaleDateString()}
                  {req.reason && ` • ${req.reason}`}
                </Typography>
                <Chip
                  label="Pending"
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              </Paper>
            ))}
          </Box>
        </>
      )}
    </div>
  )
}
