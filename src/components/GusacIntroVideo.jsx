import React, { useState } from 'react';
import {
  Play,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Layers,
  Bot,
  Plane,
  ShieldCheck,
  Cpu,
  Orbit,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  return url;
}

export default function GusacIntroVideo() {
  const { siteContent } = useSiteContent();
  const introVideo = siteContent?.introVideo || {};

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const embedUrl = getEmbedUrl(introVideo.videoUrl);

  const chapters = introVideo.chapters?.length ? introVideo.chapters.map((ch, idx) => ({
    title: ch.title,
    tag: ch.tag || `Chapter ${idx + 1}`,
    time: ch.time || '01:00',
    desc: ch.desc || 'Explore cutting-edge student innovation projects and prototyping equipment.'
  })) : [
    {
      title: '01. Autonomous UAVs & Hybrid VTOL',
      desc: 'Designing custom carbon-fiber airframes, PX4 autopilots, and long-range telemetry missions.',
      tag: 'Aero Flight Bay',
      time: '00:15'
    },
    {
      title: '02. Mars Rover & Planetary Exploration',
      desc: '6-wheel rocker-bogie mechanics, 4-DOF manipulator arms, and SLAM point cloud navigation.',
      tag: 'Robotics Bay',
      time: '01:05'
    },
    {
      title: '03. Rooftop Space Tracking & Radio Telescope',
      desc: '14-inch Schmidt-Cassegrain optics, amateur radio satellite downlink, and deep sky astrophotography.',
      tag: 'Observatory',
      time: '01:50'
    },
    {
      title: '04. Edge AI & Neural Perception Engines',
      desc: 'Deploying neural networks on NVIDIA Jetson Orin modules for autonomous campus navigation and computer vision.',
      tag: 'AI Computing Hub',
      time: '02:40'
    }
  ];

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-[#080c14] via-[#0b101c] to-[#080c14] border-y border-slate-800/80">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-yellow-400 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-bold tracking-wider uppercase">{introVideo.badge || 'GUSAC Experience & Lab Tour'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {introVideo.titleStart || "Inside GITAM's Flagship"}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-blue-400">
              {introVideo.titleHighlight || 'Innovation Hub'}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {introVideo.subtitle || 'Take a 3-minute video journey through our ₹50+ Cr research facilities, autonomous robotics bays, drone flight grounds, and 24/7 student innovation hubs.'}
          </p>
        </div>

        {/* High-Tech Video Showcase Card */}
        <div className="relative rounded-3xl border border-blue-500/30 bg-slate-950/80 shadow-2xl overflow-hidden group">
          
          {/* Main Backdrop Image */}
          <div className="relative h-[340px] sm:h-[460px] lg:h-[520px] w-full overflow-hidden">
            <img
              src={introVideo.thumbnailUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80"}
              alt="GUSAC Innovation Hub Video Thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.45] contrast-110"
            />

            {/* Scanline and HUD Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

            {/* Top HUD Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-slate-700/80 backdrop-blur-md text-slate-200">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                <span className="font-bold">{introVideo.reelTag || '4K UHD INTRO REEL'}</span>
                <span className="text-slate-500">|</span>
                <span className="text-yellow-400 font-semibold">{introVideo.centerTag || 'GUSAC Innovation Hub'}</span>
              </div>

              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/70 border border-slate-700/80 backdrop-blur-md text-slate-300">
                <span>{introVideo.duration || '03:45 DURATION'}</span>
                <span className="text-slate-600">●</span>
                <span className="text-emerald-400">{introVideo.soundTag || 'SURROUND AUDIO'}</span>
              </div>
            </div>

            {/* Centered Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <button
                onClick={() => setIsOpen(true)}
                className="group/btn relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-2xl shadow-yellow-500/30 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Play GUSAC Intro Video"
              >
                <div className="absolute -inset-2 rounded-full bg-yellow-400/30 blur-md animate-pulse pointer-events-none" />
                <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current ml-1 text-slate-950" />
              </button>

              <p className="mt-4 text-xs sm:text-sm font-mono text-slate-200 font-bold tracking-wider drop-shadow-md">
                {introVideo.buttonText || 'CLICK TO WATCH GUSAC SHOWCASE'}
              </p>
              <span className="text-[11px] font-mono text-yellow-400/90 mt-1">
                {introVideo.featureText || 'Featuring Student Rovers, Drones & Cybersecurity'}
              </span>
            </div>

            {/* Bottom Chapter Preview Ticker */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {chapters.slice(0, 4).map((ch, idx) => (
                <div
                  key={idx}
                  onClick={() => { setActiveChapter(idx); setIsOpen(true); }}
                  className="cursor-pointer p-3 rounded-xl bg-black/75 border border-slate-700/80 backdrop-blur-md hover:border-yellow-400/60 hover:bg-black/90 transition-all font-mono shadow-lg"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-yellow-400 font-bold">{ch.tag}</span>
                    <span className="text-slate-400">{ch.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 line-clamp-1">
                    {ch.title}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          FULL VIDEO MODAL PLAYER
         ======================================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-5xl rounded-3xl bg-[#090d16] border border-blue-500/40 shadow-2xl overflow-hidden relative flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0c1220] to-[#080d17] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                    GUSAC Innovation Showcase &amp; Campus Tour
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Official Orientation Reel • GITAM University Science &amp; Activity Center
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Close Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Screen Area */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={introVideo.title || "GUSAC Video Showcase"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                /* Dynamic Video Visual Simulation */
                <div className="absolute inset-0">
                  <img
                    src={
                      activeChapter === 0
                        ? 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1600&q=80'
                        : activeChapter === 1
                        ? 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80'
                        : activeChapter === 2
                        ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80'
                        : 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80'
                    }
                    alt="GUSAC Lab Video"
                    className="w-full h-full object-cover brightness-[0.7] contrast-110"
                  />

                  {/* Animated HUD Overlay Elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
                  
                  {/* Real-time telemetry ticker in video */}
                  <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/70 border border-slate-700 backdrop-blur-md font-mono text-[11px] space-y-1 text-slate-300 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-emerald-400 font-bold">STREAM ACTIVE: 1080p 60FPS</span>
                    </div>
                    <p className="text-white font-bold">{chapters[activeChapter]?.title}</p>
                    <p className="text-slate-400">{chapters[activeChapter]?.desc}</p>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2.5 rounded-xl bg-black/70 border border-slate-700 text-slate-200 hover:text-white"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  {/* Center playback indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-4 rounded-full bg-yellow-500/90 text-black hover:scale-110 transition-transform shadow-xl"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Video Chapter Selection Bar */}
            <div className="p-4 sm:p-5 bg-[#080c14] border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-yellow-400 font-bold">SELECT CHAPTER:</span>
                <span className="text-slate-400">Chapter {activeChapter + 1} of {chapters.length}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveChapter(idx)}
                    className={`p-3 rounded-xl border text-left transition-all font-mono text-xs ${
                      activeChapter === idx
                        ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] text-yellow-400 block mb-0.5">{ch.tag}</span>
                    <span className="line-clamp-1">{ch.title?.includes('. ') ? ch.title.split('. ')[1] : ch.title}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <p className="text-slate-400 text-center sm:text-left">
                  Want to work on these autonomous projects with 24/7 keycard access?
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button asChild variant="gold" size="sm" className="w-full sm:w-auto font-bold">
                    <Link to="/projects" onClick={() => setIsOpen(false)}>
                      Explore Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link to="/events" onClick={() => setIsOpen(false)}>
                      View Events
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
