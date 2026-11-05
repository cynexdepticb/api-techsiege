-- TechSiege registration schema (frontend / public schema).
-- Apply with: npm run db:migrate   (reads db/schema.sql against DATABASE_URL)
-- Requires PostgreSQL 13+ (gen_random_uuid is built-in).
--
-- These tables live in the default `public` schema. The separate `ops/` app
-- keeps its own `ops` schema in the same database and imports from here with
-- `npm run db:sync-registrations` over in that app.
--
-- Migration policy: this file is re-applied on every deploy, so every change
-- below must be idempotent (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS / DO
-- blocks). Never drop or rename a column here — add new ones and backfill.

CREATE TABLE IF NOT EXISTS teams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name   VARCHAR(80)  NOT NULL,
  institution VARCHAR(160) NOT NULL,
  city        VARCHAR(100) NOT NULL DEFAULT '',
  track_id    VARCHAR(40)  NOT NULL,
  project_idea TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  is_lead    BOOLEAN NOT NULL DEFAULT false,
  full_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(254) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  branch_year VARCHAR(120) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One email per event (case-insensitive).
CREATE UNIQUE INDEX IF NOT EXISTS members_email_unique ON members (lower(email));
CREATE INDEX IF NOT EXISTS members_team_idx ON members (team_id);

-- ─── Payment-verified registration (2026-09-27) ──────────────────────
-- Explicit status model. No boolean flags: payment and registration state are
-- separate columns so "paid but not confirmed" stays answerable.

-- Registration lifecycle: PAYMENT_PENDING → PAYMENT_VERIFICATION →
-- CONFIRMED | PAYMENT_REJECTED | RESUBMISSION_REQUIRED | CANCELLED.
ALTER TABLE teams ADD COLUMN IF NOT EXISTS team_code VARCHAR(16);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS event_slug VARCHAR(40) NOT NULL DEFAULT 'hackathon';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS registration_status VARCHAR(32) NOT NULL DEFAULT 'PAYMENT_PENDING';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS payment_status VARCHAR(16) NOT NULL DEFAULT 'PENDING';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS payment_screenshot_path TEXT NOT NULL DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS payment_screenshot_mime VARCHAR(64) NOT NULL DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS payment_screenshot_size INT NOT NULL DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE teams ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS verified_by VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS rejection_reason TEXT NOT NULL DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS confirmation_email_status VARCHAR(16) NOT NULL DEFAULT 'NOT_SENT';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Backfill pre-payment rows: they were stored with no screenshot and no
-- verification, which is exactly PAYMENT_PENDING / PENDING.
-- team_code backfill is best-effort (NULL stays NULL for old rows; new rows
-- always get one from the app). Uniqueness enforced below for non-null codes.
UPDATE teams SET submitted_at = created_at WHERE submitted_at IS NULL;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'teams_registration_status_check') THEN
    ALTER TABLE teams ADD CONSTRAINT teams_registration_status_check CHECK (
      registration_status IN ('PAYMENT_PENDING','PAYMENT_VERIFICATION','PAYMENT_REJECTED','RESUBMISSION_REQUIRED','CONFIRMED','CANCELLED')
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'teams_payment_status_check') THEN
    ALTER TABLE teams ADD CONSTRAINT teams_payment_status_check CHECK (
      payment_status IN ('PENDING','VERIFIED','REJECTED')
    );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS teams_code_unique ON teams (team_code);
CREATE INDEX IF NOT EXISTS teams_status_idx ON teams (registration_status, payment_status);
CREATE INDEX IF NOT EXISTS teams_event_idx ON teams (event_slug, registration_status);
CREATE INDEX IF NOT EXISTS teams_submitted_idx ON teams (submitted_at DESC);

ALTER TABLE members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Audit log for payment decisions made by operations.
CREATE TABLE IF NOT EXISTS payment_decisions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id       UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  decision      VARCHAR(32) NOT NULL,
  reason        TEXT NOT NULL DEFAULT '',
  admin_identity VARCHAR(120) NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payment_decisions_team_idx ON payment_decisions (team_id, created_at DESC);
