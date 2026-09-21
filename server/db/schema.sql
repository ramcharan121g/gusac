-- ==============================================================================
-- GUSAC INNOVATION HUB — POSTGRESQL PRODUCTION SCHEMA (GOOGLE CLOUD SQL)
-- ==============================================================================
-- Run this script to provision the Cloud SQL database tables and constraints.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('student', 'faculty', 'coordinator', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_type_enum AS ENUM ('gitam', 'external');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE security_level_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(30),
    user_type user_type_enum DEFAULT 'gitam',
    college_or_company VARCHAR(255) DEFAULT 'GITAM Deemed to be University, Visakhapatnam',
    from_address TEXT,
    student_id VARCHAR(50),
    role user_role_enum DEFAULT 'student',
    password_hash VARCHAR(500) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(100),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 4. SESSIONS TABLE (With Auto-Expiry Tracking)
CREATE TABLE IF NOT EXISTS sessions (
    token_hash VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    mfa_verified BOOLEAN DEFAULT FALSE,
    is_pending_mfa BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

-- 5. OTP STORE TABLE
CREATE TABLE IF NOT EXISTS otp_verifications (
    email VARCHAR(255) PRIMARY KEY,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    date VARCHAR(100) NOT NULL,
    time VARCHAR(100) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    fee NUMERIC(10, 2) DEFAULT 0.00,
    capacity INT NOT NULL,
    registered_count INT DEFAULT 0,
    banner_image TEXT,
    agenda JSONB DEFAULT '[]'::jsonb,
    coordinators JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. EVENT REGISTRATIONS & SIGNED DIGITAL PASSES
CREATE TABLE IF NOT EXISTS registrations (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) REFERENCES events(id) ON DELETE RESTRICT,
    event_title VARCHAR(255) NOT NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE RESTRICT,
    user_name VARCHAR(200) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(30),
    user_type user_type_enum DEFAULT 'gitam',
    student_id VARCHAR(50),
    ticket_code VARCHAR(64) UNIQUE NOT NULL,
    pass_signature VARCHAR(128) NOT NULL,
    fee_paid NUMERIC(10, 2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'FREE_RSVP',
    payment_txn_id VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'COMPLETED',
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    checked_in_by VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reg_ticket ON registrations(ticket_code);
CREATE INDEX IF NOT EXISTS idx_reg_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_reg_checkin ON registrations(checked_in);

-- 8. STUDENT PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    team_lead VARCHAR(200) NOT NULL,
    student_id VARCHAR(50),
    abstract TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Active Prototype',
    patent_status VARCHAR(100) DEFAULT 'Pending AICTE Filing',
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. IMMUTABLE AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actor VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    ip VARCHAR(45),
    status VARCHAR(50) NOT NULL,
    details TEXT,
    security_level security_level_enum DEFAULT 'MEDIUM'
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor);

-- 10. UNIVERSAL CMS STORAGE TABLE (Key-Value JSONB)
CREATE TABLE IF NOT EXISTS site_content (
    section_key VARCHAR(100) PRIMARY KEY,
    content_data JSONB NOT NULL,
    updated_by VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
