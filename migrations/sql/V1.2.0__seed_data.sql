-- ============================================================
-- V1.2.0 — Seed data: shift_types, positions & app_users
-- ============================================================

-- 1. Shift Types
INSERT INTO shift_type (name, start_time, end_time, who_created)
VALUES
  ('Morning',   '07:00', '15:00', 'system'),
  ('Afternoon', '11:00', '19:00', 'system'),
  ('Evening',   '16:00', '00:00', 'system'),
  ('Closing',   '19:00', '02:00', 'system')
ON CONFLICT DO NOTHING;

-- 2. Positions
INSERT INTO position (name, description, who_created)
VALUES
  ('Server',                'Handles table service and guest orders.',           'system'),
  ('Host',                  'Manages front-of-house seating and guest flow.',    'system'),
  ('Expo',                  'Coordinates food delivery between kitchen and floor.', 'system'),
  ('General Manager',       'Oversees all restaurant operations.',               'system'),
  ('Front of House Manager','Manages front-of-house staff and guest experience.','system')
ON CONFLICT (name) DO NOTHING;

-- 3. App Users (matching Keycloak realm-export users)
INSERT INTO app_users (uuid, email, user_name, first_name, last_name, phone, date_of_birth, country, city, postal_code, role, enabled, who_created)
VALUES
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c0', 'jsmith@fifth-st.com',      'jsmith',   'John',  'Smith',   '123-456-7890', '1985-06-15', 'United States', 'New York',    '10001',    'admin',                     true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c1', 'djohnson@fifth-st.com',    'djohnson', 'David', 'Johnson', '234-567-8901', '1978-11-23', 'United States', 'Chicago',     '60601',    'general_manager',           true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c2', 'smiller@fifth-st.com',     'smiller',  'Sarah', 'Miller',  '345-678-9012', '1990-02-10', 'United States', 'Los Angeles', '90001',    'server',                    true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'lparker@green-dragon.com',  'lparker',  'Liam',  'Parker',  '456-789-0123', '1982-04-22', 'Canada',        'Toronto',     'M5A 1A1',  'admin',                     true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a98', 'emartin@green-dragon.com',  'emartin',  'Emily', 'Martin',  '567-890-1234', '1988-09-30', 'Canada',        'Vancouver',   'V6B 1A1',  'front_of_house_manager',    true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a97', 'awilson@green-dragon.com',  'awilson',  'Alex',  'Wilson',  '678-901-2345', '1992-07-19', 'Canada',        'Montreal',    'H2X 1Y4',  'server',                    true, 'system')
ON CONFLICT (uuid) DO NOTHING;

-- 4. Staff profiles for admin users
INSERT INTO staff_profile (user_uuid, priority, who_created)
VALUES
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c0', 10, 'system'),  -- jsmith (admin)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 10, 'system')     -- lparker (admin)
ON CONFLICT (user_uuid) DO NOTHING;
