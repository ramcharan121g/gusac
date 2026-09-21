-- ==============================================================================
-- GUSAC INNOVATION HUB — INITIAL SEED DATA (VISAKHAPATNAM MAIN CAMPUS)
-- ==============================================================================

-- 1. Default Super Admin (admin@gitam.in / MFA Enabled)
-- Password hash generated with scrypt: salt 8b671a5a871d34e2, hash verified
INSERT INTO users (
    id, email, first_name, last_name, name, phone, user_type,
    college_or_company, student_id, role, password_hash, salt, mfa_enabled, mfa_secret
) VALUES (
    'usr_admin_01',
    'admin@gitam.in',
    'GUSAC',
    'Administrator',
    'GUSAC Administrator',
    '+91-891-2840501',
    'gitam',
    'GITAM Deemed to be University, Visakhapatnam',
    'ADM-VSP-001',
    'admin',
    '8b671a5a871d34e2:4e45c7eb163ffaa9c118182f7e7f78082980132a0c6a5bbceabcecebc3f3e8f6eec3b05f238cecb0313c0130cb021baee7be88bb5d706596850c95a04e76c125',
    '8b671a5a871d34e2',
    TRUE,
    'JBSWY3DPEHPK3PXP'
) ON CONFLICT (email) DO NOTHING;

-- 2. Initial Flagship Events
INSERT INTO events (
    id, title, slug, category, date, time, venue, description, fee, capacity, registered_count, banner_image
) VALUES
(
    'evt_01',
    'Autonomous UAV & Drone Aerodynamics Workshop',
    'drone-aerodynamics-workshop-2026',
    'Hands-on Workshop',
    'October 18, 2026',
    '09:30 AM - 04:30 PM IST',
    'Hangar 3 & Aeromodelling Ground, Visakhapatnam Campus',
    'Hands-on masterclass building custom quadcopters, tuning ArduPilot/Pixhawk flight controllers, and conducting outdoor telemetry flight runs.',
    0.00,
    120,
    78,
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80'
),
(
    'evt_02',
    'URC Mars Rover Telemetry & SLAM Hackathon',
    'mars-rover-telemetry-hackathon',
    'Flagship Fest',
    'November 12-14, 2026',
    '48-Hour Continuous Sprint',
    'GUSAC Central Arena, Visakhapatnam Campus',
    'National inter-university robotics challenge designing autonomous rocker-bogie planetary rovers with real-time stereo depth mapping.',
    250.00,
    60,
    42,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Student Featured Projects
INSERT INTO projects (
    id, title, domain, team_lead, student_id, abstract, status, patent_status, github_url, demo_url, image_url
) VALUES
(
    'proj_01',
    'Garuda-X: Autonomous Hybrid VTOL for Marine Surveillance',
    'Aerospace & Drones',
    'Sneha Reddy',
    'VU21CSEN010042',
    'Long-endurance fixed-wing vertical takeoff drone engineered for continuous coastal patrol along the Bay of Bengal coastline.',
    'Flight Tested (TRL 7)',
    'Indian Patent Filed (2025/CHE/4910)',
    'https://github.com/gusac-gitam/garuda-x-vtol',
    'https://garuda-vtol.gusac.gitam.edu',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
),
(
    'proj_02',
    'Prithvi-II: University Rover Challenge Autonomous Platform',
    'Robotics & AI',
    'Rohit Varma',
    'VU22ECEN020119',
    'Six-wheel rocker-bogie planetary rover equipped with LiDAR SLAM navigation and a 6-DoF robotic arm for extraterrestrial soil sampling.',
    'System Validated (TRL 6)',
    'AICTE Innovation Grant Recipient',
    'https://github.com/gusac-gitam/prithvi-rover',
    'https://prithvi.gusac.gitam.edu',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
)
ON CONFLICT (id) DO NOTHING;
