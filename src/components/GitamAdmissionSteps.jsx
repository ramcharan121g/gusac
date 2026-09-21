import React from 'react';
import { UserPlus, Code2, Users, KeyRound, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export default function GitamAdmissionSteps() {
  const steps = [
    {
      number: '01',
      title: 'Online Application & Wing Choice',
      subtitle: 'Apply in 60 seconds on the portal',
      desc: 'Submit your student details, choose your primary innovation wing (Aero, Robotics, CyberSec, AI, Space, IoT), and share your project aspirations.',
      color: '#F5C400',
      icon: UserPlus,
      tag: 'Step 1 • Open Now'
    },
    {
      number: '02',
      title: 'Hands-on Technical Sprint',
      subtitle: '2-day collaborative mini-hack',
      desc: 'Participate in a hands-on technical workshop at GUSAC Labs. Build a mini prototype, write ROS2 code, flash firmware, or solve a CTF challenge.',
      color: '#1E7B28',
      icon: Code2,
      tag: 'Step 2 • Lab Task'
    },
    {
      number: '03',
      title: 'Council Onboarding Interview',
      subtitle: 'Domain Leads & Mentor interaction',
      desc: 'Have a friendly one-on-one discussion with our student leads and faculty advisors about your team fit, innovation ideas, and schedule.',
      color: '#124EB4',
      icon: Users,
      tag: 'Step 3 • Screening'
    },
    {
      number: '04',
      title: '24/7 RFID Keycard & Lab Allocation',
      subtitle: 'Official Induction into GUSAC',
      desc: 'Receive your verified digital student badge, 24/7 keycard entry to Hangar 3 / Robotics Bay, and instant access to the makerspace component checkout.',
      color: '#C62828',
      icon: KeyRound,
      tag: 'Step 4 • Verified Entry'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 4-Step Induction Roadmap
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
            How to Join the GUSAC Innovation Elite
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Our streamlined 4-step onboarding process ensures every student from freshman to senior gets the resources, mentorship, and equipment they need.
          </p>
        </div>

        <Button asChild variant="gold" size="lg" className="self-start md:self-auto font-bold">
          <Link to="/inductions">
            Start Step 1 Application <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* 4 Colored Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.number}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between glass-card-hover group relative overflow-hidden space-y-4"
            >
              {/* Corner Ambient Glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none"
                style={{ backgroundColor: st.color }}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-black font-mono tracking-tighter"
                    style={{ color: st.color }}
                  >
                    {st.number}
                  </span>
                  <div
                    className="p-2.5 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: `${st.color}20`, color: st.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-slate-400">
                    {st.tag}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-yellow-400 transition-colors leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {st.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                  {st.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono font-semibold" style={{ color: st.color }}>
                <span>Phase {st.number} Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
