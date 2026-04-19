-- ============================================================
-- V1.2.0 — Seed data: shift_types, positions & app_users
-- ============================================================

-- 0. New role: Bartender
INSERT INTO app_users_roles (code, description, effective_date, expiry_date, who_created)
VALUES ('bartender', 'Bartender', CURRENT_TIMESTAMP, '2099-12-31 23:59:59', 'system')
ON CONFLICT (code) DO NOTHING;

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
  ('Server',                'Handles table service and guest orders.',              'system'),
  ('Host',                  'Manages front-of-house seating and guest flow.',       'system'),
  ('Expo',                  'Coordinates food delivery between kitchen and floor.', 'system'),
  ('General Manager',       'Oversees all restaurant operations.',                  'system'),
  ('Front of House Manager','Manages front-of-house staff and guest experience.',   'system'),
  ('Bartender',             'Prepares and serves beverages at the bar.',            'system')
ON CONFLICT (name) DO NOTHING;

-- 3. App Users (matching Keycloak realm-export users)
-- ---- fifth-st organisation ----
INSERT INTO app_users (uuid, email, user_name, first_name, last_name, phone, date_of_birth, country, city, postal_code, role, enabled, who_created)
VALUES
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c0', 'jsmith@fifth-st.com',       'jsmith',    'John',      'Smith',    '123-456-7890', '1985-06-15', 'United States', 'New York',      '10001',  'admin',                  true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c1', 'djohnson@fifth-st.com',     'djohnson',  'David',     'Johnson',  '234-567-8901', '1978-11-23', 'United States', 'Chicago',       '60601',  'general_manager',        true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c2', 'smiller@fifth-st.com',      'smiller',   'Sarah',     'Miller',   '345-678-9012', '1990-02-10', 'United States', 'Los Angeles',   '90001',  'server',                 true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c3', 'rthompson@fifth-st.com',    'rthompson', 'Rachel',    'Thompson', '789-012-3456', '1991-03-14', 'United States', 'Miami',         '33101',  'front_of_house_manager', true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c4', 'mgarcia@fifth-st.com',      'mgarcia',   'Michael',   'Garcia',   '890-123-4567', '1995-08-07', 'United States', 'Houston',       '77001',  'host',                   true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c5', 'jbrown@fifth-st.com',       'jbrown',    'Jessica',   'Brown',    '901-234-5678', '1987-12-01', 'United States', 'Phoenix',       '85001',  'expo',                   true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c6', 'clee@fifth-st.com',         'clee',      'Chris',     'Lee',      '789-012-3456', '1993-07-22', 'United States', 'Seattle',       '98101',  'server',                 true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c7', 'awright@fifth-st.com',      'awright',   'Amanda',    'Wright',   '890-123-4568', '1989-01-30', 'United States', 'Denver',        '80201',  'bartender',              true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c8', 'bturner@fifth-st.com',      'bturner',   'Brandon',   'Turner',   '901-234-5679', '1997-04-11', 'United States', 'Portland',      '97201',  'host',                   true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c9', 'kmorris@fifth-st.com',      'kmorris',   'Katie',     'Morris',   '012-345-6790', '1994-09-05', 'United States', 'Austin',        '73301',  'server',                 true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0ca', 'jreyes@fifth-st.com',       'jreyes',    'Jason',     'Reyes',    '123-456-7891', '1986-11-17', 'United States', 'San Diego',     '92101',  'expo',                   true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0cb', 'lhall@fifth-st.com',        'lhall',     'Laura',     'Hall',     '234-567-8902', '1991-06-28', 'United States', 'Nashville',     '37201',  'bartender',              true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0cc', 'dross@fifth-st.com',        'dross',     'Daniel',    'Ross',     '345-678-9013', '1988-02-14', 'United States', 'Atlanta',       '30301',  'server',                 true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0cd', 'npatel@fifth-st.com',       'npatel',    'Nina',      'Patel',    '456-789-0124', '1996-08-09', 'United States', 'San Francisco', '94101',  'host',                   true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0ce', 'tcooper@fifth-st.com',      'tcooper',   'Trevor',    'Cooper',   '567-890-1235', '1990-12-03', 'United States', 'Boston',        '02101',  'bartender',              true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0cf', 'sking@fifth-st.com',        'sking',     'Samantha',  'King',     '678-901-2346', '1987-03-21', 'United States', 'Dallas',        '75201',  'server',                 true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0d0', 'rwood@fifth-st.com',        'rwood',     'Ryan',      'Wood',     '789-012-3457', '1995-05-16', 'United States', 'Minneapolis',   '55401',  'expo',                   true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0d1', 'mflores@fifth-st.com',      'mflores',   'Maria',     'Flores',   '890-123-4569', '1992-10-07', 'United States', 'Philadelphia',  '19101',  'bartender',              true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0d2', 'phughes@fifth-st.com',      'phughes',   'Patrick',   'Hughes',   '901-234-5670', '1984-07-25', 'United States', 'Detroit',       '48201',  'host',                   true, 'system'),
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0d3', 'awong@fifth-st.com',        'awong',     'Amy',       'Wong',     '012-345-6791', '1998-01-12', 'United States', 'Las Vegas',     '89101',  'server',                 true, 'system')
ON CONFLICT (uuid) DO NOTHING;

