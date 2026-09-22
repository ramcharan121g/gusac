import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_CONTENT_FILE = path.join(__dirname, 'db', 'site_content.json');

// In-memory persistent state store for GUSAC database
export const db = {
  users: [
    {
      id: 'usr_admin_ramcharan',
      firstName: 'Ram',
      lastName: 'Charan',
      name: 'Ram Charan (Lead Administrator)',
      email: 'ramcharan20070@gmail.com',
      phone: '+91 98480 12345',
      userType: 'gitam',
      collegeOrCompany: 'GITAM Deemed to be University, Visakhapatnam',
      fromAddress: 'Visakhapatnam Campus, ICT Bhavan',
      passwordHash: 'b04b693a01ba750069a29bfb91d92606:8d4e68f62ac5322e0efadf663c70f0cceb900d948057d7826bf6d74bd6d41594e65b084fd7c7e70cc07127cd4cac41fa92b7f4b65991437d07481a43aba96a3a',
      salt: 'b04b693a01ba750069a29bfb91d92606',
      role: 'admin',
      mfaEnabled: false,
      mfaSecret: null,
      studentId: 'GUSAC-ADM-001',
      wing: 'Core Executive & CyberSec',
      year: 'Executive Lead & Administrator',
      bio: 'Lead Administrator & Director at GUSAC GITAM.',
      isVerified: true,
      createdAt: '2026-01-10T10:00:00.000Z',
    },
    {
      id: 'usr_admin_01',
      firstName: 'GUSAC',
      lastName: 'Administrator',
      name: 'GUSAC Lead Administrator',
      email: 'admin@gusac.gitam.edu',
      phone: '+91 891 2840501',
      userType: 'gitam',
      collegeOrCompany: 'GITAM (Deemed to be University)',
      fromAddress: 'Visakhapatnam Campus, ICT Bhavan',
      passwordHash: '1f7830fbfa0784066815f1bdffbbe612:c71ddd969f1d1b4c0863ec8a0276d7dc00a2de79473a2e557d58329aa9b10af721177ea31b4b0be22aa69933d66d296c283c198f4c4e0b25c49ae70964729fd9',
      salt: '1f7830fbfa0784066815f1bdffbbe612',
      role: 'admin',
      mfaEnabled: true,
      mfaSecret: 'JBSWY3DPEHPK3PXP', // Base32 test secret for TOTP
      studentId: 'GUSAC-ADM-001',
      wing: 'Core Executive & CyberSec',
      year: 'Faculty & Administrative Lead',
      bio: 'Lead Administrator & Security Architect at GUSAC GITAM.',
      isVerified: true,
      createdAt: '2026-01-10T10:00:00.000Z',
    },
    {
      id: 'usr_student_01',
      firstName: 'Aarav',
      lastName: 'Sharma',
      name: 'Aarav Sharma',
      email: 'aarav@gitam.in',
      phone: '+91 94401 23456',
      userType: 'gitam',
      collegeOrCompany: 'GITAM Institute of Technology',
      fromAddress: 'Visakhapatnam, AP',
      passwordHash: 'de5eef9b3582f86f808f405cf4b1908d:e6746821f2fef01d6087b6c80c4b80d388aa9a2e613363fbb8e5145c2c5e25e60dd28c5e261f52141d65d92045b9c144b1604a9e2b5d74ff831ed41450868ce1',
      salt: 'de5eef9b3582f86f808f405cf4b1908d',
      role: 'user',
      mfaEnabled: false,
      mfaSecret: null,
      studentId: 'VU22CSEN010042',
      wing: 'Robotics & Automation',
      year: '3rd Year CSE',
      bio: 'Robotics enthusiast, ROS developer & Autonomous Rover lead.',
      isVerified: true,
      createdAt: '2026-02-01T12:00:00.000Z',
    },
    {
      id: 'usr_student_02',
      firstName: 'Sneha',
      lastName: 'Reddy',
      name: 'Sneha Reddy',
      email: 'sneha@gitam.in',
      phone: '+91 98480 54321',
      userType: 'gitam',
      collegeOrCompany: 'GITAM Institute of Technology',
      fromAddress: 'Hyderabad / Visakhapatnam',
      passwordHash: 'de5eef9b3582f86f808f405cf4b1908d:e6746821f2fef01d6087b6c80c4b80d388aa9a2e613363fbb8e5145c2c5e25e60dd28c5e261f52141d65d92045b9c144b1604a9e2b5d74ff831ed41450868ce1',
      salt: 'de5eef9b3582f86f808f405cf4b1908d',
      role: 'user',
      mfaEnabled: true,
      mfaSecret: 'HXDMVJECJJWSRB3H',
      studentId: 'VU23AERO020088',
      wing: 'Aeromodelling & UAVs',
      year: '2nd Year Aerospace',
      bio: 'Fixed-wing UAV designer and autonomous flight controller researcher.',
      isVerified: true,
      createdAt: '2026-02-15T09:30:00.000Z',
    },
    {
      id: 'usr_external_01',
      firstName: 'Priya',
      lastName: 'Nambiar',
      name: 'Priya Nambiar',
      email: 'priya.n@techcorp.in',
      phone: '+91 98765 43210',
      userType: 'external',
      collegeOrCompany: 'BITS Pilani / TechCorp India',
      fromAddress: 'Bengaluru, Karnataka',
      passwordHash: 'de5eef9b3582f86f808f405cf4b1908d:e6746821f2fef01d6087b6c80c4b80d388aa9a2e613363fbb8e5145c2c5e25e60dd28c5e261f52141d65d92045b9c144b1604a9e2b5d74ff831ed41450868ce1',
      salt: 'de5eef9b3582f86f808f405cf4b1908d',
      role: 'user',
      mfaEnabled: false,
      mfaSecret: null,
      studentId: null,
      wing: 'External Participant',
      year: 'Visiting Scholar / Industry Innovator',
      bio: 'External tech researcher & hackathon enthusiast participating from Bengaluru.',
      isVerified: true,
      createdAt: '2026-02-16T11:00:00.000Z',
    }
  ],

  sessions: new Map(), // token -> { userId, expiresAt, mfaVerified, createdAt }
  passwordResetTokens: new Map(), // tokenHash -> { userId, expiresAt, used }
  otpStore: new Map(), // email -> { otpCode, expiresAt, verified, userPayload, createdAt }

  wings: [
    {
      id: 'aeromodelling',
      title: 'Aeromodelling & UAVs',
      color: '#F5C400',
      icon: 'Plane',
      lead: 'Sneha Reddy & Team Aero',
      membersCount: 145,
      description: 'Designing autonomous UAVs, VTOL aircraft, quadcopters, and rocketry payloads with carbon-fiber airframes and custom autopilot firmware.',
      technologies: ['ArduPilot', 'PX4 Autopilot', 'SolidWorks CAD', 'CFD Analysis', 'FPV Telemetry'],
      labLocation: 'GUSAC Hangar 3, Tech Park',
      featuredProject: 'Garuda-X VTOL Surveillance Drone'
    },
    {
      id: 'robotics',
      title: 'Robotics & Automation',
      color: '#1E7B28',
      icon: 'Bot',
      lead: 'Aarav Sharma & K. Nikhil',
      membersCount: 220,
      description: 'Developing heavy-payload rovers, humanoid manipulators, inverse kinematics controllers, and SLAM-guided warehouse robots.',
      technologies: ['ROS2 Humble', 'Gazebo Sim', 'OpenCV', 'STM32 Microcontrollers', 'LiDAR Mapping'],
      labLocation: 'GUSAC Robotics Bay 1',
      featuredProject: 'Astra All-Terrain Planetary Rover'
    },
    {
      id: 'web-cybersec',
      title: 'Web, Cloud & CyberSecurity',
      color: '#124EB4',
      icon: 'ShieldCheck',
      lead: 'Vikram Nair & Security Core',
      membersCount: 310,
      description: 'Architecting ultra-secure fullstack platforms, zero-trust cloud pipelines, defensive SIEM monitors, and participating in global CTFs.',
      technologies: ['React/Next.js', 'Node.js', 'OWASP ASVS', 'Docker/K8s', 'Penetration Testing'],
      labLocation: 'Cyber Defense Lab, Room 402',
      featuredProject: 'GUSAC Zero-Trust Portal & CTF Arena'
    },
    {
      id: 'ai-ml',
      title: 'AI, ML & Data Science',
      color: '#C62828',
      icon: 'Cpu',
      lead: 'Dr. Ramesh M. & Student AI Cell',
      membersCount: 290,
      description: 'Training edge vision models, autonomous navigation neural nets, LLM agents for campus accessibility, and predictive medical sensors.',
      technologies: ['PyTorch', 'TensorFlow Lite', 'HuggingFace', 'CUDA', 'DeepSORT Tracking'],
      labLocation: 'AI Computing Hub, Lab 6',
      featuredProject: 'CampusNet Edge Vision & Smart AI Navigator'
    },
    {
      id: 'astronomy',
      title: 'Astronomy & Space Tech',
      color: '#6366F1',
      icon: 'Orbit',
      lead: 'T. Ananya & Space Enthusiasts',
      membersCount: 110,
      description: 'Deep-sky astrophotography, radio telescope signal analysis, CubeSat chassis design, and public stargazing night camps.',
      technologies: ['Radio Astronomy SDR', 'Telescope Tracking', 'Orbital Mechanics', 'Spectroscopy'],
      labLocation: 'GUSAC Rooftop Observatory',
      featuredProject: 'CubeSat Ground Station & Weather Beacon'
    },
    {
      id: 'iot-embedded',
      title: 'IoT & Hardware Systems',
      color: '#EC4899',
      icon: 'Zap',
      lead: 'P. Rohit & Embedded Wing',
      membersCount: 180,
      description: 'Custom multi-layer PCB design, low-power LoRaWAN networks, smart campus energy metering, and sensor fabrication.',
      technologies: ['Altium Designer', 'ESP32 / LoRa', 'C/C++ Embedded', 'MQTT / Zigbee'],
      labLocation: 'Hardware Fabrication Lab 2',
      featuredProject: 'Smart GITAM LoRa Energy & Air Quality Mesh'
    }
  ],

  projects: [
    {
      id: 'prj_01',
      title: 'Astra All-Terrain Planetary Rover',
      wing: 'Robotics & Automation',
      author: 'Aarav Sharma',
      authorId: 'usr_student_01',
      status: 'Approved',
      rating: 4.9,
      tags: ['ROS2', 'Autonomous Navigation', 'LiDAR', 'Robotics'],
      summary: 'A 6-wheel rocker-bogie exploration rover capable of autonomous obstacle avoidance, rock sample collection, and high-bandwidth telemetry over 2.4GHz.',
      fullDescription: 'The Astra Rover was built for University Rover Challenge (URC). Features 3D LiDAR point-cloud mapping, carbon-tubed rocker-bogie suspension, 4-DOF robotic arm with tactile gripper, and edge AI for spectral rock sample detection.',
      githubUrl: 'https://github.com/gusac/astra-planetary-rover',
      liveDemo: 'https://gusac.gitam.edu/projects/astra-rover',
      stars: 128,
      createdAt: '2026-01-15T14:20:00.000Z'
    },
    {
      id: 'prj_02',
      title: 'Garuda-X Hybrid VTOL UAV',
      wing: 'Aeromodelling & UAVs',
      author: 'Sneha Reddy',
      authorId: 'usr_student_02',
      status: 'Approved',
      rating: 4.8,
      tags: ['UAV', 'VTOL', 'PX4', 'Aerospace', 'Telemetry'],
      summary: 'Dual-tilt rotor hybrid VTOL combining vertical helicopter takeoff with efficient fixed-wing forward flight for 90-minute coastal surveillance missions.',
      fullDescription: 'Garuda-X delivers high-endurance disaster response surveillance. Employs carbon fiber sandwich composite airframe, dual failsafe GPS modules, custom encrypted MAVLink telemetry, and thermal IR camera payload.',
      githubUrl: 'https://github.com/gusac/garuda-x-vtol',
      liveDemo: 'https://gusac.gitam.edu/projects/garuda-x',
      stars: 94,
      createdAt: '2026-02-02T11:00:00.000Z'
    },
    {
      id: 'prj_03',
      title: 'CampusNet Edge Vision & Smart Surveillance',
      wing: 'AI, ML & Data Science',
      author: 'Vikram Nair',
      authorId: 'usr_admin_01',
      status: 'Approved',
      rating: 4.7,
      tags: ['PyTorch', 'Edge AI', 'Computer Vision', 'YOLOv10'],
      summary: 'Privacy-first edge AI system for campus pedestrian safety, parking density optimization, and automated emergency notification.',
      fullDescription: 'Utilizes on-premise Jetson Orin modules to analyze video streams locally without transmitting raw biometric video to cloud, adhering to OWASP & DPDP privacy principles.',
      githubUrl: 'https://github.com/gusac/campus-edge-ai',
      liveDemo: 'https://gusac.gitam.edu/projects/campusnet-ai',
      stars: 86,
      createdAt: '2026-02-10T16:45:00.000Z'
    },
    {
      id: 'prj_04',
      title: 'GITAM LoRaWAN Campus Mesh & Sensor Fabric',
      wing: 'IoT & Hardware Systems',
      author: 'P. Rohit',
      authorId: 'usr_student_01',
      status: 'Approved',
      rating: 4.6,
      tags: ['IoT', 'LoRaWAN', 'PCB Design', 'Smart Campus'],
      summary: 'A campus-wide sub-GHz network of 40+ solar-harvesting sensor nodes monitoring ambient temperature, solar irradiation, water storage levels, and power efficiency.',
      fullDescription: 'Custom 4-layer ultra-low power PCB nodes with deep-sleep power consumption under 15 microamperes. Connects to the central GUSAC dashboard with encrypted LoRa AES-128 packets.',
      githubUrl: 'https://github.com/gusac/gitam-lora-mesh',
      liveDemo: 'https://gusac.gitam.edu/projects/lora-mesh',
      stars: 62,
      createdAt: '2026-02-14T08:15:00.000Z'
    }
  ],

  events: [
    {
      id: 'evt_01',
      title: 'GUSAC Carnival & National Tech Fest 2026',
      date: 'March 14-16, 2026',
      time: '09:00 AM - 08:00 PM IST',
      venue: 'GUSAC Central Arena & Indoor Sports Complex, GITAM Visakhapatnam',
      category: 'Flagship Fest',
      badgeColor: '#F5C400',
      capacity: 1500,
      registeredCount: 840,
      status: 'upcoming',
      fee: 0,
      isPaid: false,
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=kYv_3_4c8qg',
      images: [
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'The biggest annual science & technology festival featuring 24-hour hackathons, RoboWars, Drone Racing Prix, Science Exhibits, and Tech Keynotes from ISRO and Google engineers.',
      details: 'GUSAC Carnival 2026 brings together over 1,500 collegiate innovators from across India. Featuring an intensive 24-hour software & hardware hackathon, high-voltage RoboWars arena, competitive FPV Drone Racing, and direct interaction with ISRO scientists and leading tech industry executives.',
      prizePool: '₹2,50,000 + Incubation Grants',
      tags: ['Hackathon', 'RoboWars', 'Drone Race', 'Keynotes'],
      isFeatured: true,
      schedule: [
        { time: 'Day 1 - 09:30 AM', title: 'Grand Inauguration & Keynote by ISRO Scientist', speaker: 'Dr. K. Sivan Fellowship Chair' },
        { time: 'Day 1 - 11:30 AM', title: '24-Hour Hardware & AI Hackathon Kickoff', speaker: 'GUSAC Innovation Cell' },
        { time: 'Day 2 - 10:00 AM', title: 'National RoboWars Combat Arena (Lightweight & Heavyweight)', speaker: 'Robotics Wing Leads' },
        { time: 'Day 2 - 02:00 PM', title: 'High-Speed FPV Drone Racing Grand Prix', speaker: 'Aero Wing Pilots' },
        { time: 'Day 3 - 04:00 PM', title: 'Project Exhibition & Grand Valedictory Ceremony', speaker: 'GITAM Vice-Chancellor' }
      ],
      coordinators: [
        { name: 'Sneha Reddy', role: 'Student President', phone: '+91 98480 54321' },
        { name: 'Vikram Nair', role: 'Technical Lead', phone: '+91 94401 98765' }
      ]
    },
    {
      id: 'evt_02',
      title: 'Autonomous Drone & PX4 Flight Control Bootcamp',
      date: 'March 22, 2026',
      time: '10:00 AM - 04:30 PM IST',
      venue: 'Aero Labs & Open Flight Grounds, Tech Park',
      category: 'Hands-on Workshop',
      badgeColor: '#124EB4',
      capacity: 60,
      registeredCount: 52,
      status: 'upcoming',
      fee: 299,
      isPaid: true,
      coverImage: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=y3oQnE4K3g8',
      images: [
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Comprehensive crash course on assembling carbon fiber quadcopters, flashing PX4 autopilot firmware, tuning PID gains, and programming autonomous waypoint missions with Python.',
      details: 'Learn how to build, wire, configure, and fly autonomous multirotors. Participants will flash Pixhawk 6C flight controllers, program MAVLink telemetry hooks in Python, and execute autonomous GPS waypoint navigation outdoors.',
      prizePool: 'Certification + Hardware Kits Included',
      tags: ['Drones', 'PX4', 'Aero', 'Hands-on'],
      isFeatured: false,
      schedule: [
        { time: '10:00 AM - 11:30 AM', title: 'Multirotor Dynamics & Avionics Architecture', speaker: 'Sneha Reddy' },
        { time: '11:45 AM - 01:15 PM', title: 'PX4 Firmware Configuration & Sensor Calibration', speaker: 'Garuda UAV Team' },
        { time: '02:00 PM - 03:30 PM', title: 'Python MAVLink Scripting for Autonomous Waypoints', speaker: 'Avionics Research Group' },
        { time: '03:45 PM - 04:30 PM', title: 'Live Outdoor Flight Field Testing & Certification', speaker: 'Certified DGCA Drone Pilot' }
      ],
      coordinators: [
        { name: 'Sneha Reddy', role: 'Aero Wing Lead', phone: '+91 98480 54321' }
      ]
    },
    {
      id: 'evt_03',
      title: 'OWASP & Zero-Trust Web Security Hackday',
      date: 'March 28, 2026',
      time: '11:00 AM - 06:00 PM IST',
      venue: 'Cyber Defense Lab & Virtual CTF Sandbox',
      category: 'CyberSecurity & CTF',
      badgeColor: '#C62828',
      capacity: 100,
      registeredCount: 78,
      status: 'upcoming',
      fee: 199,
      isPaid: true,
      images: [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Hands-on offensive & defensive security training. Learn Argon2id password security, MFA bypass prevention, RBAC architecture, and live exploitation in a controlled lab sandbox.',
      details: 'Dive into the world of offensive cyber defense and OWASP ASVS verification. Participants will attack vulnerable web targets in an isolated Docker sandbox, perform token forgery analysis, and deploy defensive zero-trust proxies.',
      prizePool: '₹30,000 + Bug Bounty Badges',
      tags: ['Security', 'OWASP ASVS', 'CTF', 'RBAC'],
      isFeatured: true,
      schedule: [
        { time: '11:00 AM - 12:30 PM', title: 'OWASP ASVS & Modern Cryptographic Vulnerabilities', speaker: 'Vikram Nair' },
        { time: '01:30 PM - 03:30 PM', title: 'Live Exploitation: Token Forgery & Privilege Escalation', speaker: 'Cyber Defense Cell' },
        { time: '03:45 PM - 05:30 PM', title: 'Speed Capture-the-Flag (CTF) Challenge Arena', speaker: 'Red Team Mentors' },
        { time: '05:30 PM - 06:00 PM', title: 'Awards Distribution & CTF Walkthrough', speaker: 'Faculty Advisory' }
      ],
      coordinators: [
        { name: 'Vikram Nair', role: 'CyberSec Lead', phone: '+91 94401 98765' }
      ]
    },
    {
      id: 'evt_04',
      title: 'Deep Sky Stargazing & Planetary Radio Observation Camp',
      date: 'April 05, 2026',
      time: '07:30 PM - 02:00 AM IST',
      venue: 'GUSAC Rooftop Observatory & Beachside Astro Base',
      category: 'Science Expedition',
      badgeColor: '#1E7B28',
      capacity: 120,
      registeredCount: 95,
      status: 'upcoming',
      fee: 0,
      isPaid: false,
      images: [
        'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Observe Jupiter\'s moons, Saturnian rings, and the Great Orion Nebula with our 14-inch Schmidt-Cassegrain telescope and custom SDR radio receiver.',
      details: 'An overnight stargazing and radio astronomy expedition along the Bay of Bengal coastline. Experience deep space astrophotography, listen to Jovian decametric radio bursts, and learn orbital mechanics hands-on.',
      prizePool: 'Astro-Photography Awards',
      tags: ['Astronomy', 'Stargazing', 'Telescope', 'Space'],
      isFeatured: false,
      schedule: [
        { time: '07:30 PM - 08:30 PM', title: 'Orientation & Deep-Sky Objects Navigation Briefing', speaker: 'T. Ananya' },
        { time: '08:45 PM - 11:30 PM', title: 'High-Magnification Optical Viewing with 14" SCT', speaker: 'Astro Wing Volunteers' },
        { time: '11:45 PM - 01:00 AM', title: 'SDR Radio Astronomy: Listening to Planetary Bursts', speaker: 'Radio Telemetry Group' },
        { time: '01:15 AM - 02:00 AM', title: 'Night-Sky Astrophotography Stacking Workshop', speaker: 'GUSAC Astro Photographers' }
      ],
      coordinators: [
        { name: 'T. Ananya', role: 'Astro Wing Lead', phone: '+91 97000 12345' }
      ]
    },
    // Past Events
    {
      id: 'evt_past_01',
      title: 'GUSAC National Hackathon & Innovation Summit 2025',
      date: 'October 18-20, 2025',
      time: 'Completed',
      venue: 'GUSAC Central Arena, GITAM Visakhapatnam',
      category: 'Flagship Fest',
      badgeColor: '#F5C400',
      capacity: 1000,
      registeredCount: 890,
      status: 'past',
      fee: 0,
      isPaid: false,
      attendeesCount: 850,
      images: [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'A 36-hour non-stop national hackathon tackling real-world problems in Edge AI, Maritime Defense, Smart Agriculture, and Aerospace Automation.',
      details: 'With 180+ teams from 45 universities across India, the 2025 Hackathon yielded 6 patent applications, 3 startup incubations at GITAM Venture Vault, and ₹2,00,000 distributed in prize money.',
      highlights: '180 teams competed, 3 startup spin-offs launched, 6 provisional patents filed.',
      winnerSummary: '1st Place: Team CyberSentinel (Autonomous Port Surveillance System, ₹1,00,000). 2nd Place: Team AeroKite (Hybrid VTOL Cargo, ₹60,000).',
      prizePool: '₹2,00,000 Awarded',
      tags: ['Hackathon', 'AI', 'Patents', 'HallOfFame'],
      isFeatured: false,
      schedule: [
        { time: 'Completed Oct 18, 10:00 AM', title: 'Opening Bell & Problem Statement Release', speaker: 'Industry Juries' },
        { time: 'Completed Oct 20, 04:00 PM', title: 'Grand Finalist Pitches & Prize Ceremony', speaker: 'VC & R&D Dean' }
      ]
    },
    {
      id: 'evt_past_02',
      title: 'Boeing National Aeromodelling Challenge & Drone Fly-Off',
      date: 'November 12, 2025',
      time: 'Completed',
      venue: 'GITAM Beachside Runway & Open Flying Field',
      category: 'Hands-on Workshop',
      badgeColor: '#124EB4',
      capacity: 300,
      registeredCount: 280,
      status: 'past',
      fee: 0,
      isPaid: false,
      attendeesCount: 280,
      images: [
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'High-speed autonomous drone slalom and fixed-wing payload drop challenge in partnership with Boeing India and IIT Delhi.',
      details: 'GUSAC Team Garuda took 1st place overall in the Fixed-Wing Maneuverability division with their Garuda-X prototype aircraft.',
      highlights: '42 fixed-wing aircraft flown, 0 major crashes, Gold medal secured by GUSAC Aero Wing.',
      winnerSummary: 'Champion: Team Garuda GUSAC (Gold Medal + ₹1,50,000 Research Grant).',
      prizePool: '₹1,50,000 Awarded',
      tags: ['Boeing', 'Aeromodelling', 'UAV', 'GoldMedal'],
      isFeatured: false,
      schedule: [
        { time: 'Completed Nov 12, 09:00 AM', title: 'Payload Precision Drop & Wind Shear Trials', speaker: 'Boeing Flight Evaluators' }
      ]
    },
    {
      id: 'evt_past_03',
      title: 'South India RoboWars Combat Arena 2024',
      date: 'December 05-06, 2024',
      time: 'Completed',
      venue: 'GUSAC Heavy Engineering Arena',
      category: 'Flagship Fest',
      badgeColor: '#1E7B28',
      capacity: 500,
      registeredCount: 460,
      status: 'past',
      fee: 0,
      isPaid: false,
      attendeesCount: 450,
      images: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Heavyweight bulletproof poly-carbonate battle arena hosting 30kg and 60kg pneumatic flippers and spinning drum combat bots.',
      details: 'Thrilling collisions, custom titanium armour fabrications, and remote telemetry control demonstrated by student robotics chapters across Southern India.',
      highlights: '28 combat robots entered the cage, bulletproof safety enclosures maintained.',
      winnerSummary: '1st Place: Bot Thor (GUSAC Robotics Wing, ₹75,000).',
      prizePool: '₹1,20,000 Awarded',
      tags: ['RoboWars', 'CombatRobotics', 'Pneumatics'],
      isFeatured: false,
      schedule: [
        { time: 'Completed Dec 06, 06:00 PM', title: 'Championship Bout & Demolition Derby', speaker: 'Robotics Judges' }
      ]
    }
  ],

  eventRegistrations: [
    {
      id: 'reg_01',
      eventId: 'evt_01',
      eventTitle: 'GUSAC Carnival & National Tech Fest 2026',
      userId: 'usr_student_01',
      userName: 'Aarav Sharma',
      userEmail: 'aarav@gitam.in',
      userPhone: '+91 94401 23456',
      userType: 'gitam',
      collegeOrCompany: 'GITAM Institute of Technology',
      ticketCode: 'GUSAC-EVT_01-8932',
      paymentStatus: 'free',
      paymentAmount: 0,
      paymentTxnId: 'TXN-FREE-8932',
      paymentMethod: 'Free Student Pass',
      registeredAt: '2026-02-18T10:00:00.000Z',
      passSentEmail: true,
      checkedIn: false,
      checkedInAt: null,
      checkedInBy: null
    },
    {
      id: 'reg_02',
      eventId: 'evt_02',
      eventTitle: 'Autonomous Drone & PX4 Flight Control Bootcamp',
      userId: 'usr_student_02',
      userName: 'Sneha Reddy',
      userEmail: 'sneha@gitam.in',
      userPhone: '+91 98480 54321',
      userType: 'gitam',
      collegeOrCompany: 'GITAM Institute of Technology',
      ticketCode: 'GUSAC-EVT_02-4721',
      paymentStatus: 'completed',
      paymentAmount: 299,
      paymentTxnId: 'UPI-RAZOR-472188',
      paymentMethod: 'UPI (PhonePe)',
      registeredAt: '2026-02-20T14:30:00.000Z',
      passSentEmail: true,
      checkedIn: true,
      checkedInAt: '2026-02-22T10:15:00.000Z',
      checkedInBy: 'admin@gusac.gitam.edu'
    },
    {
      id: 'reg_03',
      eventId: 'evt_01',
      eventTitle: 'GUSAC Carnival & National Tech Fest 2026',
      userId: 'usr_external_01',
      userName: 'Priya Nambiar',
      userEmail: 'priya.n@techcorp.in',
      userPhone: '+91 98765 43210',
      userType: 'external',
      collegeOrCompany: 'BITS Pilani / TechCorp India',
      ticketCode: 'GUSAC-EVT_01-6319',
      paymentStatus: 'free',
      paymentAmount: 0,
      paymentTxnId: 'TXN-FREE-6319',
      paymentMethod: 'External Attendee Pass',
      registeredAt: '2026-02-21T09:10:00.000Z',
      passSentEmail: true,
      checkedIn: false,
      checkedInAt: null,
      checkedInBy: null
    }
  ],

  // ==========================================
  // College Club Makerspace Hardware Inventory
  // ==========================================
  inventory: [
    {
      id: 'inv_01',
      name: 'NVIDIA Jetson Orin Nano Developer Kit (8GB)',
      category: 'Edge AI & Vision',
      totalQty: 12,
      availableQty: 7,
      specs: '40 TOPS AI compute, 1024-core Ampere GPU, 6-core ARM Cortex-A78AE',
      location: 'AI Lab Cabinet A3',
      wing: 'AI, ML & Data Science',
      imageIcon: 'Cpu',
      status: 'Available'
    },
    {
      id: 'inv_02',
      name: 'Holybro Pixhawk 6C Flight Controller + M10 GPS',
      category: 'Avionics & UAV',
      totalQty: 8,
      availableQty: 3,
      specs: 'STM32H743 MCU, Dual IMUs (ICM-42688-P), Barometer, PX4/ArduPilot native',
      location: 'Hangar 3 Avionics Rack',
      wing: 'Aeromodelling & UAVs',
      imageIcon: 'Plane',
      status: 'Available'
    },
    {
      id: 'inv_03',
      name: 'Slamtec RPLiDAR A2M12 (360° 12m Range)',
      category: 'Sensors & SLAM',
      totalQty: 10,
      availableQty: 4,
      specs: '16K samples/sec, 12m radius, 10Hz scan rate, ROS2 driver supported',
      location: 'Robotics Bay Storage B1',
      wing: 'Robotics & Automation',
      imageIcon: 'Bot',
      status: 'Available'
    },
    {
      id: 'inv_04',
      name: 'Tattu R-Line 4S 5200mAh 120C LiPo Battery Pack',
      category: 'Power & Propulsion',
      totalQty: 25,
      availableQty: 14,
      specs: '14.8V nominal, XT60 connector, 120C burst discharge, balance lead',
      location: 'Battery Safety Bunker H3',
      wing: 'Aeromodelling & UAVs',
      imageIcon: 'Zap',
      status: 'Available'
    },
    {
      id: 'inv_05',
      name: 'Bambu Lab X1-Carbon 3D Printer (Makerspace Station)',
      category: 'Fabrication & 3D Print',
      totalQty: 4,
      availableQty: 2,
      specs: 'Carbon-fiber reinforced printing, dual auto-bed leveling, AI lidar inspection',
      location: 'FabLab Station 1-4',
      wing: 'IoT & Hardware Systems',
      imageIcon: 'Layers',
      status: 'Available'
    },
    {
      id: 'inv_06',
      name: 'Rigol DS1054Z 4-Channel Digital Oscilloscope',
      category: 'Test & Measurement',
      totalQty: 6,
      availableQty: 5,
      specs: '50 MHz bandwidth, 1 GSa/s real-time sample rate, 24 Mpts memory',
      location: 'Hardware Bench Room 402',
      wing: 'Web, Cloud & CyberSecurity',
      imageIcon: 'Activity',
      status: 'Available'
    }
  ],

  inventoryRequests: [
    {
      id: 'req_01',
      inventoryId: 'inv_01',
      userId: 'usr_student_01',
      userName: 'Aarav Sharma',
      projectName: 'Astra Planetary Rover',
      requestedAt: '2026-02-20T10:30:00.000Z',
      status: 'Issued',
      returnDue: '2026-03-05'
    }
  ],

  // ==========================================
  // Club Student Council & Mentors
  // ==========================================
  council: [
    {
      id: 'tm_01',
      name: 'Sneha Reddy',
      role: 'Club President & UAV Lead',
      year: 'Final Year Aerospace',
      wing: 'Aeromodelling & UAVs',
      avatarLetter: 'S',
      bio: 'National Drone Racing Finalist, UAV autopilot researcher, leading 1,200+ GUSAC innovators.',
      badges: ['President', 'PX4 Autopilot', 'ISRO Intern'],
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    {
      id: 'tm_02',
      name: 'Aarav Sharma',
      role: 'Vice President & Robotics Lead',
      year: '3rd Year CSE (AI/ML)',
      wing: 'Robotics & Automation',
      avatarLetter: 'A',
      bio: 'Lead architect of Astra Planetary Rover for URC. ROS2 developer and mechatronics mentor.',
      badges: ['Vice-President', 'ROS2 Master', 'URC 2025 Finalist'],
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    {
      id: 'tm_03',
      name: 'Vikram Nair',
      role: 'Technical Secretary & CyberSec Head',
      year: 'Final Year IT',
      wing: 'Web, Cloud & CyberSecurity',
      avatarLetter: 'V',
      bio: 'Defensive SIEM architect, OWASP Top 10 trainer, 3x Smart India Hackathon national winner.',
      badges: ['Tech Secretary', 'OWASP ASVS', 'CTF Top 10'],
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    {
      id: 'tm_04',
      name: 'Dr. Ramesh M.',
      role: 'Faculty Mentor & Director of Innovation',
      year: 'Professor & Dean R&D',
      wing: 'Core Faculty Advisory',
      avatarLetter: 'R',
      bio: 'PhD in Autonomous Flight Systems, 15+ patents, guiding student startups and incubation grants.',
      badges: ['Faculty Advisor', '15+ Patents', 'DST Grants'],
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  ],

  // ==========================================
  // Hall of Fame & Trophies
  // ==========================================
  trophies: [
    {
      id: 'tr_01',
      title: 'Smart India Hackathon 2025 — 1st Place National Champions',
      category: 'National Hackathon',
      organizer: 'Ministry of Education & AICTE',
      team: 'Team CyberGusac (Led by Vikram Nair)',
      prize: '₹1,00,000 Cash Prize + Incubation',
      year: '2025'
    },
    {
      id: 'tr_02',
      title: 'University Rover Challenge (URC) — Top 10 Global Finalist',
      category: 'Space Robotics',
      organizer: 'The Mars Society, Utah, USA',
      team: 'Team Astra Rover (Led by Aarav Sharma)',
      prize: 'Global Top 10 Honors',
      year: '2025'
    },
    {
      id: 'tr_03',
      title: 'Boeing National Aeromodelling Prix — Gold Medal',
      category: 'Autonomous UAVs',
      organizer: 'Boeing India & IIT Delhi',
      team: 'Team Garuda (Led by Sneha Reddy)',
      prize: '₹1,50,000 Research Grant',
      year: '2025'
    }
  ],

  // ==========================================
  // Student Inductions / Applications
  // ==========================================
  inductions: [
    {
      id: 'ind_01',
      name: 'K. Nikhil',
      email: 'nikhil@gitam.in',
      studentId: 'VU24CSEN010992',
      year: '1st Year B.Tech CSE',
      wing: 'Robotics & Automation',
      interests: 'ROS2, Arduino, 3D Printing, Inverse Kinematics',
      appliedAt: '2026-02-19T14:00:00.000Z',
      status: 'Interview Scheduled'
    }
  ],

  auditLogs: [
    {
      id: 'log_01',
      timestamp: '2026-02-21T14:30:10.000Z',
      actor: 'admin@gusac.gitam.edu',
      actorRole: 'admin',
      action: 'ADMIN_LOGIN_SUCCESS',
      ip: '192.168.1.100',
      status: 'SUCCESS',
      details: 'MFA verified with TOTP code. Admin session established with secure cookie.',
      securityLevel: 'HIGH'
    },
    {
      id: 'log_02',
      timestamp: '2026-02-21T14:32:05.000Z',
      actor: 'system',
      actorRole: 'system',
      action: 'REGISTRATION_ROLE_SANITIZED',
      ip: '203.0.113.45',
      status: 'BLOCKED_MODIFICATION',
      details: 'User payload attempted role=admin; automatically stripped to role=user per backend security policy.',
      securityLevel: 'CRITICAL'
    },
    {
      id: 'log_03',
      timestamp: '2026-02-21T14:40:00.000Z',
      actor: 'admin@gusac.gitam.edu',
      actorRole: 'admin',
      action: 'SENSITIVE_ACTION_REAUTH_PASSED',
      ip: '192.168.1.100',
      status: 'SUCCESS',
      details: 'Re-authentication verified for project approval (prj_01).',
      securityLevel: 'HIGH'
    }
  ],

  siteContent: loadPersistentSiteContent()
};

export function loadPersistentSiteContent() {
  try {
    if (fs.existsSync(SITE_CONTENT_FILE)) {
      const raw = fs.readFileSync(SITE_CONTENT_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...getDefaultSiteContent(),
          ...parsed
        };
      }
    }
  } catch (err) {
    console.warn('[SiteContent Load Warning]:', err.message);
  }
  return getDefaultSiteContent();
}

export function savePersistentSiteContent(content) {
  try {
    fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
  } catch (err) {
    console.error('[SiteContent Save Error]:', err.message);
  }
}

export function getDefaultSiteContent() {
  return {
    topBar: {
      naacBadge: 'NAAC A++ Accredited',
      ugcText: 'UGC Category-1 Deemed to be University',
      announcementText: 'GITAM Visakhapatnam • Student Innovation & Research Hub Active',
      announcementActive: true,
      campuses: [
        { name: 'Visakhapatnam (Rushikonda Main)', tag: 'Central Prototyping Bay & Arena' },
        { name: 'ICT Bhavan Prototyping Bay', tag: '3D Printing & Electronics Lab' },
        { name: 'Beachside Aero Hangar 3', tag: 'Fixed-Wing Flight Runway & UAVs' },
        { name: 'Science Tower Observatory', tag: 'Rooftop Telemetry & Deep-Sky Dome' }
      ]
    },
    hero: {
      tagline: 'Visakhapatnam Student Innovation & Project Hub',
      headlineStart: 'Empowering Student Innovators to Build',
      headlineHighlight: 'Next-Gen Tech',
      subtitle: "Join GITAM Visakhapatnam's central multi-disciplinary innovation hub. Build autonomous UAVs, URC Mars rovers, edge AI neural networks, and defensive cybersecurity systems with 24/7 access.",
      uspBadges: [
        { text: '₹50+ Cr R&D Facilities', color: '#F5C400' },
        { text: '24/7 Keycard Entry', color: '#10B981' },
        { text: 'NVIDIA & Pixhawk Gear', color: '#3B82F6' },
        { text: 'ISRO & Boeing Mentorship', color: '#EF4444' }
      ],
      primaryBtnText: 'Explore Student Projects',
      primaryBtnLink: '/projects',
      secondaryBtnText: 'Events & Passes',
      secondaryBtnLink: '/events',
      metrics: [
        { value: '1,200+', label: 'Active Student Innovators', sub: 'Visakhapatnam Campus', color: 'yellow' },
        { value: '50+', label: 'Hardware Projects & Patents', sub: 'Govt. of India & AICTE', color: 'emerald' },
        { value: '₹5,00,000+', label: 'National Hackathon Grants Won', sub: 'SIH, URC & Boeing Prix', color: 'blue' },
        { value: '24/7', label: '24/7 Innovation Center Access', sub: 'With Optical Tracking', color: 'red' }
      ],
      membershipCard: {
        badge: 'GUSAC VISAKHAPATNAM COMMUNITY',
        title: 'Join Innovation Hub',
        freePill: '100% Free',
        submitButtonText: 'Register for GUSAC Membership',
        disclaimerText: 'By submitting, you agree to GUSAC community guidelines and student code of conduct.'
      }
    },
    introVideo: {
      badge: 'GUSAC Experience & Lab Tour',
      titleStart: "Inside GITAM's Flagship",
      titleHighlight: 'Innovation Hub',
      subtitle: 'Take a 3-minute video journey through our ₹50+ Cr research facilities, autonomous robotics bays, drone flight grounds, and 24/7 student innovation hubs.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      reelTag: '4K UHD INTRO REEL',
      centerTag: 'GUSAC Innovation Hub',
      duration: '03:45 DURATION',
      soundTag: 'SURROUND AUDIO',
      chapters: [
        { time: '00:15', tag: 'Aero', title: '1. Autonomous UAV Flight Strip' },
        { time: '01:05', tag: 'Robotics', title: '2. Mars Rover Obstacle Sandpit' },
        { time: '01:50', tag: 'Space', title: '3. Ground Station & Telescope' },
        { time: '02:40', tag: 'Prototyping', title: '4. High-Precision PCB Lab' }
      ],
      ctaPrompt: 'Want to work on these autonomous projects with 24/7 keycard access?',
      ctaBtnText: 'Explore Projects',
      ctaBtnLink: '/projects'
    },
    featuredProjectsHeading: {
      badge: 'Open Innovation Showcase',
      title: 'Featured Student Projects',
      subtitle: 'Groundbreaking hardware, AI systems, autonomous rovers, and security platforms built by GITAM students.'
    },
    location: {
      badge: 'Interactive Campus Venue',
      title: 'GUSAC Campus Venue & Prototyping Infrastructure',
      subtitle: 'Central hub located at ICT Bhavan, GITAM Visakhapatnam, housing autonomous robotics test beds, fixed-wing drone testing strips, and high-spec compute clusters.',
      facilities: [
        {
          id: 'central-labs',
          name: 'GUSAC Central Arena & Prototyping Center',
          building: 'ICT Bhavan Ground & 1st Floor',
          desc: 'Central multipurpose project bay, 3D printers, laser cutters, electronics benches & PCB prototyping.',
          color: 'border-yellow-500/50 text-yellow-400',
          badge: 'Main Hub'
        },
        {
          id: 'hangar-3',
          name: 'Aeromodelling & Flight Hangar 3',
          building: 'University Tech Park & Beachside Runway',
          desc: 'Fixed-wing carbon fiber fabrication, PX4 autopilot testing, and autonomous drone landing strips.',
          color: 'border-blue-500/50 text-blue-400',
          badge: 'Aero Labs'
        },
        {
          id: 'robotics-bay',
          name: 'Robotics Bay 1 & AI Computing Hub',
          building: 'Engineering Block 4, Room 402',
          desc: 'Mars rover test sandpit, ROS2 simulation computers, Jetson edge AI vision cluster, and inverted pendulum testing.',
          color: 'border-emerald-500/50 text-emerald-400',
          badge: 'Robotics & AI'
        },
        {
          id: 'observatory',
          name: 'Rooftop Astronomical Observatory',
          building: 'Science Tower Rooftop Dome',
          desc: '14-inch Schmidt-Cassegrain telescope, radio astronomy telemetry dish, and night-sky astrophotography base.',
          color: 'border-indigo-500/50 text-indigo-400',
          badge: 'Space Tech'
        }
      ],
      officePhone: '+91 (891) 2840501',
      officeEmail: 'gusac@gitam.edu',
      officeHours: '24/7 RFID Card Access (Mon - Sun)'
    },
    about: {
      badge: 'About GUSAC GITAM',
      title: 'Empowering Next-Generation Tech Leaders Since 2011',
      description: 'GUSAC (GITAM University Science and Activity Center) is an autonomous student innovation body incubating groundbreaking projects across aerospace, robotics, cybersecurity, space sciences, and IoT. With 24/7 keycard lab access, ₹50+ Cr in specialized prototyping machinery, and alumni at ISRO, Boeing, Google, and NASA.',
      stats: [
        { label: 'Active Members', value: '1,250+', color: 'white' },
        { label: 'Provisional Patents', value: '24 Filed', color: 'yellow-400' },
        { label: 'Startup Incubations', value: '12 Funded', color: 'emerald-400' }
      ],
      email: 'gusac@gitam.edu',
      phone: '+91 (891) 2840501',
      socialLinks: {
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        youtube: 'https://youtube.com',
        github: 'https://github.com'
      }
    },
    faq: {
      badge: 'Frequently Asked Questions',
      title: 'Everything You Need to Know About GUSAC',
      contactNotice: 'Have more questions? Reach out to our student council at gusac@gitam.edu',
      ctaText: 'Ready to join? Register for GUSAC Community & Events →',
      ctaLink: '/register',
      items: [
        {
          q: 'Who is eligible to join GUSAC and build projects?',
          a: 'All undergraduate, postgraduate, and PhD students from ANY department (CSE, ECE, Aerospace, Mechanical, Civil, Biotechnology, etc.) at GITAM are eligible. Prior hardware or coding experience is NOT mandatory for 1st-year students — passion and curiosity matter most!'
        },
        {
          q: 'How do student teams get funding and components for hardware projects?',
          a: 'Once you submit your project idea on the portal and it gets approved by the technical council, you can request direct component checkout (NVIDIA Jetson, Pixhawk, LiDARs, 3D printers) from the GUSAC hardware inventory, funded by university R&D grants.'
        },
        {
          q: 'How do I get 24/7 keycard access to GUSAC prototyping centers?',
          a: 'Active student members working on registered innovation projects or national competitions (Smart India Hackathon, URC, Boeing Aero Prix) are granted RFID student badge access for 24/7 facility entry after safety onboarding.'
        },
        {
          q: 'How can I participate in GUSAC hackathons and workshops?',
          a: 'All active fests, workshops, and hackathons are listed under the Events page. You can register directly with your student credentials or as an external participant to get a verified digital pass with instant QR verification.'
        },
        {
          q: 'Can I collaborate across multiple technical domains (e.g. AI + Robotics)?',
          a: 'Yes! GUSAC thrives on multidisciplinary collaboration. Many projects (like the Astra Planetary Rover or Garuda-X VTOL) involve members combining Robotics, Embedded IoT, and Edge AI.'
        }
      ]
    },
    council: [
      {
        id: 'c_01',
        name: 'Aarav Sharma',
        role: 'President & Technical Director',
        wing: 'Robotics & Automation',
        year: 'Final Year B.Tech CSE',
        bio: 'Team Lead for the Astra Planetary Rover. 2x SIH Winner, published researcher in autonomous SLAM navigation and inverse kinematics.',
        avatarLetter: 'A',
        badges: ['SIH Winner', 'URC Lead', 'ROS2 Pro'],
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'c_02',
        name: 'Sneha Reddy',
        role: 'Vice President & Aero Lead',
        wing: 'Aeromodelling & UAVs',
        year: '3rd Year Aerospace',
        bio: 'Chief designer for Garuda-X hybrid VTOL. Certified UAV remote pilot and composite airframe manufacturing specialist.',
        avatarLetter: 'S',
        badges: ['Boeing Prix', 'PX4 Firmware', 'VTOL Lead'],
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'c_03',
        name: 'Vikram Nair',
        role: 'CyberSecurity & Systems Lead',
        wing: 'Web & CyberSecurity',
        year: '4th Year IT',
        bio: 'Zero-Trust security architect. OWASP ASVS compliance researcher and top 100 CTF player globally.',
        avatarLetter: 'V',
        badges: ['ASVS Lead', 'CTF Top 100', 'Zero-Trust'],
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        id: 'c_04',
        name: 'Ananya Roy',
        role: 'AI & Data Science Lead',
        wing: 'AI & Machine Learning',
        year: '3rd Year AI/ML',
        bio: 'Specializing in computer vision on edge Jetson hardware. Created campus navigation neural network with 98.4% accuracy.',
        avatarLetter: 'A',
        badges: ['Edge AI', 'PyTorch', 'NVIDIA Grant'],
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    ],
    footer: {
      brandDescription: 'GUSAC (GITAM University Science and Activity Center) is the premier student innovation ecosystem, incubating autonomous robotics, UAV aeromodelling, deep AI, space science, and next-generation cybersecurity.',
      securityBadge: 'OWASP ASVS 4.0 Level 2 Verified Architecture',
      address: 'GUSAC Central Labs, GITAM Deemed to be University, Visakhapatnam, AP, India',
      email: 'gusac@gitam.edu',
      copyright: `© ${new Date().getFullYear()} GUSAC — GITAM University Science and Activity Center. All rights reserved.`
    }
  };
}
