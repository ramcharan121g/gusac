import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import {
  Plane,
  Bot,
  ShieldCheck,
  Cpu,
  Orbit,
  Zap,
  MapPin,
  Users,
  CheckCircle,
  FolderGit2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wings() {
  const [wings, setWings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWing, setSelectedWing] = useState(null);

  useEffect(() => {
    fetchWings();
  }, []);

  const fetchWings = async () => {
    try {
      const data = await apiRequest('/wings');
      setWings(data.wings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWingIcon = (iconName) => {
    switch (iconName) {
      case 'Plane':
        return <Plane className="w-7 h-7" />;
      case 'Bot':
        return <Bot className="w-7 h-7" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7" />;
      case 'Cpu':
        return <Cpu className="w-7 h-7" />;
      case 'Orbit':
        return <Orbit className="w-7 h-7" />;
      case 'Zap':
        return <Zap className="w-7 h-7" />;
      default:
        return <Layers className="w-7 h-7" />;
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono text-yellow-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Multidisciplinary Research Domains</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          GUSAC Technical Wings &amp; Labs
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          From autonomous flight controllers and planetary rovers to deep AI neural networks and defensive zero-trust infrastructure.
        </p>
      </div>

      {/* Wings Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-mono animate-pulse">
          Loading innovation labs...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {wings.map((wing) => (
            <div
              key={wing.id}
              className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between glass-card-hover relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: wing.color }}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="p-3.5 rounded-2xl flex items-center justify-center text-white"
                    style={{ backgroundColor: `${wing.color}25`, color: wing.color }}
                  >
                    {getWingIcon(wing.icon)}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-full border border-slate-800">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{wing.membersCount} Innovators</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {wing.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {wing.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-400 pt-2">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>Facility:</strong> {wing.labLocation}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span><strong>Lead:</strong> {wing.lead}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Flagship:</strong> {wing.featuredProject}</span>
                  </p>
                </div>

                {/* Tech Badges */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-2 font-semibold">
                    Core Technologies &amp; Toolchains:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {wing.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-black/50 text-slate-300 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  to={`/projects?wing=${encodeURIComponent(wing.title)}`}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                >
                  <FolderGit2 className="w-4 h-4" />
                  View Wing Projects
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  Apply to Join <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