-- ---- green-dragon organisation ----
INSERT INTO app_users (uuid, email, user_name, first_name, last_name, phone, date_of_birth, country, city, postal_code, role, enabled, who_created)
VALUES
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'lparker@green-dragon.com',    'lparker',    'Liam',    'Parker',    '456-789-0123', '1982-04-22', 'Canada', 'Toronto',     'M5A 1A1', 'admin',                  true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a98', 'emartin@green-dragon.com',    'emartin',    'Emily',   'Martin',    '567-890-1234', '1988-09-30', 'Canada', 'Vancouver',   'V6B 1A1', 'front_of_house_manager', true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a97', 'awilson@green-dragon.com',    'awilson',    'Alex',    'Wilson',    '678-901-2345', '1992-07-19', 'Canada', 'Montreal',    'H2X 1Y4', 'host',                   true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a96', 'nchen@green-dragon.com',      'nchen',      'Nathan',  'Chen',      '012-345-6789', '1983-05-18', 'Canada', 'Ottawa',      'K1A 0A6', 'general_manager',        true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a95', 'jrivera@green-dragon.com',    'jrivera',    'Julia',   'Rivera',    '123-987-6543', '1994-01-25', 'Canada', 'Calgary',     'T2P 1J9', 'server',                 true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a94', 'tkim@green-dragon.com',       'tkim',       'Tyler',   'Kim',       '234-876-5432', '1996-10-12', 'Canada', 'Edmonton',    'T5J 0N3', 'expo',                   true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a93', 'sscott@green-dragon.com',     'sscott',     'Sophie',  'Scott',     '345-876-5432', '1990-03-08', 'Canada', 'Winnipeg',    'R3C 0A1', 'bartender',              true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a92', 'jcampbell@green-dragon.com',  'jcampbell',  'Jake',    'Campbell',  '456-765-4321', '1993-08-19', 'Canada', 'Hamilton',    'L8P 1A1', 'server',                 true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', 'oanderson@green-dragon.com',  'oanderson',  'Olivia',  'Anderson',  '567-654-3210', '1987-11-02', 'Canada', 'Quebec City', 'G1R 1A1', 'host',                   true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a90', 'mwhite@green-dragon.com',     'mwhite',     'Marcus',  'White',     '678-543-2109', '1995-06-14', 'Canada', 'Halifax',     'B3H 1A1', 'bartender',              true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8f', 'hlee@green-dragon.com',       'hlee',       'Hannah',  'Lee',       '789-432-1098', '1991-02-27', 'Canada', 'Victoria',    'V8W 1A1', 'server',                 true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8e', 'dmoore@green-dragon.com',     'dmoore',     'Dylan',   'Moore',     '890-321-0987', '1986-09-10', 'Canada', 'Saskatoon',   'S7K 1A1', 'expo',                   true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8d', 'ctaylor@green-dragon.com',    'ctaylor',    'Chloe',   'Taylor',    '901-210-9876', '1994-04-23', 'Canada', 'London',      'N6A 1A1', 'bartender',              true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8c', 'bnguyen@green-dragon.com',    'bnguyen',    'Ben',     'Nguyen',    '012-109-8765', '1989-12-16', 'Canada', 'Kitchener',   'N2G 1A1', 'server',                 true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8b', 'krobinson@green-dragon.com',  'krobinson',  'Kate',    'Robinson',  '123-098-7654', '1997-07-01', 'Canada', 'Windsor',     'N9A 1A1', 'host',                   true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8a', 'rsingh@green-dragon.com',     'rsingh',     'Raj',     'Singh',     '234-987-6543', '1985-01-19', 'Canada', 'Regina',      'S4P 1A1', 'server',                 true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a89', 'lwilliams@green-dragon.com',  'lwilliams',  'Lisa',    'Williams',  '345-876-5433', '1992-05-30', 'Canada', 'St. Johns',   'A1C 1A1', 'expo',                   true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'jmurphy@green-dragon.com',    'jmurphy',    'James',   'Murphy',    '456-765-4322', '1988-10-22', 'Canada', 'Kelowna',     'V1Y 1A1', 'bartender',              true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a87', 'egraham@green-dragon.com',    'egraham',    'Emma',    'Graham',    '567-654-3211', '1996-03-15', 'Canada', 'Barrie',      'L4M 1A1', 'host',                   true, 'system'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a86', 'apetrov@green-dragon.com',    'apetrov',    'Anton',   'Petrov',    '678-543-2100', '1983-08-04', 'Canada', 'Guelph',      'N1G 1A1', 'server',                 true, 'system')
ON CONFLICT (uuid) DO NOTHING;

