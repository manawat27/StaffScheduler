import { useEffect, useState } from "react"
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { getPublishedSchedules, getScheduleById } from "../utils/schedulingApi"
import type { Schedule, ScheduleShift } from "../types/Scheduling"
import KeycloakService from "../auth/keycloakService"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const SHIFT_COLORS: Record<string, string> = {
  Morning: "#FFF3E0",
  Evening: "#E3F2FD",
}

function formatTime(time: string) {
  const [h, m] = time.split(":")
  const hour = parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${display}:${m} ${ampm}`
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = []
  const d = new Date(start + "T00:00:00")
  const endDate = new Date(end + "T00:00:00")
  while (d <= endDate) {
    dates.push(d.toISOString().split("T")[0])
    d.setDate(d.getDate() + 1)
  }
  return dates
}

function splitIntoWeeks(dates: string[]): string[][] {
  const weeks: string[][] = []
  let current: string[] = []
  for (const date of dates) {
    const day = new Date(date + "T00:00:00").getDay()
    if (day === 0 && current.length > 0) {
      weeks.push(current)
      current = []
    }
    current.push(date)
  }
  if (current.length > 0) weeks.push(current)
  return weeks
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [selected, setSelected] = useState<Schedule | null>(null)
  const [shifts, setShifts] = useState<ScheduleShift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [scheduleIdx, setScheduleIdx] = useState(0)

  const userUuid = KeycloakService.getUserId()

  useEffect(() => {
    getPublishedSchedules()
      .then((data) => {
        setSchedules(data)
        if (data.length > 0) {
          setScheduleIdx(0)
        }
      })
      .catch(() => setError("Failed to load schedules"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (schedules.length > 0 && scheduleIdx >= 0) {
      const sched = schedules[scheduleIdx]
      setSelected(sched)
      getScheduleById(sched.id)
        .then((full) => setShifts(full.shifts || []))
        .catch(() => setError("Failed to load schedule details"))
    }
  }, [scheduleIdx, schedules])

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  if (!selected) {
    return (
      <div>
        <Typography variant="h5" className="font-bold mb-4 text-lg sm:text-2xl">
          My Schedule
        </Typography>
        <Alert severity="info">No published schedules available yet.</Alert>
      </div>
    )
  }

  const dates = getDatesInRange(selected.start_date, selected.end_date)
  const weeks = splitIntoWeeks(dates)

  // Get my shifts
  const myShifts = shifts.filter((s) => s.staff_profile?.user_uuid === userUuid)
  const myShiftsByDate = new Map<string, ScheduleShift[]>()
  for (const s of myShifts) {
    const arr = myShiftsByDate.get(s.date) || []
    arr.push(s)
    myShiftsByDate.set(s.date, arr)
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div>
      <Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <Box className="flex items-center gap-2">
          <CalendarMonthIcon color="primary" fontSize="large" />
          <Typography variant="h5" className="font-bold text-lg sm:text-2xl">
            My Schedule
          </Typography>
        </Box>
        <Box className="flex items-center gap-2">
          <ToggleButton
            value="prev"
            size="small"
            disabled={scheduleIdx >= schedules.length - 1}
            onClick={() => setScheduleIdx((i) => i + 1)}
          >
            <NavigateBeforeIcon />
          </ToggleButton>
          <Chip label={selected.name} color="primary" variant="outlined" />
          <ToggleButton
            value="next"
            size="small"
            disabled={scheduleIdx <= 0}
            onClick={() => setScheduleIdx((i) => i - 1)}
          >
            <NavigateNextIcon />
          </ToggleButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" className="mb-4">
        {new Date(selected.start_date + "T00:00:00").toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
          },
        )}{" "}
        &ndash;{" "}
        {new Date(selected.end_date + "T00:00:00").toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </Typography>

      {weeks.map((week, wi) => (
        <Paper key={wi} elevation={1} className="mb-4 overflow-x-auto">
          <Box className="grid grid-cols-7 min-w-[560px]">
            {DAYS.map((day) => (
              <Box
                key={day}
                className="p-2 text-center font-semibold text-sm bg-gray-100 border-b border-r border-gray-200"
              >
                {day}
              </Box>
            ))}
          </Box>
          <Box
            className="grid grid-cols-7 min-w-[560px]"
            sx={{ minHeight: 120 }}
          >
            {/* Pad start of week */}
            {(() => {
              const firstDay = new Date(week[0] + "T00:00:00").getDay()
              return Array.from({ length: firstDay }).map((_, i) => (
                <Box
                  key={`pad-${i}`}
                  className="border-r border-b border-gray-100 bg-gray-50"
                />
              ))
            })()}
            {week.map((date) => {
              const dayShifts = myShiftsByDate.get(date) || []
              const isToday = date === today
              return (
                <Box
                  key={date}
                  className={`p-2 border-r border-b border-gray-100 min-h-[100px] ${
                    isToday ? "bg-blue-50 ring-2 ring-blue-400 ring-inset" : ""
                  }`}
                >
                  <Typography
                    variant="caption"
                    className={`font-medium ${isToday ? "text-blue-700" : "text-gray-500"}`}
                  >
                    {new Date(date + "T00:00:00").getDate()}
                  </Typography>
                  <Box className="mt-1 space-y-1">
                    {dayShifts.map((shift) => (
                      <Box
                        key={shift.id}
                        className="rounded px-2 py-1 text-xs"
                        sx={{
                          backgroundColor:
                            SHIFT_COLORS[shift.shift_type?.name || ""] ||
                            "#F3E5F5",
                        }}
                      >
                        <Typography
                          variant="caption"
                          className="font-semibold block"
                        >
                          {shift.shift_type?.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-gray-600 block"
                        >
                          {formatTime(shift.shift_type?.start_time || "")} –{" "}
                          {formatTime(shift.shift_type?.end_time || "")}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {shift.position?.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Paper>
      ))}

      {myShifts.length === 0 && (
        <Alert severity="info" className="mt-4">
          You have no shifts assigned in this schedule period.
        </Alert>
      )}
    </div>
  )
}
