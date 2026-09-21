import React from 'react';
import { Quote, Sparkles, Star, GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentStories() {
  const stories = [
    {
      id: 1,
      name: 'Priya Sundaram',
      batch: 'Class of 2025 • Aerospace',
      role: 'Former Aero Lead → Now Avionics Engineer at ISRO',
      avatar: 'P',
      avatarBg: 'from-yellow-600 to-amber-600',
      story: 'Joining GUSAC in my 1st year was a turning point. We assembled fixed-wing UAVs from scratch in Hangar 3 and tuned PX4 flight controllers. That hands-on hardware experience was the #1 topic in my ISRO technical interview!',
      achievement: 'Gold Medal at Boeing Aero Prix'
    },
    {
      id: 2,
      name: 'Rohan Verma',
      batch: 'Class of 2025 • Computer Science',
      role: 'Former CyberSec Lead → Now Security Engineer at Microsoft',
      avatar: 'R',
      avatarBg: 'from-blue-600 to-indigo-600',
      story: 'GUSAC gave us a real sandbox server to build zero-trust architectures and host university CTFs. The emphasis on OWASP ASVS standards and defensive engineering gave me an unmatched edge over regular coursework.',
      achievement: '3x National CTF Champion'
    },
    {
      id: 3,
      name: 'Ananya Rao',
      batch: 'Class of 2026 • Mechanical & Robotics',
      role: 'Current Rover Lead & URC 2025 Finalist',
      avatar: 'A',
      avatarBg: 'from-emerald-600 to-teal-600',
      story: 'At GUSAC, nobody tells you to just study theory. We design rocker-bogie suspensions, mill custom PCBs, and run ROS2 point-clouds in Robotics Bay 1. The club budget provided all the LiDARs and Jetson modules we needed!',
      achievement: 'URC Utah Global Finalist'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Innovator Journeys
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-white mt-1">
            From GUSAC Labs to Global Impact
          </h3>
        </div>
        <Link to="/team" className="text-xs font-mono text-blue-400 hover:underline">
          Meet current Council &amp; Mentors →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((st) => (
          <div
            key={st.id}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between glass-card-hover space-y-4 relative"
          >
            <Quote className="w-8 h-8 text-slate-800 absolute top-4 right-4" />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${st.avatarBg} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {st.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{st.name}</h4>
                  <p className="text-[11px] font-mono text-yellow-400 mt-0.5">{st.role}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{st.batch}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{st.story}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-400 font-bold">● {st.achievement}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