-- 4. Staff profiles (all users)
-- ---- fifth-st ----
INSERT INTO staff_profile (user_uuid, priority, who_created)
VALUES
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c0', 10, 'system'),  -- jsmith (admin)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c1',  9, 'system'),  -- djohnson (general_manager)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c2',  5, 'system'),  -- smiller (server)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c3',  8, 'system'),  -- rthompson (front_of_house_manager)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c4',  5, 'system'),  -- mgarcia (host)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c5',  5, 'system'),  -- jbrown (expo)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c6',  5, 'system'),  -- clee (server)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c7',  5, 'system'),  -- awright (bartender)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c8',  4, 'system'),  -- bturner (host)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0c9',  5, 'system'),  -- kmorris (server)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0ca',  6, 'system'),  -- jreyes (expo)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0cb',  5, 'system'),  -- lhall (bartender)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0cc',  6, 'system'),  -- dross (server)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0cd',  4, 'system'),  -- npatel (host)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0ce',  5, 'system'),  -- tcooper (bartender)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0cf',  7, 'system'),  -- sking (server)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0d0',  5, 'system'),  -- rwood (expo)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0d1',  6, 'system'),  -- mflores (bartender)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0d2',  5, 'system'),  -- phughes (host)
  ('c1b8f3a4-9f4e-4b9a-9e6a-b8f1b9a8e0d3',  4, 'system')   -- awong (server)
ON CONFLICT (user_uuid) DO NOTHING;

-- ---- green-dragon ----
INSERT INTO staff_profile (user_uuid, priority, who_created)
VALUES
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 10, 'system'),  -- lparker (admin)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a98',  8, 'system'),  -- emartin (front_of_house_manager)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a97',  5, 'system'),  -- awilson (host)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a96',  9, 'system'),  -- nchen (general_manager)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a95',  5, 'system'),  -- jrivera (server)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a94',  5, 'system'),  -- tkim (expo)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a93',  5, 'system'),  -- sscott (bartender)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a92',  5, 'system'),  -- jcampbell (server)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a91',  5, 'system'),  -- oanderson (host)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a90',  6, 'system'),  -- mwhite (bartender)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8f',  5, 'system'),  -- hlee (server)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8e',  5, 'system'),  -- dmoore (expo)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8d',  5, 'system'),  -- ctaylor (bartender)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8c',  6, 'system'),  -- bnguyen (server)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8b',  4, 'system'),  -- krobinson (host)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a8a',  7, 'system'),  -- rsingh (server)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a89',  5, 'system'),  -- lwilliams (expo)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',  5, 'system'),  -- jmurphy (bartender)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a87',  4, 'system'),  -- egraham (host)
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a86',  6, 'system')   -- apetrov (server)
ON CONFLICT (user_uuid) DO NOTHING;
