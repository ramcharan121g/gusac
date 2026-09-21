import React from 'react';

export default function GusacEmblem({ size = 48, className = '' }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1322] to-slate-900 p-2 border border-slate-700/80 shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5C400" />
            <stop offset="33%" stopColor="#1E7B28" />
            <stop offset="66%" stopColor="#124EB4" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>
        </defs>

        {/* Outer Circular Orbit / Tech Node */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="url(#ring-grad)" strokeWidth="2.5" strokeDasharray="6 3" />
        <circle cx="50" cy="50" r="38" fill="#080c14" stroke="#1e293b" strokeWidth="1.5" />

        {/* Mini 3D GUSAC Letter Monogram */}
        <g transform="translate(18, 28) scale(0.65)">
          {/* G */}
          <text x="0" y="38" fontFamily="Impact, sans-serif" fontSize="36" fill="#FFF" stroke="#000" strokeWidth="2">G</text>
          {/* U */}
          <text x="18" y="38" fontFamily="Impact, sans-serif" fontSize="36" fill="#FFF" stroke="#F5C400" strokeWidth="2">U</text>
          {/* S */}
          <text x="36" y="38" fontFamily="Impact, sans-serif" fontSize="36" fill="#FFF" stroke="#1E7B28" strokeWidth="2">S</text>
          {/* A */}
          <text x="54" y="38" fontFamily="Impact, sans-serif" fontSize="36" fill="#FFF" stroke="#124EB4" strokeWidth="2">A</text>
          {/* C */}
          <text x="72" y="38" fontFamily="Impact, sans-serif" fontSize="36" fill="#FFF" stroke="#C62828" strokeWidth="2">C</text>
        </g>

        {/* Star Badge */}
        <polygon points="50,12 52,18 58,18 53,22 55,28 50,24 45,28 47,22 42,18 48,18" fill="#F5C400" />
      </svg>
    </div>
  );
}
