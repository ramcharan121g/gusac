import React from 'react';

/**
 * GusacLogo:
 * Clean, flat, ultra-high-definition reproduction of the exact GUSAC logo image.
 * No 3D tilting or wobbling — crisp, stable, and perfectly framed.
 */
export default function GusacLogo({
  size = 'md',
  withBanner = false,
  className = ''
}) {
  const sizeClasses = {
    xs: 'h-6 sm:h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-13',
    lg: 'h-14 sm:h-16 md:h-18',
    xl: 'h-20 sm:h-24 md:h-28',
    hero: 'h-20 sm:h-28 md:h-36 lg:h-40'
  };

  const logoImg = (
    <img
      src="/gusac_original_logo.png"
      alt="GUSAC - GITAM University Science and Activity Center"
      className={`${sizeClasses[size] || 'h-12'} w-auto object-contain select-none transition-transform duration-200 hover:scale-[1.02] drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]`}
      style={{
        imageRendering: 'auto',
        WebkitFontSmoothing: 'antialiased'
      }}
      draggable={false}
    />
  );

  if (withBanner) {
    return (
      <div
        className={`relative inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-[#0b0e14] via-[#141a24] to-[#0b0e14] border border-slate-700/70 shadow-[0_15px_35px_rgba(0,0,0,0.8)] overflow-hidden ${className}`}
      >
        {/* Soft centered ambient spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Subtle glowing color accents on the edges */}
        <div className="absolute -bottom-4 left-1/4 w-20 h-8 bg-yellow-500/10 rounded-full blur-lg pointer-events-none" />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-emerald-500/10 rounded-full blur-lg pointer-events-none" />
        <div className="absolute -bottom-4 right-1/4 w-20 h-8 bg-blue-500/10 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10">{logoImg}</div>
      </div>
    );
  }

  return (
    <div
      className={`inline-block select-none ${className}`}
      title="GUSAC - GITAM University Science and Activity Center"
    >
      {logoImg}
    </div>
  );
}
