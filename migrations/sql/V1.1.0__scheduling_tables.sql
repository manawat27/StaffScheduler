-- ============================================================
-- V1.1.0 — Scheduling tables (org-schema)
-- Tables: shift_type, position, staff_profile, availability,
--         time_off_request, schedule, schedule_shift,
--         shift_pool_request, staffing_requirement
-- ============================================================

-- 1. shift_type — Manager-defined shift blocks
CREATE TABLE IF NOT EXISTS shift_type (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE shift_type IS 'Named shift blocks with fixed start/end times (e.g. Morning, Evening).';

-- 2. position — Restaurant job positions
CREATE TABLE IF NOT EXISTS position (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE position IS 'Restaurant job positions (e.g. Cook, Server, Host).';

-- 3. staff_profile — Extends app_users within an org context
CREATE TABLE IF NOT EXISTS staff_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_uuid UUID NOT NULL UNIQUE REFERENCES app_users(uuid),
    position_id UUID REFERENCES position(id),
    priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    max_hours_per_week INTEGER NOT NULL DEFAULT 40,
    max_consecutive_days INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT true,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE staff_profile IS 'Scheduling profile for each staff member within an organization.';
COMMENT ON COLUMN staff_profile.priority IS 'Staff priority 1-10 (10 = highest). Higher priority gets first pick at shifts and vacation.';

-- 4. availability — Recurring weekly day-level availability
CREATE TABLE IF NOT EXISTS availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_profile_id UUID NOT NULL REFERENCES staff_profile(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    is_available BOOLEAN NOT NULL DEFAULT true,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (staff_profile_id, day_of_week)
);

COMMENT ON TABLE availability IS 'Recurring weekly availability per staff member. day_of_week: 0=Sunday .. 6=Saturday.';

-- 5. time_off_request — Simple time-off / vacation requests
CREATE TABLE IF NOT EXISTS time_off_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_profile_id UUID NOT NULL REFERENCES staff_profile(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date >= start_date)
);

COMMENT ON TABLE time_off_request IS 'Staff time-off requests with manager approval workflow.';

-- 6. schedule — Bi-weekly schedule periods
CREATE TABLE IF NOT EXISTS schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date > start_date)
);

COMMENT ON TABLE schedule IS 'Bi-weekly schedule periods containing shift assignments.';

-- 7. schedule_shift — Individual shift assignments within a schedule
CREATE TABLE IF NOT EXISTS schedule_shift (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES schedule(id) ON DELETE CASCADE,
    shift_type_id UUID NOT NULL REFERENCES shift_type(id),
    position_id UUID NOT NULL REFERENCES position(id),
    date DATE NOT NULL,
    staff_profile_id UUID REFERENCES staff_profile(id),
    is_in_pool BOOLEAN NOT NULL DEFAULT false,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schedule_shift_schedule_date ON schedule_shift(schedule_id, date);
CREATE INDEX IF NOT EXISTS idx_schedule_shift_staff ON schedule_shift(staff_profile_id);

COMMENT ON TABLE schedule_shift IS 'Individual shift slots. staff_profile_id NULL means unassigned. is_in_pool=true means available in shift pool.';

-- 8. shift_pool_request — Staff requests for open shifts
CREATE TABLE IF NOT EXISTS shift_pool_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_shift_id UUID NOT NULL REFERENCES schedule_shift(id) ON DELETE CASCADE,
    staff_profile_id UUID NOT NULL REFERENCES staff_profile(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (schedule_shift_id, staff_profile_id)
);

COMMENT ON TABLE shift_pool_request IS 'Staff requests to pick up open shifts from the shift pool. Manager approves.';

-- 9. staffing_requirement — How many of each position needed per shift type
CREATE TABLE IF NOT EXISTS staffing_requirement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_type_id UUID NOT NULL REFERENCES shift_type(id),
    position_id UUID NOT NULL REFERENCES position(id),
    required_count INTEGER NOT NULL DEFAULT 1 CHECK (required_count >= 0),
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (shift_type_id, position_id)
);

COMMENT ON TABLE staffing_requirement IS 'Defines how many staff of each position are needed per shift type. Used by auto-scheduler.';

-- ============================================================
-- Seed data: Default shift types
-- ============================================================
INSERT INTO shift_type (name, start_time, end_time, who_created)
VALUES
    ('Morning', '06:00:00', '14:00:00', 'system'),
    ('Evening', '14:00:00', '22:00:00', 'system')
ON CONFLICT DO NOTHING;
