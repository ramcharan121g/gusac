import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { subscribeToUpdates } from '../utils/sync';
import {
  FolderGit2,
  Search,
  Plus,
  Star,
  ExternalLink,
  Code2,
  CheckCircle2,
  X,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Projects() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWing, setSelectedWing] = useState(searchParams.get('wing') || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New Project Form state
  const [form, setForm] = useState({
    title: '',
    wing: 'Robotics & Automation',
    summary: '',
    fullDescription: '',
    githubUrl: '',
    liveDemo: '',
    tags: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const wingsList = [
    'All',
    'Aeromodelling & UAVs',
    'Robotics & Automation',
    'Web, Cloud & CyberSecurity',
    'AI, ML & Data Science',
    'Astronomy & Space Tech',
    'IoT & Hardware Systems'
  ];

  useEffect(() => {
    fetchProjects();
  }, [selectedWing, searchQuery]);

  useEffect(() => {
    const unsubscribe = subscribeToUpdates((ev) => {
      if (['PROJECTS_UPDATED'].includes(ev.type)) {
        fetchProjects();
      }
    });
    const handleFocus = () => fetchProjects();
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let endpoint = '/projects?';
      if (selectedWing !== 'All') endpoint += `wing=${encodeURIComponent(selectedWing)}&`;
      if (searchQuery) endpoint += `search=${encodeURIComponent(searchQuery)}&`;
      const data = await apiRequest(endpoint);
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async (e, projectId) => {
    e.stopPropagation();
    try {
      const res = await apiRequest(`/projects/${projectId}/star`, { method: 'POST' });
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, stars: res.stars } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setSubmitting(true);

    try {
      const res = await apiRequest('/projects', {
        method: 'POST',
        body: form
      });
      setSubmitSuccess(res.message);
      fetchProjects();
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setForm({
          title: '',
          wing: 'Robotics & Automation',
          summary: '',
          fullDescription: '',
          githubUrl: '',
          liveDemo: '',
          tags: ''
        });
        setSubmitSuccess('');
      }, 1800);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Open Innovation Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            GUSAC Student Projects
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse hardware prototypes, autonomous UAVs, neural net pipelines, and secure platforms built by GUSAC students.
          </p>
        </div>

        {user ? (
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Submit Your Project
          </button>
        ) : (
          <div className="text-xs text-slate-400 font-mono self-start md:self-auto">
            Log in to submit your project
          </div>
        )}
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        
        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none text-xs font-mono">
          {wingsList.map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWing(w)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedWing === w
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-mono animate-pulse">
          Loading innovation directory...
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-slate-400 space-y-2">
          <p className="text-base font-semibold">No projects found matching the criteria.</p>
          <p className="text-xs font-mono text-slate-500">Try selecting "All" categories or clearing search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex flex-col justify-between glass-card-hover group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {proj.wing}
                  </span>
                  
                  <button
                    onClick={(e) => handleStar(e, proj.id)}
                    className="flex items-center gap-1 text-xs text-yellow-400 font-mono hover:scale-110 transition-transform bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20"
                    title="Star this project"
                  >
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>{proj.stars || 0}</span>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {proj.title}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {proj.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.tags?.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-slate-300 border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">By {proj.author}</span>
                <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Details <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0d121f] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mb-2">
                    {selectedProject.wing}
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedProject.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Created by <strong>{selectedProject.author}</strong> • Status: <span className="text-emerald-400 font-bold">{selectedProject.status}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Project Overview
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-slate-800/80">
                    {selectedProject.fullDescription || selectedProject.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Tags &amp; Tooling
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags?.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External Links */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold flex items-center gap-2 border border-slate-700"
                    >
                      <Code2 className="w-4 h-4" />
                      View Source Code
                    </a>
                  )}
                  {selectedProject.liveDemo && (
                    <a
                      href={selectedProject.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Launch Live Demo
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUBMIT PROJECT MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0d121f] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Submit New GUSAC Project</h3>
                  <p className="text-xs text-slate-400 font-mono">Showcase your prototype to faculty &amp; peers</p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Solar Rover"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Project Domain / Category *
                </label>
                <select
                  value={form.wing}
                  onChange={(e) => setForm({ ...form, wing: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {wingsList.filter((w) => w !== 'All').map((w) => (
                    <option key={w} value={w} className="bg-slate-900">{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Short Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief 1-2 sentence description..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Full Technical Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Architecture, hardware specs, sensors used, algorithms implemented..."
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="ROS2, Python, CAD"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {submitError && (
                <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 font-mono">
                  {submitError}
                </p>
              )}

              {submitSuccess && (
                <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {submitSuccess}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {submitting ? 'Submitting...' : 'Submit for Moderation'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
