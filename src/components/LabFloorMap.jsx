import React, { useState } from 'react';
import {
  MapPin,
  Plane,
  Bot,
  ShieldCheck,
  Cpu,
  Orbit,
  Zap,
  CheckCircle2,
  Users,
  Wrench,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LabFloorMap() {
  const [selectedStation, setSelectedStation] = useState(null);

  const stations = [
    {
      id: 'hangar3',
      name: 'Hangar 3 & Drone Flight Testing Cage',
      wing: 'Aeromodelling & UAVs',
      color: '#F5C400',
      icon: Plane,
      location: 'Ground Floor, North Tech Annex',
      occupancy: '8 / 15 Innovators',
      equipment: ['Pixhawk 6C Avionics Rack', 'Carbon Airframe Workbenches', 'Wind Tunnel Test Rig', 'LiPo Battery Safe'],
      lead: 'Sneha Reddy (UAV Head)',
      description: 'Dedicated 1200 sq.ft. indoor flight cage with high-speed optical tracking for quadcopters, VTOL fixed-wing testing, and PID gain tuning.'
    },
    {
      id: 'robotics-bay',
      name: 'Robotics Bay 1 & Rover Obstacle Pit',
      wing: 'Robotics & Automation',
      color: '#1E7B28',
      icon: Bot,
      location: 'Ground Floor, Central Engineering Bay',
      occupancy: '12 / 20 Innovators',
      equipment: ['Rocker-Bogie Soil Test Pit', 'ROS2 Workstations', 'RPLiDAR Calibration Track', '4-DOF Robotic Arm Benches'],
      lead: 'Aarav Sharma (Robotics Lead)',
      description: 'Planetary terrain simulation pit with sandy soil and boulders to test rover traction, inverse kinematics, and autonomous SLAM navigation.'
    },
    {
      id: 'cyber-lab',
      name: 'Cyber Defense War Room & CTF Sandbox',
      wing: 'Web, Cloud & CyberSecurity',
      color: '#124EB4',
      icon: ShieldCheck,
      location: 'Room 402, 4th Floor',
      occupancy: '14 / 25 Innovators',
      equipment: ['SIEM Defense Monitors', 'Isolated CTF Sandbox Server', 'Hardware Security Tokens', 'OWASP ASVS Verification Rig'],
      lead: 'Vikram Nair (Tech Secretary)',
      description: 'High-security lab equipped with air-gapped pen-testing servers, real-time threat intelligence monitors, and live CTF staging environments.'
    },
    {
      id: 'ai-hub',
      name: 'AI Neural Computing Hub & Edge Rigs',
      wing: 'AI, ML & Data Science',
      color: '#C62828',
      icon: Cpu,
      location: 'Lab 6, 2nd Floor',
      occupancy: '10 / 18 Innovators',
      equipment: ['NVIDIA Jetson Orin Nano Rigs', 'Dual RTX 4090 Training Server', 'Stereo Depth Cameras', 'DeepSORT Vision Benches'],
      lead: 'Dr. Ramesh M. & Student AI Cell',
      description: 'High-throughput edge computing lab for training real-time computer vision models, obstacle detection pipelines, and campus automation bots.'
    },
    {
      id: 'fablab',
      name: 'Makerspace 3D Print Farm & PCB FabLab',
      wing: 'IoT & Hardware Systems',
      color: '#EC4899',
      icon: Zap,
      location: 'FabLab Station 1-4, Ground Floor',
      occupancy: '6 / 12 Innovators',
      equipment: ['Bambu Lab X1-Carbon 3D Printers', 'SMD Pick-and-Place Soldering', 'Rigol Oscilloscopes', 'Altium PCB Milling Station'],
      lead: 'P. Rohit (Hardware Head)',
      description: 'Rapid prototyping zone with multi-material 3D printers, SMD rework stations, logic analyzers, and component drawers for custom PCB fabrication.'
    },
    {
      id: 'observatory',
      name: 'Rooftop Space Science & Astro Observatory',
      wing: 'Astronomy & Space Tech',
      color: '#6366F1',
      icon: Orbit,
      location: 'Observatory Dome, Rooftop Tech Park',
      occupancy: '5 / 10 Innovators',
      equipment: ['14" Schmidt-Cassegrain Telescope', 'Radio Astronomy SDR Receiver', 'Motorized Equatorial Mount', 'CubeSat Ground Antenna'],
      lead: 'T. Ananya (Astro Lead)',
      description: 'Open-air observation deck equipped with high-resolution telescope optics, narrowband astronomical filters, and satellite telemetry receivers.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-bold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Interactive Campus Facility Guide
          </span>
          <h3 className="text-xl sm:text-3xl font-bold text-white mt-1">
            GUSAC Labs &amp; Makerspace Stations
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All 6 Lab Stations Active &amp; Open</span>
        </div>
      </div>

      {/* Grid of Interactive Lab Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((st) => {
          const IconComponent = st.icon;
          return (
            <div
              key={st.id}
              onClick={() => setSelectedStation(st)}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between glass-card-hover group relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: st.color }}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="p-3 rounded-2xl flex items-center justify-center text-white"
                    style={{ backgroundColor: `${st.color}20`, color: st.color }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-black/50 px-2.5 py-1 rounded-full border border-slate-800">
                    {st.occupancy}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: st.color }}>
                    {st.wing}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mt-0.5">
                    {st.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{st.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Lead: {st.lead.split(' ')[0]}</span>
                <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Specs <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: LAB STATION DEEP-DIVE */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0c101a] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 space-y-5">
              
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span
                    className="px-3 py-1 rounded-md text-xs font-mono font-bold inline-block mb-1.5"
                    style={{ backgroundColor: `${selectedStation.color}20`, color: selectedStation.color }}
                  >
                    {selectedStation.wing}
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedStation.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> {selectedStation.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Facility Overview
                  </h5>
                  <p className="text-xs text-slate-200 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-slate-800">
                    {selectedStation.description}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Key Lab Equipment &amp; Stations
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedStation.equipment.map((eq, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs font-mono text-blue-300 flex items-center justify-between">
                  <span>Mentor / Lead in-Charge: <strong>{selectedStation.lead}</strong></span>
                  <span className="text-emerald-400 font-bold">24/7 Keycard Access</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  to="/makerspace"
                  onClick={() => setSelectedStation(null)}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center transition-colors"
                >
                  Request Equipment from this Lab
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
