import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useSiteContent } from '../context/SiteContentContext';
import {
  Award,
  Users,
  Trophy,
  Star,
  Sparkles,
  Code2,
  Globe,
  GraduationCap,
  Medal,
  CheckCircle2
} from 'lucide-react';

export default function Team() {
  const { siteContent } = useSiteContent();
  const councilCms = siteContent?.council || {};

  const [council, setCouncil] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const [cRes, tRes] = await Promise.all([
        apiRequest('/club/council'),
        apiRequest('/club/trophies')
      ]);
      setCouncil(cRes.council || []);
      setTrophies(tRes.trophies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activeCouncilMembers = councilCms.members?.length ? councilCms.members : council;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-400">
          <Users className="w-3.5 h-3.5" />
          <span>{councilCms.tag || 'Leadership & Faculty Mentorship'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {councilCms.title || 'GUSAC Council & Hall of Fame'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {councilCms.description || 'The student leads, domain directors, faculty advisors, and national champions driving innovation at GITAM University.'}
        </p>
      </div>

      {/* Hall of Fame & Trophies Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">National &amp; Global Trophy Cabinet</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trophies.map((tr) => (
            <div
              key={tr.id}
              className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#111728] to-slate-900 border border-yellow-500/30 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shadow-md">
                <Medal className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-wider block">
                  {tr.category} • {tr.year}
                </span>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">
                  {tr.title}
                </h3>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                <p><strong>Organizer:</strong> {tr.organizer}</p>
                <p><strong>Team:</strong> {tr.team}</p>
                <p className="text-emerald-400 font-bold"><strong>Grant / Prize:</strong> {tr.prize}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Executive Council & Mentors */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Student Executive Body &amp; Mentors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCouncilMembers.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between glass-card-hover space-y-4"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                  {member.avatarLetter}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <span className="text-xs font-mono text-yellow-400 font-bold block">{member.role}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{member.year} • {member.wing}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {member.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {member.badges?.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-slate-300 border border-slate-800"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center gap-3 text-slate-400">
                <a href={member.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors" title="LinkedIn Profile">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={member.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="GitHub / Portfolio">
                  <Code2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
