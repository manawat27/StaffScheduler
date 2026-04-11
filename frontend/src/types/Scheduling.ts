export interface ShiftType {
  id: string
  name: string
  start_time: string
  end_time: string
  is_active: boolean
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}

export interface Position {
  id: string
  name: string
  description?: string
  is_active: boolean
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}

export interface StaffProfile {
  id: string
  user_uuid: string
  position_id?: string
  position?: Position
  priority: number
  max_hours_per_week: number
  max_consecutive_days: number
  is_active: boolean
  availability?: Availability[]
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}

export interface Availability {
  id: string
  staff_profile_id: string
  day_of_week: number
  is_available: boolean
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}

export interface TimeOffRequest {
  id: string
  staff_profile_id: string
  staff_profile?: StaffProfile
  start_date: string
  end_date: string
  reason?: string
  status: "pending" | "approved" | "denied"
  reviewed_by?: string
  reviewed_at?: string
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}

export interface Schedule {
  id: string
  name: string
  start_date: string
  end_date: string
  status: "draft" | "published" | "archived"
  shifts?: ScheduleShift[]
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}

export interface ScheduleShift {
  id: string
  schedule_id: string
  schedule?: Schedule
  shift_type_id: string
  shift_type?: ShiftType
  position_id: string
  position?: Position
  date: string
  staff_profile_id?: string
  staff_profile?: StaffProfile
  is_in_pool: boolean
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}

export interface ShiftPoolRequest {
  id: string
  schedule_shift_id: string
  schedule_shift?: ScheduleShift
  staff_profile_id: string
  staff_profile?: StaffProfile
  status: "pending" | "approved" | "denied"
  requested_at: string
  reviewed_by?: string
  reviewed_at?: string
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}

export interface StaffingRequirement {
  id: string
  shift_type_id: string
  shift_type?: ShiftType
  position_id: string
  position?: Position
  required_count: number
  who_created?: string
  when_created?: string
  who_updated?: string
  when_updated?: string
}
