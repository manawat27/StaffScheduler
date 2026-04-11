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
  Collapse,
  IconButton,
} from "@mui/material"
import GroupsIcon from "@mui/icons-material/Groups"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import { toast } from "react-toastify"
import {
  getSchedules,
  getScheduleById,
  getShiftRequests,
  reviewPoolRequest,
  getStaffProfiles,
} from "../../utils/schedulingApi"
import type {
  Schedule,
  ScheduleShift,
  ShiftPoolRequest,
  StaffProfile,
} from "../../types/Scheduling"

function formatTime(time: string) {
  const [h, m] = time.split(":")
  const hour = parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${display}:${m} ${ampm}`
}

export default function ShiftPoolAdminPage() {
  const [poolShifts, setPoolShifts] = useState<ScheduleShift[]>([])
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [requests, setRequests] = useState<Record<string, ShiftPoolRequest[]>>(
    {},
  )
  const [loadingReqs, setLoadingReqs] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [schedules, profiles] = await Promise.all([
        getSchedules(),
        getStaffProfiles(),
      ])
      setStaffProfiles(profiles)

      // Load all schedules, find pool shifts
      const allPoolShifts: ScheduleShift[] = []
      const activeSchedules = schedules.filter(
        (s) => s.status === "draft" || s.status === "published",
      )
      for (const sched of activeSchedules) {
        const detail = await getScheduleById(sched.id)
        const pool = (detail.shifts || []).filter((s) => s.is_in_pool)
        allPoolShifts.push(...pool)
      }
      setPoolShifts(allPoolShifts)
    } catch {
      toast.error("Failed to load shift pool data")
    } finally {
      setLoading(false)
    }
  }

  async function toggleExpand(shiftId: string) {
    if (expanded === shiftId) {
      setExpanded(null)
      return
    }
    setExpanded(shiftId)
    if (!requests[shiftId]) {
      setLoadingReqs(shiftId)
      try {
        const reqs = await getShiftRequests(shiftId)
        setRequests((prev) => ({ ...prev, [shiftId]: reqs }))
      } catch {
        toast.error("Failed to load requests")
      } finally {
        setLoadingReqs(null)
      }
    }
  }

  async function handleReview(
    requestId: string,
    shiftId: string,
    status: "approved" | "denied",
  ) {
    try {
      await reviewPoolRequest(requestId, status)
      toast.success(`Request ${status}`)
      // Refresh requests for this shift
      const reqs = await getShiftRequests(shiftId)
      setRequests((prev) => ({ ...prev, [shiftId]: reqs }))
      // If approved, shift is no longer in pool — remove it
      if (status === "approved") {
        setPoolShifts((prev) => prev.filter((s) => s.id !== shiftId))
        setExpanded(null)
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to review request")
    }
  }

  function getStaffName(profileId?: string) {
    if (!profileId) return "Unknown"
    const p = staffProfiles.find((sp) => sp.id === profileId)
    return p
      ? `${p.position?.name || "No position"} — Priority ${p.priority}`
      : profileId.substring(0, 8)
  }

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className="p-6">
      <Box className="flex items-center gap-2 mb-6">
        <GroupsIcon color="primary" fontSize="large" />
        <Typography variant="h4" className="font-bold">
          Shift Pool Management
        </Typography>
      </Box>

      {poolShifts.length === 0 ? (
        <Alert severity="info">
          No shifts currently in the pool. Open shifts appear here when the
          auto-scheduler can't fill them or when you manually mark shifts as
          pooled.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Shift</strong>
                </TableCell>
                <TableCell>
                  <strong>Position</strong>
                </TableCell>
                <TableCell>
                  <strong>Time</strong>
                </TableCell>
                <TableCell>
                  <strong>Requests</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poolShifts.map((shift) => (
                <>
                  <TableRow key={shift.id}>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleExpand(shift.id)}
                      >
                        {expanded === shift.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {new Date(shift.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{shift.position?.name}</TableCell>
                    <TableCell>
                      {formatTime(shift.shift_type?.start_time || "")} –{" "}
                      {formatTime(shift.shift_type?.end_time || "")}
                    </TableCell>
                    <TableCell>{requests[shift.id]?.length ?? "—"}</TableCell>
                  </TableRow>
                  <TableRow key={`${shift.id}-detail`}>
                    <TableCell
                      colSpan={6}
                      sx={{
                        py: 0,
                        borderBottom:
                          expanded === shift.id ? undefined : "none",
                      }}
                    >
                      <Collapse in={expanded === shift.id}>
                        <Box className="py-3 px-4">
                          {loadingReqs === shift.id ? (
                            <CircularProgress size={20} />
                          ) : (requests[shift.id] || []).length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              No requests for this shift yet.
                            </Typography>
                          ) : (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Staff</TableCell>
                                  <TableCell>Priority</TableCell>
                                  <TableCell>Requested</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell align="right">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(requests[shift.id] || [])
                                  .sort(
                                    (a, b) =>
                                      (b.staff_profile?.priority || 0) -
                                      (a.staff_profile?.priority || 0),
                                  )
                                  .map((req) => (
                                    <TableRow key={req.id}>
                                      <TableCell>
                                        {getStaffName(req.staff_profile_id)}
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={
                                            req.staff_profile?.priority || "?"
                                          }
                                          size="small"
                                          color={
                                            (req.staff_profile?.priority ||
                                              0) >= 7
                                              ? "success"
                                              : "default"
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {new Date(
                                          req.requested_at,
                                        ).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={
                                            req.status.charAt(0).toUpperCase() +
                                            req.status.slice(1)
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
                                                handleReview(
                                                  req.id,
                                                  shift.id,
                                                  "approved",
                                                )
                                              }
                                            >
                                              Approve
                                            </Button>
                                            <Button
                                              size="small"
                                              color="error"
                                              variant="outlined"
                                              onClick={() =>
                                                handleReview(
                                                  req.id,
                                                  shift.id,
                                                  "denied",
                                                )
                                              }
                                            >
                                              Deny
                                            </Button>
                                          </Box>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}
