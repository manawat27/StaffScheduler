import axios from "axios"
import KeycloakService from "../auth/keycloakService"
import config from "../config"
import type {
  ShiftType,
  Position,
  StaffProfile,
  Availability,
  TimeOffRequest,
  Schedule,
  ScheduleShift,
  ShiftPoolRequest,
  StaffingRequirement,
} from "../types/Scheduling"

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${KeycloakService.getToken()}`,
})

const api = axios.create({
  baseURL: config.API_BASE_URL,
})

api.interceptors.request.use((cfg) => {
  cfg.headers.Authorization = `Bearer ${KeycloakService.getToken()}`
  return cfg
})

// ─── Shift Types ──────────────────────────────────────────

export const getShiftTypes = () =>
  api.get<ShiftType[]>("/shift-types").then((r) => r.data)

export const getActiveShiftTypes = () =>
  api.get<ShiftType[]>("/shift-types/active").then((r) => r.data)

// ─── Positions ────────────────────────────────────────────

export const getPositions = () =>
  api.get<Position[]>("/positions").then((r) => r.data)

export const getActivePositions = () =>
  api.get<Position[]>("/positions/active").then((r) => r.data)

// ─── Staff Profiles ───────────────────────────────────────

export const getStaffProfiles = () =>
  api.get<StaffProfile[]>("/staff-profiles").then((r) => r.data)

export const getMyStaffProfile = () =>
  api.get<StaffProfile>("/staff-profiles/me").then((r) => r.data)

// ─── Availability ─────────────────────────────────────────

export const getAvailability = (staffProfileId: string) =>
  api.get<Availability[]>(`/availability/${staffProfileId}`).then((r) => r.data)

export const setAvailability = (
  staffProfileId: string,
  entries: { day_of_week: number; is_available: boolean }[],
) =>
  api
    .put<Availability[]>(`/availability/${staffProfileId}`, { entries })
    .then((r) => r.data)

// ─── Time Off ─────────────────────────────────────────────

export const getMyTimeOffRequests = (staffProfileId: string) =>
  api
    .get<TimeOffRequest[]>(`/time-off/staff/${staffProfileId}`)
    .then((r) => r.data)

export const createTimeOffRequest = (data: {
  staff_profile_id: string
  start_date: string
  end_date: string
  reason?: string
}) => api.post<TimeOffRequest>("/time-off", data).then((r) => r.data)

// ─── Schedules ────────────────────────────────────────────

export const getPublishedSchedules = () =>
  api.get<Schedule[]>("/schedules/published").then((r) => r.data)

export const getScheduleById = (id: string) =>
  api.get<Schedule>(`/schedules/${id}`).then((r) => r.data)

export const getMyShifts = () =>
  api.get<ScheduleShift[]>("/schedules/staff/me").then((r) => r.data)

// ─── Shift Pool ───────────────────────────────────────────

export const getOpenPoolShifts = () =>
  api.get<ScheduleShift[]>("/shift-pool").then((r) => r.data)

export const getMyPoolRequests = () =>
  api.get<ShiftPoolRequest[]>("/shift-pool/my-requests").then((r) => r.data)

export const requestPoolShift = (shiftId: string) =>
  api
    .post<ShiftPoolRequest>(`/shift-pool/${shiftId}/request`)
    .then((r) => r.data)

// ─── Manager: Staff Profiles ─────────────────────────────

export const createStaffProfile = (data: {
  user_uuid: string
  position_id?: string
  priority?: number
  max_hours_per_week?: number
  max_consecutive_days?: number
  is_active?: boolean
}) => api.post<StaffProfile>("/staff-profiles", data).then((r) => r.data)

export const updateStaffProfile = (
  id: string,
  data: {
    position_id?: string
    priority?: number
    max_hours_per_week?: number
    max_consecutive_days?: number
    is_active?: boolean
  },
) => api.put<StaffProfile>(`/staff-profiles/${id}`, data).then((r) => r.data)

// ─── Manager: Schedules ──────────────────────────────────

export const getSchedules = () =>
  api.get<Schedule[]>("/schedules").then((r) => r.data)

export const createSchedule = (data: {
  name: string
  start_date: string
  end_date: string
}) => api.post<Schedule>("/schedules", data).then((r) => r.data)

export const publishSchedule = (id: string) =>
  api.put<Schedule>(`/schedules/${id}/publish`).then((r) => r.data)

export const archiveSchedule = (id: string) =>
  api.put<Schedule>(`/schedules/${id}/archive`).then((r) => r.data)

export const addShift = (
  scheduleId: string,
  data: {
    shift_type_id: string
    position_id: string
    date: string
    staff_profile_id?: string
  },
) =>
  api
    .post<ScheduleShift>(`/schedules/${scheduleId}/shifts`, data)
    .then((r) => r.data)

export const assignShift = (shiftId: string, staff_profile_id: string | null) =>
  api
    .put<ScheduleShift>(`/schedules/shifts/${shiftId}/assign`, {
      staff_profile_id,
    })
    .then((r) => r.data)

export const autoGenerateSchedule = (scheduleId: string) =>
  api
    .post<ScheduleShift[]>(`/schedules/${scheduleId}/auto-generate`)
    .then((r) => r.data)

// ─── Manager: Staffing Requirements ─────────────────────

export const getStaffingRequirements = () =>
  api
    .get<StaffingRequirement[]>("/schedules/config/staffing-requirements")
    .then((r) => r.data)

export const createStaffingRequirement = (data: {
  shift_type_id: string
  position_id: string
  required_count: number
}) =>
  api
    .post<StaffingRequirement>("/schedules/config/staffing-requirements", data)
    .then((r) => r.data)

export const updateStaffingRequirement = (
  id: string,
  data: { required_count: number },
) =>
  api
    .put<StaffingRequirement>(
      `/schedules/config/staffing-requirements/${id}`,
      data,
    )
    .then((r) => r.data)

export const deleteStaffingRequirement = (id: string) =>
  api
    .delete(`/schedules/config/staffing-requirements/${id}`)
    .then((r) => r.data)

// ─── Manager: Shift Pool Review ─────────────────────────

export const getShiftRequests = (shiftId: string) =>
  api
    .get<ShiftPoolRequest[]>(`/shift-pool/${shiftId}/requests`)
    .then((r) => r.data)

export const reviewPoolRequest = (
  requestId: string,
  status: "approved" | "denied",
) =>
  api
    .put<ShiftPoolRequest>(`/shift-pool/requests/${requestId}/review`, {
      status,
    })
    .then((r) => r.data)

// ─── Manager: Time Off Review ───────────────────────────

export const getAllTimeOffRequests = () =>
  api.get<TimeOffRequest[]>("/time-off").then((r) => r.data)

export const reviewTimeOff = (id: string, status: "approved" | "denied") =>
  api
    .put<TimeOffRequest>(`/time-off/${id}/review`, { status })
    .then((r) => r.data)

// ─── Manager: Shift Types ───────────────────────────────

export const createShiftType = (data: {
  name: string
  start_time: string
  end_time: string
  is_active?: boolean
}) => api.post<ShiftType>("/shift-types", data).then((r) => r.data)

export const updateShiftType = (
  id: string,
  data: {
    name?: string
    start_time?: string
    end_time?: string
    is_active?: boolean
  },
) => api.put<ShiftType>(`/shift-types/${id}`, data).then((r) => r.data)

// ─── Manager: Positions ─────────────────────────────────

export const createPosition = (data: {
  name: string
  description?: string
  is_active?: boolean
}) => api.post<Position>("/positions", data).then((r) => r.data)

export const updatePosition = (
  id: string,
  data: { name?: string; description?: string; is_active?: boolean },
) => api.put<Position>(`/positions/${id}`, data).then((r) => r.data)

// ─── Users ──────────────────────────────────────────────

export const getAppUsers = () => api.get<any[]>("/app-user").then((r) => r.data)

// ─── Roles ──────────────────────────────────────────────

export const getRoles = () =>
  api.get<{ code: string; description: string }[]>("/app-user-role").then((r) => r.data)

// ─── Invite User ────────────────────────────────────────

export const inviteUser = (data: {
  email: string
  user_name: string
  first_name: string
  last_name: string
  role: string
  phone?: string
}) => api.post("/keycloak-user", data).then((r) => r.data)
