import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import GitamHeroSplit from '../components/GitamHeroSplit';
import GusacIntroVideo from '../components/GusacIntroVideo';
import GusacLocationMap from '../components/GusacLocationMap';
import StudentStories from '../components/StudentStories';
import ClubFaq from '../components/ClubFaq';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '../context/SiteContentContext';
import {
  Rocket,
  ShieldCheck,
  Bot,
  Plane,
  Cpu,
  Orbit,
  Zap,
  ArrowRight,
  Sparkles,
  Calendar,
  FolderGit2,
  Lock,
  CheckCircle2,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  Star,
  Activity,
  Wrench,
  Trophy,
  GraduationCap,
  History,
  Phone,
  Mail,
  MapPin,
  Share2,
  Globe,
  Camera,
  Ticket
} from 'lucide-react';

export default function Home() {
  const { siteContent } = useSiteContent();
  const about = siteContent?.about || {};
  const featHeading = siteContent?.featuredProjectsHeading || {};

  const [pulseData, setPulseData] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [trophies, setTrophies] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [projRes, evRes, plRes, trRes] = await Promise.all([
        apiRequest('/projects'),
        apiRequest('/events'),
        apiRequest('/club/pulse'),
        apiRequest('/club/trophies')
      ]);
      setFeaturedProjects(projRes.projects?.slice(0, 3) || []);
      setUpcomingEvents(evRes.upcoming?.slice(0, 2) || evRes.events?.slice(0, 2) || []);
      setPastEvents(evRes.past?.slice(0, 2) || []);
      setPulseData(plRes);
      setTrophies(trRes.trophies || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen space-y-16 lg:space-y-24">
      
      {/* ========================================================
          FAST ACCESS GATEWAY: MEMBER & ADMIN LOGIN BAR
         ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono shadow-xl">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span className="font-bold text-white">GUSAC PORTAL GATEWAYS:</span>
            <span className="text-slate-400 hidden sm:inline">Access Student Passes &amp; Administrative Controls</span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Member Login
            </Link>

            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold transition-colors flex items-center gap-1.5 group"
              title="Only admin can give the attendance"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Admin Login</span>
              <span className="text-[10px] bg-red-500/30 text-red-200 px-1.5 py-0.5 rounded font-bold ml-1">
                [ Attendance Scanner ]
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          1. GITAM UNIVERSITY SPLIT HERO (IN ADMISSION PORTAL STYLE)
         ======================================================== */}
      <GitamHeroSplit pulseData={pulseData} />

      {/* ========================================================
          2. GUSAC INTRO VIDEO & LAB TOUR REEL
         ======================================================== */}
      <GusacIntroVideo />

      {/* ========================================================
          3. FEATURED STUDENT PROJECTS & INNOVATIONS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" /> {featHeading.tag || 'Open Innovation Showcase'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              {featHeading.title || 'Featured Student Projects'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              {featHeading.description || 'Groundbreaking hardware, AI systems, autonomous rovers, and security platforms built by GITAM students.'}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/projects" className="flex items-center gap-1">
              Browse All Projects <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 flex flex-col justify-between glass-card-hover group relative overflow-hidden transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {proj.wing}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-yellow-400 font-mono bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>{proj.stars || 0}</span>
                  </div>
                </div>

                <Link to="/projects">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {proj.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {proj.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tags?.slice(0, 3).map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-slate-300 border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">By {proj.author}</span>
                <Link
                  to="/projects"
                  className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  View Project <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. UPCOMING & PAST EVENTS SHOWCASE
         ======================================================== */}
      <section className="py-16 bg-slate-950/70 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Upcoming Events Block */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Flagship Fests &amp; Hackathons
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  Upcoming GUSAC Events
                </h2>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/events" className="flex items-center gap-1">
                  Browse All Events &amp; Passes <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between glass-card-hover"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-mono font-bold"
                        style={{ backgroundColor: `${ev.badgeColor}20`, color: ev.badgeColor }}
                      >
                        {ev.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {ev.registeredCount} / {ev.capacity} Slots
                      </span>
                    </div>

                    <Link to={`/events/${ev.id}`}>
                      <h3 className="text-xl font-bold text-white hover:text-blue-400 transition-colors mb-2">
                        {ev.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        {ev.date} • {ev.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-yellow-400" />
                        Prize Pool: {ev.prizePool}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 truncate max-w-[200px]">{ev.venue}</span>
                    <Button asChild variant="default" size="sm">
                      <Link to={`/events/${ev.id}`} className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5" /> Register / View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Events & Gallery Preview Block */}
          {pastEvents.length > 0 && (
            <div className="pt-8 border-t border-slate-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-bold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> Retrospectives &amp; Gallery
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Past Event Highlights &amp; Winners
                  </h2>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300">
                  <Link to="/events" className="flex items-center gap-1">
                    View Past Photo Galleries →
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pastEvents.map((pev) => (
                  <div key={pev.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                          {pev.category} • Completed
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {pev.attendeesCount} Turnout
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white">{pev.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2">{pev.description}</p>
                      {pev.winnerSummary && (
                        <p className="text-xs font-mono text-emerald-400 font-bold pt-1">
                          🏆 {pev.winnerSummary}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-mono">{pev.date}</span>
                      <Link to={`/events/${pev.id}`} className="text-xs font-mono text-blue-400 hover:text-blue-300 font-bold">
                        Read Event Recap →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          7. GUSAC LOCATION MAP & CAMPUS VENUE
         ======================================================== */}
      <GusacLocationMap />

      {/* ========================================================
          8. ABOUT US & CONTACT INFORMATION
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c1424] via-slate-900 to-[#090e18] border border-blue-500/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> {about.tag || 'About GUSAC GITAM'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {about.title || 'Empowering Next-Generation Tech Leaders Since 2011'}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {about.story || 'GUSAC (GITAM University Science and Activity Center) is an autonomous student innovation body incubating groundbreaking projects across aerospace, robotics, cybersecurity, space sciences, and IoT. With 24/7 keycard lab access, ₹50+ Cr in specialized prototyping machinery, and alumni at ISRO, Boeing, Google, and NASA.'}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                {(about.stats || [
                  { label: 'Active Members', value: '1,250+' },
                  { label: 'Provisional Patents', value: '24 Filed' },
                  { label: 'Startup Incubations', value: '12 Funded' }
                ]).map((st, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{st.label}</span>
                    <span className="text-lg font-bold text-yellow-400">{st.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-black/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-yellow-400" /> Connect on Social Media
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {(Array.isArray(about.socialLinks)
                  ? about.socialLinks
                  : [
                      { platform: 'Instagram', url: about.socialLinks?.instagram || 'https://instagram.com', color: 'text-pink-400' },
                      { platform: 'LinkedIn', url: about.socialLinks?.linkedin || 'https://linkedin.com', color: 'text-blue-400' },
                      { platform: 'YouTube', url: about.socialLinks?.youtube || 'https://youtube.com', color: 'text-red-400' },
                      { platform: 'GitHub', url: about.socialLinks?.github || 'https://github.com', color: 'text-slate-400' }
                    ]
                ).map((soc, socIdx) => (
                  <a
                    key={socIdx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-500/60 hover:text-white transition-colors flex items-center gap-2 text-slate-300 truncate"
                  >
                    <Globe className={`w-4 h-4 ${soc.color || 'text-yellow-400'}`} /> {soc.platform}
                  </a>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs font-mono text-slate-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-yellow-400" /> {about.contactEmail || 'gusac@gitam.edu'}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {about.contactPhone || '+91 (891) 2840501'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          9. FAQ ACCORDION
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ClubFaq />
      </section>

    </div>
  );
}
