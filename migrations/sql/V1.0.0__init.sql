CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  priority INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE availability (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE shifts (
  id UUID PRIMARY KEY,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE shift_assignments (
  id UUID PRIMARY KEY,
  shift_id UUID REFERENCES shifts(id),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'ASSIGNED'
);
