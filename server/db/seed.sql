-- ==============================================================================
-- GUSAC INNOVATION HUB — INITIAL SEED DATA (VISAKHAPATNAM MAIN CAMPUS)
-- ==============================================================================

-- 1. Default Super Admin (ramcharan20070@gmail.com / scrypt-hashed)
INSERT INTO users (
    id, email, first_name, last_name, name, phone, user_type,
    college_or_company, student_id, role, password_hash, salt, mfa_enabled, mfa_secret
) VALUES (
    'usr_admin_ramcharan',
    'ramcharan20070@gmail.com',
    'Ram',
    'Charan',
    'Ram Charan (Lead Administrator)',
    '+91-98480-12345',
    'gitam',
    'GITAM Deemed to be University, Visakhapatnam',
    'ADM-VSP-001',
    'admin',
    'b04b693a01ba750069a29bfb91d92606:8d4e68f62ac5322e0efadf663c70f0cceb900d948057d7826bf6d74bd6d41594e65b084fd7c7e70cc07127cd4cac41fa92b7f4b65991437d07481a43aba96a3a',
    'b04b693a01ba750069a29bfb91d92606',
    FALSE,
    NULL
) ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    password_hash = EXCLUDED.password_hash,
    salt = EXCLUDED.salt,
    mfa_enabled = FALSE;

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
