CREATE TABLE IF NOT EXISTS public.organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    assets_folder VARCHAR(100),
    theme JSONB,
    who_created VARCHAR(100),
    when_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    who_updated VARCHAR(100),
    when_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE organization IS 'Stores information about each tenant organization using the application. Used for multi-tenancy separation.';

COMMENT ON COLUMN organization.id IS 'Primary key. Unique ID for the organization.';
COMMENT ON COLUMN organization.name IS 'Human-readable name of the organization.';
COMMENT ON COLUMN organization.assets_folder IS 'Folder name for branding purposes. Must exist in frontend/src/assets/{assets_folder}/.';
COMMENT ON COLUMN organization.theme IS 'Optional JSON object that defines UI customization (e.g., colors, layout preferences).';
COMMENT ON COLUMN organization.who_created IS 'Who created the organization record.';
COMMENT ON COLUMN organization.when_created IS 'Timestamp when the organization record was created.';
COMMENT ON COLUMN organization.who_updated IS 'Who updated the organization record.';
COMMENT ON COLUMN organization.when_updated IS 'Timestamp when the organization record was last updated.';