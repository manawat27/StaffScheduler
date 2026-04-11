import { useEffect, useState, useMemo } from "react"
import {
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import AddIcon from "@mui/icons-material/Add"
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"
import PublishIcon from "@mui/icons-material/Publish"
import ArchiveIcon from "@mui/icons-material/Archive"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { toast } from "react-toastify"
import {
  getSchedules,
  getScheduleById,
  createSchedule,
  publishSchedule,
  archiveSchedule,
  autoGenerateSchedule,
  addShift,
  assignShift,
  getStaffProfiles,
  getActiveShiftTypes,
  getActivePositions,
  getStaffingRequirements,
  createStaffingRequirement,
  updateStaffingRequirement,
  deleteStaffingRequirement,
} from "../../utils/schedulingApi"
import type {
  Schedule,
  ScheduleShift,
  StaffProfile,
  ShiftType,
  Position,
  StaffingRequirement,
} from "../../types/Scheduling"

function formatTime(time: string) {
  const [h, m] = time.split(":")
  const hour = parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${display}:${m} ${ampm}`
}

export default function ScheduleBuilderPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [selected, setSelected] = useState<Schedule | null>(null)
  const [shifts, setShifts] = useState<ScheduleShift[]>([])
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([])
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [staffingReqs, setStaffingReqs] = useState<StaffingRequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Create schedule dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newStart, setNewStart] = useState("")

  // Assign staff dialog
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignShiftId, setAssignShiftId] = useState("")
  const [assignStaffId, setAssignStaffId] = useState("")

  // Staffing requirements dialog
  const [reqsOpen, setReqsOpen] = useState(false)
  const [newReqShiftType, setNewReqShiftType] = useState("")
  const [newReqPosition, setNewReqPosition] = useState("")
  const [newReqCount, setNewReqCount] = useState(1)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    try {
      const [s, sp, st, pos, sr] = await Promise.all([
        getSchedules(),
        getStaffProfiles(),
        getActiveShiftTypes(),
        getActivePositions(),
        getStaffingRequirements(),
      ])
      setSchedules(s)
      setStaffProfiles(sp)
      setShiftTypes(st)
      setPositions(pos)
      setStaffingReqs(sr)
    } catch {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  async function selectSchedule(sched: Schedule) {
    try {
      const detail = await getScheduleById(sched.id)
      setSelected(detail)
      setShifts(detail.shifts || [])
    } catch {
      toast.error("Failed to load schedule details")
    }
  }

  async function handleCreate() {
    if (!newName || !newStart) {
      toast.error("Name and start date are required")
      return
    }
    const start = new Date(newStart + "T00:00:00")
    const end = new Date(start)
    end.setDate(end.getDate() + 13) // bi-weekly
    try {
      const sched = await createSchedule({
        name: newName,
        start_date: newStart,
        end_date: end.toISOString().split("T")[0],
      })
      toast.success("Schedule created")
      setCreateOpen(false)
      setNewName("")
      setNewStart("")
      setSchedules((prev) => [...prev, sched])
      await selectSchedule(sched)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create schedule")
    }
  }

  async function handleAutoGenerate() {
    if (!selected) return
    setGenerating(true)
    try {
      await autoGenerateSchedule(selected.id)
      toast.success("Schedule auto-generated!")
      await selectSchedule(selected)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Auto-generation failed")
    } finally {
      setGenerating(false)
    }
  }

  async function handlePublish() {
    if (!selected) return
    try {
      await publishSchedule(selected.id)
      toast.success("Schedule published!")
      setSelected((s) => (s ? { ...s, status: "published" } : s))
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === selected.id ? { ...s, status: "published" } : s,
        ),
      )
    } catch {
      toast.error("Failed to publish")
    }
  }

  async function handleArchive() {
    if (!selected) return
    try {
      await archiveSchedule(selected.id)
      toast.success("Schedule archived")
      setSelected((s) => (s ? { ...s, status: "archived" } : s))
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === selected.id ? { ...s, status: "archived" } : s,
        ),
      )
    } catch {
      toast.error("Failed to archive")
    }
  }

  function openAssign(shift: ScheduleShift) {
    setAssignShiftId(shift.id)
    setAssignStaffId(shift.staff_profile_id || "")
    setAssignOpen(true)
  }

  async function handleAssign() {
    try {
      await assignShift(assignShiftId, assignStaffId || null)
      toast.success(assignStaffId ? "Staff assigned" : "Staff unassigned")
      setAssignOpen(false)
      if (selected) await selectSchedule(selected)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to assign")
    }
  }

  async function handleAddReq() {
    if (!newReqShiftType || !newReqPosition || newReqCount < 1) return
    try {
      const req = await createStaffingRequirement({
        shift_type_id: newReqShiftType,
        position_id: newReqPosition,
        required_count: newReqCount,
      })
      setStaffingReqs((prev) => [...prev, req])
      setNewReqShiftType("")
      setNewReqPosition("")
      setNewReqCount(1)
      toast.success("Requirement added")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add requirement")
    }
  }

  async function handleDeleteReq(id: string) {
    try {
      await deleteStaffingRequirement(id)
      setStaffingReqs((prev) => prev.filter((r) => r.id !== id))
      toast.success("Requirement removed")
    } catch {
      toast.error("Failed to remove requirement")
    }
  }

  // Build grid data: dates as columns, shift-type+position as rows
  const gridDates = useMemo(() => {
    if (!selected) return []
    const dates: string[] = []
    const start = new Date(selected.start_date + "T00:00:00")
    const end = new Date(selected.end_date + "T00:00:00")
    const cur = new Date(start)
    while (cur <= end) {
      dates.push(cur.toISOString().split("T")[0])
      cur.setDate(cur.getDate() + 1)
    }
    return dates
  }, [selected])

  // Group shifts by date
  const shiftsByDate = useMemo(() => {
    const map: Record<string, ScheduleShift[]> = {}
    for (const s of shifts) {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s)
    }
    return map
  }, [shifts])

  function getStaffName(profileId?: string) {
    if (!profileId) return "Unassigned"
    const p = staffProfiles.find((sp) => sp.id === profileId)
    return p
      ? `Staff ${p.user_uuid.substring(0, 8)}`
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
    <div>
      <Box className="flex items-center gap-2 mb-4 sm:mb-6">
        <CalendarMonthIcon color="primary" fontSize="large" />
        <Typography variant="h5" className="font-bold text-lg sm:text-2xl">
          Schedule Builder
        </Typography>
      </Box>

      {/* Schedule list + create */}
      <Box className="flex gap-2 mb-4 flex-wrap items-center">
        {schedules.map((s) => (
          <Chip
            key={s.id}
            label={`${s.name} (${s.status})`}
            onClick={() => selectSchedule(s)}
            color={selected?.id === s.id ? "primary" : "default"}
            variant={selected?.id === s.id ? "filled" : "outlined"}
          />
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => setCreateOpen(true)}
        >
          New Schedule
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setReqsOpen(true)}
        >
          Staffing Requirements
        </Button>
      </Box>

      {/* Selected schedule actions */}
      {selected && (
        <>
          <Paper className="p-4 mb-4" elevation={1}>
            <Box className="flex items-center justify-between flex-wrap gap-2">
              <Box>
                <Typography variant="h6">{selected.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(
                    selected.start_date + "T00:00:00",
                  ).toLocaleDateString()}{" "}
                  –{" "}
                  {new Date(
                    selected.end_date + "T00:00:00",
                  ).toLocaleDateString()}{" "}
                  •{" "}
                  <Chip
                    label={selected.status}
                    size="small"
                    color={
                      selected.status === "published"
                        ? "success"
                        : selected.status === "draft"
                          ? "warning"
                          : "default"
                    }
                    variant="outlined"
                  />
                </Typography>
              </Box>
              <Box className="flex gap-2">
                {selected.status === "draft" && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={
                        generating ? (
                          <CircularProgress size={16} />
                        ) : (
                          <AutoFixHighIcon />
                        )
                      }
                      onClick={handleAutoGenerate}
                      disabled={generating}
                    >
                      {generating ? "Generating..." : "Auto-Generate"}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<PublishIcon />}
                      onClick={handlePublish}
                    >
                      Publish
                    </Button>
                  </>
                )}
                {selected.status === "published" && (
                  <Button
                    variant="outlined"
                    startIcon={<ArchiveIcon />}
                    onClick={handleArchive}
                  >
                    Archive
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Shift grid */}
          {shifts.length === 0 ? (
            <Alert severity="info">
              No shifts yet. Click "Auto-Generate" to populate based on staffing
              requirements.
            </Alert>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ maxHeight: "60vh", overflow: "auto" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 100 }}>
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
                      <strong>Assigned To</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Pool</strong>
                    </TableCell>
                    {selected.status === "draft" && (
                      <TableCell align="right">
                        <strong>Actions</strong>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gridDates.map((date) => {
                    const dayShifts = shiftsByDate[date] || []
                    if (dayShifts.length === 0) return null
                    return dayShifts.map((shift, idx) => (
                      <TableRow
                        key={shift.id}
                        sx={{
                          backgroundColor:
                            new Date(date + "T00:00:00").getDay() === 0 ||
                            new Date(date + "T00:00:00").getDay() === 6
                              ? "#f5f5f5"
                              : undefined,
                        }}
                      >
                        {idx === 0 && (
                          <TableCell rowSpan={dayShifts.length}>
                            <Typography variant="body2" className="font-medium">
                              {new Date(date + "T00:00:00").toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </Typography>
                          </TableCell>
                        )}
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
                          <Typography variant="caption">
                            {formatTime(shift.shift_type?.start_time || "")} –{" "}
                            {formatTime(shift.shift_type?.end_time || "")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {shift.staff_profile_id ? (
                            <Chip
                              label={getStaffName(shift.staff_profile_id)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Unassigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {shift.is_in_pool && (
                            <Chip
                              label="In Pool"
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        {selected.status === "draft" && (
                          <TableCell align="right">
                            <Tooltip title="Assign/Unassign Staff">
                              <IconButton
                                size="small"
                                onClick={() => openAssign(shift)}
                              >
                                {shift.staff_profile_id ? (
                                  <PersonRemoveIcon fontSize="small" />
                                ) : (
                                  <PersonAddIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {!selected && schedules.length > 0 && (
        <Alert severity="info">Select a schedule above to view details.</Alert>
      )}

      {/* Create Schedule Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Schedule</DialogTitle>
        <DialogContent>
          <TextField
            label="Schedule Name"
            fullWidth
            margin="normal"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Week of Apr 7"
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            value={newStart}
            onChange={(e) => setNewStart(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText="End date is auto-calculated (14 days)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Staff Dialog */}
      <Dialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Staff to Shift</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Staff Member"
            fullWidth
            margin="normal"
            value={assignStaffId}
            onChange={(e) => setAssignStaffId(e.target.value)}
          >
            <MenuItem value="">Unassign</MenuItem>
            {staffProfiles
              .filter((sp) => sp.is_active)
              .map((sp) => (
                <MenuItem key={sp.id} value={sp.id}>
                  {sp.position?.name || "No position"} — Priority {sp.priority}{" "}
                  ({sp.user_uuid.substring(0, 8)})
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign}>
            {assignStaffId ? "Assign" : "Unassign"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Staffing Requirements Dialog */}
      <Dialog
        open={reqsOpen}
        onClose={() => setReqsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Staffing Requirements</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" className="mb-3">
            Define how many staff of each position are needed per shift type.
            Auto-generate uses these requirements.
          </Typography>

          <TableContainer component={Paper} variant="outlined" className="mb-4">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Shift Type</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Required Count</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffingReqs.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      {req.shift_type?.name ||
                        shiftTypes.find((s) => s.id === req.shift_type_id)
                          ?.name}
                    </TableCell>
                    <TableCell>
                      {req.position?.name ||
                        positions.find((p) => p.id === req.position_id)?.name}
                    </TableCell>
                    <TableCell>{req.required_count}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteReq(req.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {staffingReqs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No requirements configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="flex gap-2 items-end">
            <TextField
              select
              label="Shift Type"
              size="small"
              value={newReqShiftType}
              onChange={(e) => setNewReqShiftType(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {shiftTypes.map((st) => (
                <MenuItem key={st.id} value={st.id}>
                  {st.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Position"
              size="small"
              value={newReqPosition}
              onChange={(e) => setNewReqPosition(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {positions.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Count"
              type="number"
              size="small"
              value={newReqCount}
              onChange={(e) => setNewReqCount(parseInt(e.target.value) || 1)}
              slotProps={{ htmlInput: { min: 1 } }}
              sx={{ width: 80 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAddReq}
              disabled={!newReqShiftType || !newReqPosition}
            >
              Add
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReqsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
