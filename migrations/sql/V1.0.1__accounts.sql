CREATE EXTENSION IF NOT EXISTS citext SCHEMA public;

CREATE TABLE
    IF NOT EXISTS public.account_plan_type_code (
        code TEXT PRIMARY KEY, -- e.g., 'free', 'starter', 'pro'
        description TEXT NOT NULL,
        -- Audit columns
        who_created VARCHAR(100),
        when_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        who_updated VARCHAR(100),
        when_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO
    public.account_plan_type_code (code, description)
VALUES
    ('free', 'Free account.') ON CONFLICT (code) DO NOTHING;

INSERT INTO
    public.account_plan_type_code (code, description)
VALUES
    ('starter', 'Starter account.') ON CONFLICT (code) DO NOTHING;

INSERT INTO
    public.account_plan_type_code (code, description)
VALUES
    ('pro', 'Pro account.') ON CONFLICT (code) DO NOTHING;

CREATE TABLE
    IF NOT EXISTS public.account (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        -- Contact / identity info
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT,
        email_address CITEXT NOT NULL UNIQUE, -- case-insensitive emails
        company_name TEXT NOT NULL,
        -- Account state
        active BOOLEAN NOT NULL DEFAULT TRUE,
        account_plan_type_code TEXT NOT NULL REFERENCES account_plan_type_code (code) ON UPDATE CASCADE ON DELETE RESTRICT,
        -- Optional payment provider customer ID (Stripe, Paddle, etc.)
        payment_customer_id TEXT,
        -- Audit columns
        who_created VARCHAR(100),
        when_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        who_updated VARCHAR(100),
        when_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

COMMENT ON TABLE account_plan_type_code IS 'Lookup table defining the available account plan types (e.g., free, starter, pro).';

COMMENT ON COLUMN account_plan_type_code.code IS 'Unique identifier for the account plan type (e.g., ''free'', ''starter'', ''pro'').';

COMMENT ON COLUMN account_plan_type_code.description IS 'Human-readable description of the account plan type.';

COMMENT ON COLUMN account_plan_type_code.who_created IS 'Username or identifier of the user/process that created this record.';

COMMENT ON COLUMN account_plan_type_code.when_created IS 'Timestamp when this record was created.';

COMMENT ON COLUMN account_plan_type_code.who_updated IS 'Username or identifier of the user/process that last updated this record.';

COMMENT ON COLUMN account_plan_type_code.when_updated IS 'Timestamp when this record was last updated.';

COMMENT ON TABLE account IS 'Main account table storing organization and contact details, plan type, and billing identifiers.';

COMMENT ON COLUMN account.id IS 'Primary key identifier for the account.';

COMMENT ON COLUMN account.first_name IS 'First name of the primary account contact.';

COMMENT ON COLUMN account.last_name IS 'Last name of the primary account contact.';

COMMENT ON COLUMN account.phone_number IS 'Phone number of the primary account contact.';

COMMENT ON COLUMN account.email_address IS 'Email address of the primary account contact (case-insensitive).';

COMMENT ON COLUMN account.company_name IS 'Legal or trade name of the organization associated with the account.';

COMMENT ON COLUMN account.active IS 'Boolean flag indicating whether the account is active.';

COMMENT ON COLUMN account.account_plan_type_code IS 'Foreign key reference to account_plan_type_code; indicates the subscription tier.';

COMMENT ON COLUMN account.payment_customer_id IS 'Optional external payment provider customer identifier (e.g., Stripe customer ID).';

COMMENT ON COLUMN account.who_created IS 'Username or identifier of the user/process that created this record.';

COMMENT ON COLUMN account.when_created IS 'Timestamp when this record was created.';

COMMENT ON COLUMN account.who_updated IS 'Username or identifier of the user/process that last updated this record.';

COMMENT ON COLUMN account.when_updated IS 'Timestamp when this record was last updated.';