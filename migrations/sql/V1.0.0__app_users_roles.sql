CREATE TABLE
  app_users_roles (
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(500) NOT NULL,
    effective_date TIMESTAMP NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

COMMENT ON TABLE app_users_roles IS 'Roles available to users.';

INSERT INTO
  app_users_roles (
    code,
    description,
    effective_date,
    expiry_date,
    who_created
  )
VALUES
  (
    'admin',
    'Admin',
    CURRENT_TIMESTAMP,
    '2099-12-31 23:59:59',
    'system'
  ),
  (
    'staff',
    'Staff',
    CURRENT_TIMESTAMP,
    '2099-12-31 23:59:59',
    'system'
  ),
  (
    'manager',
    'Manager',
    CURRENT_TIMESTAMP,
    '2099-12-31 23:59:59',
    'system'
  );

CREATE TABLE
  app_users (
    uuid UUID PRIMARY KEY, -- Matches Keycloak UUID
    email VARCHAR UNIQUE NOT NULL,
    user_name VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    phone VARCHAR,
    role VARCHAR(50) NOT NULL, -- role as defined in app_users_roles table 
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role) REFERENCES app_users_roles (code)
  );

COMMENT ON TABLE app_users IS 'Lookup table for all the users in the system to prevent frequent queries to keycloak.';

COMMENT ON COLUMN app_users.uuid IS 'Matches the UUID from Keycloak user ID';

COMMENT ON COLUMN app_users.email IS 'Email address of the user (must be unique)';

COMMENT ON COLUMN app_users.user_name IS 'Username for login (must be unique)';

COMMENT ON COLUMN app_users.first_name IS 'First name of the user';

COMMENT ON COLUMN app_users.last_name IS 'Last name of the user';

COMMENT ON COLUMN app_users.phone IS 'Optional phone number';

COMMENT ON COLUMN app_users.role IS 'Role from app_users_roles table (e.g., admin, staff, manager)';

COMMENT ON COLUMN app_users.who_created IS 'Username of the user who created this record';

COMMENT ON COLUMN app_users.when_created IS 'Timestamp when this record was created';

COMMENT ON COLUMN app_users.who_updated IS 'Username of the last user to update this record';

COMMENT ON COLUMN app_users.when_updated IS 'Timestamp of the last update to this record';