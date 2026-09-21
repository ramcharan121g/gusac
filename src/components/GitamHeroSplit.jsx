import React from 'react';
import { Link } from 'react-router-dom';
import GusacLogo from './GusacLogo3D';
import HeroParticles from './HeroParticles';
import { Button } from './ui/button';
import { useSiteContent } from '../context/SiteContentContext';
import {
  Sparkles,
  ArrowRight,
  FolderGit2,
  Radio
} from 'lucide-react';

export default function GitamHeroSplit({ pulseData }) {
  const { siteContent } = useSiteContent();
  const hero = siteContent?.hero || {};

  const uspBadges = hero.uspBadges?.length ? hero.uspBadges : [
    { text: '₹50+ Cr R&D Facilities', color: '#F5C400' },
    { text: '24/7 Keycard Entry', color: '#10B981' },
    { text: 'NVIDIA & Pixhawk Gear', color: '#3B82F6' },
    { text: 'ISRO & Boeing Mentorship', color: '#EF4444' }
  ];

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#080c14] via-[#0b101c] to-[#080c14]">
      <HeroParticles />

      {/* Ambient background glow matching GUSAC logo colors */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Hero Content */}
        <div className="max-w-4xl mx-auto space-y-7 text-center flex flex-col items-center">
          
          {/* University Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white">GITAM Visakhapatnam Main Campus</span>
            <span className="text-slate-600">|</span>
            <span className="text-yellow-400 font-bold">{hero.tagline || 'Student Innovation & Project Hub'}</span>
          </div>

          {/* Exact GUSAC Logo in Clean Spotlight Banner */}
          <div className="flex flex-col items-center">
            <GusacLogo size="lg" withBanner={true} />
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mt-2 font-bold">
              GITAM Visakhapatnam Science and Activity Center
            </span>
          </div>

          {/* High Impact Headline using GUSAC Vibe Colors */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] max-w-3xl">
            {hero.headlineStart || hero.headlinePre || 'Empowering Student Innovators to Build'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-blue-400">
              {hero.headlineHighlight || 'Next-Gen Tech'}
            </span>
            {hero.headlinePost ? ` ${hero.headlinePost}` : '.'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
            {hero.subtitle || hero.description || "Join GITAM Visakhapatnam's central multi-disciplinary innovation hub. Build autonomous UAVs, URC Mars rovers, edge AI neural networks, and defensive cybersecurity systems with 24/7 access."}
          </p>

          {/* University USPs with GUSAC 4-Color Badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-1 text-xs font-mono">
            {uspBadges.map((usp, i) => (
              <div key={i} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 shadow-md">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: usp.color || '#F5C400' }} />
                <span>{usp.text}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild variant="gold" size="lg" className="gap-2 shadow-xl shadow-yellow-500/20 font-bold px-7">
              <Link to={hero.primaryBtnLink || hero.primaryButtonLink || '/projects'}>
                <FolderGit2 className="w-4 h-4 text-black" />
                {hero.primaryBtnText || hero.primaryButtonText || 'Explore Student Projects'}
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2 bg-slate-900/90 hover:bg-slate-800 border-slate-700 px-7">
              <Link to={hero.secondaryBtnLink || hero.secondaryButtonLink || '/events'}>
                <Sparkles className="w-4 h-4 text-yellow-400" />
                {hero.secondaryBtnText || hero.secondaryButtonText || 'Events & Passes'}
              </Link>
            </Button>
          </div>

          {/* Live Campus Lab Pulse */}
          {pulseData && (
            <div className="max-w-xl w-full p-3 rounded-2xl bg-black/60 border border-slate-800 flex items-center justify-center gap-3 overflow-hidden text-xs font-mono shadow-inner">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>LIVE LAB ACTIVITY:</span>
              </div>
              <div className="text-slate-300 truncate">
                <span className="text-yellow-400 font-bold">{pulseData.recentActivities?.[0]?.user}</span>{' '}
                {pulseData.recentActivities?.[0]?.action}{' '}
                <span className="text-slate-500">({pulseData.recentActivities?.[0]?.time})</span>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM METRICS RIBBON */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
          {(hero.metrics?.length ? hero.metrics : [
            { value: '1,200+', label: 'Active Student Innovators', sub: 'Visakhapatnam Campus', color: 'yellow' },
            { value: '50+', label: 'Hardware Projects & Patents', sub: 'Govt. of India & AICTE', color: 'emerald' },
            { value: '₹5,00,000+', label: 'National Hackathon Grants Won', sub: 'SIH, URC & Boeing Prix', color: 'blue' },
            { value: '24/7', label: '24/7 Innovation Center Access', sub: 'With Optical Tracking', color: 'red' }
          ]).map((m, idx) => {
            const borderMap = {
              yellow: 'border-yellow-500/20 text-yellow-400',
              emerald: 'border-emerald-500/20 text-emerald-400',
              blue: 'border-blue-500/20 text-blue-400',
              red: 'border-red-500/20 text-red-400'
            };
            const col = borderMap[m.color] || 'border-blue-500/20 text-blue-400';
            return (
              <div key={idx} className={`p-4 rounded-2xl bg-slate-900/60 border ${col.split(' ')[0]} backdrop-blur-sm text-left`}>
                <div className={`text-2xl sm:text-3xl font-black font-mono ${col.split(' ')[1]}`}>{m.value}</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">{m.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{m.sub}</div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
