import { useEffect, useState } from "react"
import {
  Paper,
  Typography,
  Box,
  Button,
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
  Switch,
  FormControlLabel,
  IconButton,
  Tabs,
  Tab,
  Chip,
} from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { toast } from "react-toastify"
import {
  getShiftTypes,
  createShiftType,
  updateShiftType,
  getPositions,
  createPosition,
  updatePosition,
} from "../../utils/schedulingApi"
import type { ShiftType, Position } from "../../types/Scheduling"

export default function SettingsPage() {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  // Shift type modal
  const [stOpen, setStOpen] = useState(false)
  const [editingSt, setEditingSt] = useState<ShiftType | null>(null)
  const [stForm, setStForm] = useState({
    name: "",
    start_time: "06:00",
    end_time: "14:00",
    is_active: true,
  })

  // Position modal
  const [posOpen, setPosOpen] = useState(false)
  const [editingPos, setEditingPos] = useState<Position | null>(null)
  const [posForm, setPosForm] = useState({
    name: "",
    description: "",
    is_active: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [st, pos] = await Promise.all([getShiftTypes(), getPositions()])
      setShiftTypes(st)
      setPositions(pos)
    } catch {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  // ─── Shift Types ──────────────────────
  function openCreateSt() {
    setEditingSt(null)
    setStForm({
      name: "",
      start_time: "06:00",
      end_time: "14:00",
      is_active: true,
    })
    setStOpen(true)
  }

  function openEditSt(st: ShiftType) {
    setEditingSt(st)
    setStForm({
      name: st.name,
      start_time: st.start_time.substring(0, 5),
      end_time: st.end_time.substring(0, 5),
      is_active: st.is_active,
    })
    setStOpen(true)
  }

  async function handleSaveSt() {
    try {
      if (editingSt) {
        const updated = await updateShiftType(editingSt.id, stForm)
        setShiftTypes((prev) =>
          prev.map((s) => (s.id === editingSt.id ? updated : s)),
        )
        toast.success("Shift type updated")
      } else {
        const created = await createShiftType(stForm)
        setShiftTypes((prev) => [...prev, created])
        toast.success("Shift type created")
      }
      setStOpen(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save shift type")
    }
  }

  // ─── Positions ──────────────────────
  function openCreatePos() {
    setEditingPos(null)
    setPosForm({ name: "", description: "", is_active: true })
    setPosOpen(true)
  }

  function openEditPos(pos: Position) {
    setEditingPos(pos)
    setPosForm({
      name: pos.name,
      description: pos.description || "",
      is_active: pos.is_active,
    })
    setPosOpen(true)
  }

  async function handleSavePos() {
    try {
      if (editingPos) {
        const updated = await updatePosition(editingPos.id, posForm)
        setPositions((prev) =>
          prev.map((p) => (p.id === editingPos.id ? updated : p)),
        )
        toast.success("Position updated")
      } else {
        const created = await createPosition(posForm)
        setPositions((prev) => [...prev, created])
        toast.success("Position created")
      }
      setPosOpen(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save position")
    }
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
        <SettingsIcon color="primary" fontSize="large" />
        <Typography variant="h4" className="font-bold">
          Settings
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} className="mb-4">
        <Tab label={`Shift Types (${shiftTypes.length})`} />
        <Tab label={`Positions (${positions.length})`} />
      </Tabs>

      {/* Tab 0: Shift Types */}
      {tab === 0 && (
        <>
          <Box className="flex justify-end mb-3">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateSt}
            >
              New Shift Type
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
                    <strong>Start Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>End Time</strong>
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
                {shiftTypes.map((st) => (
                  <TableRow key={st.id}>
                    <TableCell>{st.name}</TableCell>
                    <TableCell>{st.start_time.substring(0, 5)}</TableCell>
                    <TableCell>{st.end_time.substring(0, 5)}</TableCell>
                    <TableCell>
                      <Chip
                        label={st.is_active ? "Active" : "Inactive"}
                        size="small"
                        color={st.is_active ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEditSt(st)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {shiftTypes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No shift types configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Tab 1: Positions */}
      {tab === 1 && (
        <>
          <Box className="flex justify-end mb-3">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreatePos}
            >
              New Position
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
                    <strong>Description</strong>
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
                {positions.map((pos) => (
                  <TableRow key={pos.id}>
                    <TableCell>{pos.name}</TableCell>
                    <TableCell>{pos.description || "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={pos.is_active ? "Active" : "Inactive"}
                        size="small"
                        color={pos.is_active ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEditPos(pos)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {positions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No positions configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Shift Type Modal */}
      <Dialog
        open={stOpen}
        onClose={() => setStOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSt ? "Edit Shift Type" : "Create Shift Type"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={stForm.name}
            onChange={(e) => setStForm((f) => ({ ...f, name: e.target.value }))}
          />
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            margin="normal"
            value={stForm.start_time}
            onChange={(e) =>
              setStForm((f) => ({ ...f, start_time: e.target.value }))
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="End Time"
            type="time"
            fullWidth
            margin="normal"
            value={stForm.end_time}
            onChange={(e) =>
              setStForm((f) => ({ ...f, end_time: e.target.value }))
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={stForm.is_active}
                onChange={(e) =>
                  setStForm((f) => ({ ...f, is_active: e.target.checked }))
                }
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSt}>
            {editingSt ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Position Modal */}
      <Dialog
        open={posOpen}
        onClose={() => setPosOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPos ? "Edit Position" : "Create Position"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={posForm.name}
            onChange={(e) =>
              setPosForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={posForm.description}
            onChange={(e) =>
              setPosForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={posForm.is_active}
                onChange={(e) =>
                  setPosForm((f) => ({
                    ...f,
                    is_active: e.target.checked,
                  }))
                }
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPosOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePos}>
            {editingPos ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
