import React, { useState } from 'react';
import { Phone, Mail, MapPin, Award, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

export default function GitamTopBar() {
  const { siteContent } = useSiteContent();
  const topBar = siteContent?.topBar || {};
  const campuses = topBar.campuses?.length ? topBar.campuses : [
    { name: 'Visakhapatnam (Rushikonda Main)', tag: 'Central Prototyping Bay & Arena' },
    { name: 'ICT Bhavan Prototyping Bay', tag: '3D Printing & Electronics Lab' },
    { name: 'Beachside Aero Hangar 3', tag: 'Fixed-Wing Flight Runway & UAVs' },
    { name: 'Science Tower Observatory', tag: 'Rooftop Telemetry & Deep-Sky Dome' }
  ];

  const [selectedCampus, setSelectedCampus] = useState(campuses[0]?.name || 'Visakhapatnam (Rushikonda Main)');
  const [openCampus, setOpenCampus] = useState(false);

  return (
    <div className="bg-[#05070d] border-b border-slate-800 text-slate-300 text-[11px] font-mono py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left: NAAC A++ & Category 1 Status */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20 text-[10px]">
            <Award className="w-3 h-3 text-yellow-400" />
            {topBar.naacBadge || 'NAAC A++ Accredited'}
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">{topBar.ugcText || 'UGC Category-1 Deemed to be University'}</span>
          {topBar.announcementActive !== false && (
            <>
              <span className="hidden lg:inline text-slate-500">|</span>
              <span className="hidden lg:inline text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {topBar.announcementText || 'GITAM Visakhapatnam • Student Innovation & Research Hub Active'}
              </span>
            </>
          )}
        </div>

        {/* Right: Campus Selector & Contact */}
        <div className="flex items-center gap-4 text-slate-400">
          
          {/* Campus Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenCampus(!openCampus)}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors py-0.5"
            >
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>Campus: <strong className="text-white">{selectedCampus}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openCampus && (
              <div className="absolute right-0 mt-1 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider px-2 py-1 font-bold border-b border-slate-800">
                  Select Innovation Campus
                </div>
                {campuses.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCampus(c.name);
                      setOpenCampus(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col ${
                      selectedCampus === c.name ? 'bg-blue-600/20 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{c.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          <a href="mailto:gusac@gitam.edu" className="hidden sm:flex items-center gap-1 hover:text-blue-400 transition-colors">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>gusac@gitam.edu</span>
          </a>

          <a href="tel:+918912840501" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Phone className="w-3 h-3 text-yellow-400" />
            <span>0891-2840501</span>
          </a>
        </div>

      </div>
    </div>
  );
}
