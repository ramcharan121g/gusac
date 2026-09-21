import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Ticket,
  X,
  Printer,
  Mail,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  User,
  Building,
  GraduationCap
} from 'lucide-react';
import GusacLogo from './GusacLogo3D';

export default function DigitalPassModal({
  pass,
  event,
  isOpen,
  onClose
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (pass?.ticketCode) {
      generateQr(pass.ticketCode);
    }
  }, [pass]);

  const generateQr = async (code) => {
    try {
      // Encode verifiable QR payload
      const qrPayload = `GUSAC-VERIFIED-PASS:${code}`;
      const url = await QRCode.toDataURL(qrPayload, {
        width: 240,
        margin: 1,
        color: {
          dark: '#050811',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  if (!isOpen || !pass) return null;

  const eventTitle = event?.title || pass.eventTitle || 'GUSAC Event';
  const eventVenue = event?.venue || pass.eventVenue || 'GUSAC Central Arena, GITAM Visakhapatnam';
  const eventDate = event?.date || pass.eventDate || 'Upcoming Event 2026';
  const eventCategory = event?.category || pass.eventCategory || 'Technical Gathering';
  const isGitamUser = pass.userType === 'gitam';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in print:bg-white print:p-0">
      <div className="w-full max-w-md rounded-3xl bg-[#080d17] border border-blue-500/40 shadow-2xl overflow-hidden relative text-slate-100 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Pass Top Bar */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
              Official Digital Pass
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print Pass"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <GusacLogo size="sm" />
              <div>
                <span className="text-xs font-mono font-black text-white block tracking-wider">
                  GUSAC INNOVATION HUB
                </span>
                <span className="text-[9px] font-mono text-slate-400 block">
                  GITAM (Deemed to be University)
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
              isGitamUser ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {isGitamUser ? 'GITAM STUDENT' : 'EXTERNAL PARTICIPANT'}
            </span>
          </div>

          {/* Event Title */}
          <div>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 inline-block mb-1.5">
              {eventCategory}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              {eventTitle}
            </h3>
            <div className="mt-2 space-y-1 text-xs font-mono text-slate-300">
              <p className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{eventDate}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="line-clamp-1">{eventVenue}</span>
              </p>
            </div>
          </div>

          {/* QR Code Container (High-Contrast for Scanner) */}
          <div className="p-4 bg-white rounded-2xl text-center shadow-xl border border-slate-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Digital Pass QR"
                className="w-44 h-44 mx-auto object-contain"
              />
            ) : (
              <div className="w-44 h-44 mx-auto flex items-center justify-center bg-slate-100 text-xs font-mono text-slate-500">
                Generating QR...
              </div>
            )}
            <div className="mt-2 font-mono font-black text-slate-900 tracking-wider text-sm">
              {pass.ticketCode}
            </div>
            <span className="text-[10px] font-mono text-slate-500 block">
              Scan at Venue Entry for Instant Attendance Recording
            </span>
          </div>

          {/* Attendee Details Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-400">Attendee:</span>
              <span className="text-white font-bold">{pass.userName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
              <span className="text-slate-400">Email:</span>
              <span className="text-slate-300 truncate max-w-[200px]">{pass.userEmail}</span>
            </div>
            {pass.collegeOrCompany && (
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Affiliation:</span>
                <span className="text-white truncate max-w-[200px]">{pass.collegeOrCompany}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-slate-400">Pass Status:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                pass.checkedIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              }`}>
                {pass.checkedIn ? '✅ ATTENDANCE RECORDED' : 'ACTIVE ENTRY PASS'}
              </span>
            </div>
          </div>

          {/* Verification & Email Badge */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched to registered email
            </span>
            <span className="text-slate-500">
              1-Person Entry Only
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
