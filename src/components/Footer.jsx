import React from 'react';
import { Link } from 'react-router-dom';
import GusacLogo3D from './GusacLogo3D';
import { ShieldCheck, MapPin, Mail, Globe, Award, ExternalLink, Terminal } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function Footer() {
  const { siteContent } = useSiteContent();
  const footer = siteContent?.footer || {};

  return (
    <footer className="relative bg-[#06080d] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/70">
          
          {/* Col 1: GUSAC Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <GusacLogo3D size="sm" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {footer.description ? (
                <span>{footer.description}</span>
              ) : (
                <>
                  <strong className="text-white">GUSAC</strong> (GITAM University Science and Activity Center) is the premier student innovation ecosystem, incubating autonomous robotics, UAV aeromodelling, deep AI, space science, and next-generation cybersecurity.
                </>
              )}
            </p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{footer.securityBadge || 'Enterprise Zero-Trust Verified Architecture'}</span>
            </div>

            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {footer.address || 'GUSAC Central Labs, GITAM Deemed to be University, Visakhapatnam, AP, India'}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-yellow-400" />
                {footer.email || 'gusac@gitam.edu'}
              </p>
            </div>
          </div>

          {/* Col 2: Student Innovation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              Student Innovation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className="hover:text-blue-400 transition-colors">
                  Student Projects Directory
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-emerald-400 transition-colors">
                  Submit Project Idea
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-yellow-400 transition-colors">
                  Flagship Hackathons &amp; Fests
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-purple-400 transition-colors">
                  Council &amp; Hall of Fame
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-red-400 transition-colors">
                  Student Digital ID Pass
                </Link>
              </li>
              <li>
                <a href="#location-map" className="hover:text-pink-400 transition-colors">
                  Campus Innovation Centers
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Prototyping Labs & Bays */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              Prototyping Labs &amp; Bays
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#location-map" className="hover:text-yellow-400 transition-colors">
                  Central Prototyping Arena
                </a>
              </li>
              <li>
                <a href="#location-map" className="hover:text-blue-400 transition-colors">
                  Aero Flight Hangar 3
                </a>
              </li>
              <li>
                <a href="#location-map" className="hover:text-emerald-400 transition-colors">
                  Robotics &amp; AI Computing Bay
                </a>
              </li>
              <li>
                <a href="#location-map" className="hover:text-indigo-400 transition-colors">
                  Rooftop Space Observatory
                </a>
              </li>
              <li>
                <Link to="/projects" className="hover:text-purple-400 transition-colors">
                  Hardware Component Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">
              Portals &amp; Access
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Upcoming &amp; Past Events
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Registration (GITAM &amp; External)
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Member Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-red-400 transition-colors flex items-center gap-1">
                  <span>Admin Login</span>
                  <span className="text-[10px] text-red-400 font-mono">[ Attendance ]</span>
                </Link>
              </li>
              <li>
                <a href="#location-map" className="hover:text-emerald-400 transition-colors">
                  Campus Location Map
                </a>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Student Projects Directory
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>{footer.copyright || `© ${new Date().getFullYear()} GUSAC — GITAM University Science and Activity Center. All rights reserved.`}</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400/80">{footer.securityNote || '● End-to-End Encryption Verified'}</span>
            <span className="text-slate-600">|</span>
            <span className="text-blue-400/80">{footer.cipherNote || 'Argon2id Salted Hashes'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
