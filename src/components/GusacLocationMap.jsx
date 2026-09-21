import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Building,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Car,
  Plane,
  Train,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { useSiteContent } from '../context/SiteContentContext';

export default function GusacLocationMap() {
  const { siteContent } = useSiteContent();
  const loc = siteContent?.location || {};

  const [activeFacility, setActiveFacility] = useState('central-labs');

  const facilities = loc.facilities?.length ? loc.facilities : [
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
  ];

  return (
    <section id="location-map" className="relative py-16 lg:py-24 border-t border-slate-800/80 bg-gradient-to-b from-[#080b11] via-[#090e1a] to-[#080b11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 mb-3">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold uppercase tracking-wider">{loc.tag || 'Campus Location & Directions'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {loc.title || 'Locate GUSAC Labs'}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-2 font-light">
              {loc.description || 'Situated right along the scenic Rushikonda Beach coastline on the sprawling 100-acre GITAM Visakhapatnam Campus.'}
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="bg-slate-900/90 border-slate-700 text-xs font-mono self-start md:self-auto">
            <a
              href={loc.directionsUrl || "https://maps.google.com/?q=GITAM+Deemed+to+be+University+Visakhapatnam"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
            >
              <Navigation className="w-4 h-4" /> Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Map Embed (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-blue-500/30 bg-slate-950/80 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Map Top Status Bar */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold">{loc.mapGps || 'GUSAC GPS: 17.7816° N, 83.3776° E'}</span>
              </div>
              <span className="text-slate-400 hidden sm:inline">{loc.campusSubtitle || 'Rushikonda, Visakhapatnam, AP'}</span>
            </div>

            {/* Google Maps Responsive Iframe */}
            <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-900">
              <iframe
                title="GUSAC GITAM Campus Location"
                src={loc.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.817349603094!2d83.37452331535496!3d17.781648987843797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395b1965e64819%3A0xc34a625a6eb823b1!2sGITAM%20Deemed%20to%20be%20University!5e0!3m2!1sen!2sin!4v1677654321000!5m2!1sen!2sin"}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(105%) brightness(95%)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Floating Address Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto p-4 rounded-2xl bg-[#090d16]/95 border border-slate-700/90 shadow-2xl backdrop-blur-md max-w-sm">
                <p className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> {loc.addressTitle || 'GUSAC Headquarters'}
                </p>
                <p className="text-xs text-white leading-relaxed">
                  {loc.address || 'Student Activity Center, ICT Bhavan, GITAM Deemed to be University, Gandhi Nagar, Rushikonda, Visakhapatnam, AP 530045'}
                </p>
              </div>
            </div>

            {/* Travel Distances Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <Plane className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                <span className="text-slate-400 block text-[10px]">Vizag Airport (VTZ)</span>
                <span className="text-white font-bold">{loc.airportDistance || '22 KM (40 min)'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <Train className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                <span className="text-slate-400 block text-[10px]">Railway Stn (VSKP)</span>
                <span className="text-white font-bold">{loc.railwayDistance || '14 KM (25 min)'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <Car className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <span className="text-slate-400 block text-[10px]">Beach Road Access</span>
                <span className="text-white font-bold">{loc.highwayAccess || 'Direct NH16 Gate'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Lab Navigator & Contact Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-yellow-400" /> Key Facility Locations
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Click to locate</span>
              </div>

              <div className="space-y-3">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    onClick={() => setActiveFacility(fac.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      activeFacility === fac.id
                        ? 'bg-slate-800/90 border-blue-500 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white font-mono">{fac.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${fac.color}`}>
                        {fac.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-yellow-400/90 flex items-center gap-1 mb-1">
                      <Compass className="w-3 h-3" /> {fac.building}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {fac.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0c1424] border border-emerald-500/30 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" /> Contact &amp; Visiting Hours
              </h3>

              <div className="space-y-2.5 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{loc.contactPhone || '+91 (891) 2840501 / +91 94401 23456'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={`mailto:${loc.contactEmail || 'gusac@gitam.edu'}`} className="hover:text-blue-300 transition-colors">
                    {loc.contactEmail || 'gusac@gitam.edu / support@gusac.gitam.edu'}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>{loc.labHours || 'Lab Hours: 24/7 for Inducted Members (Biometric Access)'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Visitors / Delegations:</span>
                <span className="text-emerald-400 font-bold">{loc.visitorHours || 'Mon - Sat: 09:00 AM - 06:00 PM'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
