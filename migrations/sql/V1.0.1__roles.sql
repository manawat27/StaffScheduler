CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

INSERT INTO roles (id, name, description) VALUES
  (gen_random_uuid(), 'ADMIN', 'Administrator with full access'),
  (gen_random_uuid(), 'MANAGER', 'Manager with elevated permissions'),
  (gen_random_uuid(), 'STAFF', 'Regular staff with standard access');