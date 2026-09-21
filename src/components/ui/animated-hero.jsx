import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Sparkles, Wrench, FolderGit2, ShieldCheck, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GusacLogo from "@/components/GusacLogo3D";
import HeroParticles from "@/components/HeroParticles";

function AnimatedHero({ pulseData }) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "autonomous drones",
      "planetary rovers",
      "edge AI vision",
      "zero-trust security",
      "CubeSat telemetry",
      "custom PCB hardware"
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2400);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-24 overflow-hidden border-b border-slate-800/60">
      <HeroParticles />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[360px] bg-gradient-to-r from-yellow-500/10 via-blue-600/15 to-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Campus Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-xl mb-6">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">GITAM University Science &amp; Activity Center</span>
          <span className="text-slate-500">|</span>
          <span className="text-yellow-400 font-bold">Student Innovation Hub Active</span>
        </div>

        {/* THE EXACT GUSAC TITLE LOGO IN SPOTLIGHT BANNER (CLEAN & FLAT) */}
        <div className="my-2 sm:my-4 flex flex-col items-center justify-center">
          <GusacLogo size="hero" withBanner={true} />
          
          <p className="text-xs sm:text-sm font-mono tracking-widest text-slate-400 uppercase mt-3 font-bold">
            GITAM University Science and Activity Center
          </p>
        </div>

        {/* Animated Rotating Headline */}
        <div className="flex gap-4 flex-col mt-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-white">
            <span>Engineering the next generation of</span>
            <span className="relative flex w-full justify-center overflow-hidden text-center h-[52px] sm:h-[70px] lg:h-[80px] pt-1">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-blue-400"
                  initial={{ opacity: 0, y: -50 }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                  animate={
                    titleNumber === index
                      ? {
                          y: 0,
                          opacity: 1,
                        }
                      : {
                          y: titleNumber > index ? -100 : 100,
                          opacity: 0,
                        }
                  }
                >
                  {title}.
                </motion.span>
              ))}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mt-1">
            Where multidisciplinary student minds collide. Building university rovers, autonomous flight platforms, AI perception pipelines, and zero-trust defensive security.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button asChild variant="gold" size="lg" className="gap-2 shadow-xl">
            <Link to="/projects">
              <FolderGit2 className="w-4 h-4 text-black" />
              Explore Student Projects
              <MoveRight className="w-4 h-4 text-black" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2 bg-slate-900/90 hover:bg-slate-800 border-slate-700">
            <Link to="/events">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Events &amp; Passes
            </Link>
          </Button>
        </div>

        {/* Live Campus Lab Pulse Ticker */}
        {pulseData && (
          <div className="mt-10 max-w-4xl mx-auto p-3 rounded-2xl bg-black/60 border border-slate-800 flex items-center gap-3 overflow-hidden shadow-inner text-left text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>CAMPUS LAB PULSE:</span>
            </div>

            <div className="text-slate-300 truncate">
              <span className="text-yellow-400 font-bold">{pulseData.recentActivities[0]?.user}</span>{' '}
              {pulseData.recentActivities[0]?.action}{' '}
              <span className="text-slate-500">({pulseData.recentActivities[0]?.time})</span>
            </div>
          </div>
        )}

        {/* Metric Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono">1,200+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Student Members</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">50+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Hardware Projects</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">₹5,00,000+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Hackathon Grants Won</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">24/7</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Keycard Lab Access</div>
          </div>
        </div>

      </div>
    </section>
  );
}

export { AnimatedHero, AnimatedHero as Hero };
