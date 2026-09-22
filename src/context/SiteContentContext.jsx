import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

// Comprehensive default structure ensuring zero runtime null reference errors
export const FALLBACK_SITE_CONTENT = {
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
    ]
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

import { broadcastUpdate, subscribeToUpdates } from '../utils/sync';

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [siteContent, setSiteContent] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cached = localStorage.getItem('gusac_site_content');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            return { ...FALLBACK_SITE_CONTENT, ...parsed };
          }
        }
      }
    } catch (e) {
      // ignore JSON parse or storage errors
    }
    return FALLBACK_SITE_CONTENT;
  });
  const [loading, setLoading] = useState(true);

  const fetchSiteContent = async () => {
    try {
      const data = await apiRequest('/site-content');
      if (data?.siteContent) {
        setSiteContent((prev) => {
          const merged = {
            ...prev,
            ...data.siteContent
          };
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('gusac_site_content', JSON.stringify(merged));
            }
          } catch (e) {}
          return merged;
        });
      }
    } catch (e) {
      console.warn('Using local fallback site content:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial server fetch
    fetchSiteContent();

    // 2. Real-time subscription to admin updates across tabs/windows
    const unsubscribe = subscribeToUpdates((event) => {
      if (event.type === 'SITE_CONTENT_UPDATED' && event.payload) {
        setSiteContent((prev) => ({
          ...prev,
          ...event.payload
        }));
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('gusac_site_content', JSON.stringify(event.payload));
          }
        } catch (e) {}
      }
    });

    // 3. Re-validate on tab focus (when user switches back to this tab)
    const handleFocus = () => {
      fetchSiteContent();
    };
    window.addEventListener('focus', handleFocus);

    // 4. Background polling every 12 seconds for seamless multi-device updates
    const intervalId = setInterval(fetchSiteContent, 12000);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  const saveSiteContent = async (updatedContent) => {
    try {
      const res = await apiRequest('/admin/site-content', {
        method: 'PUT',
        body: { siteContent: updatedContent }
      });
      if (res?.siteContent) {
        setSiteContent(res.siteContent);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('gusac_site_content', JSON.stringify(res.siteContent));
          }
        } catch (e) {}
        // Broadcast to user panel and all other open tabs immediately!
        broadcastUpdate('SITE_CONTENT_UPDATED', res.siteContent);
      }
      return { success: true, message: res.message || 'Content updated successfully' };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update site content' };
    }
  };

  const resetSiteContent = async () => {
    try {
      const res = await apiRequest('/admin/site-content/reset', {
        method: 'POST'
      });
      if (res?.siteContent) {
        setSiteContent(res.siteContent);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('gusac_site_content', JSON.stringify(res.siteContent));
          }
        } catch (e) {}
        // Broadcast reset to user panel
        broadcastUpdate('SITE_CONTENT_UPDATED', res.siteContent);
      }
      return { success: true, message: res.message || 'Content reset successfully' };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to reset content' };
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        siteContent,
        loading,
        saveSiteContent,
        resetSiteContent,
        refreshSiteContent: fetchSiteContent
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    return {
      siteContent: FALLBACK_SITE_CONTENT,
      loading: false,
      saveSiteContent: async () => ({ success: false, error: 'Context unavailable' }),
      resetSiteContent: async () => ({ success: false, error: 'Context unavailable' }),
      refreshSiteContent: () => {}
    };
  }
  return context;
}
