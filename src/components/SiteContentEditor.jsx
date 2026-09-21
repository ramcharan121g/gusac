import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import {
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Bell,
  Sparkles,
  Video,
  MapPin,
  HelpCircle,
  Users,
  Shield,
  FileText,
  Plus,
  Trash2,
  Compass,
  Link as LinkIcon,
  Globe,
  Award,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Button } from './ui/button';

export default function SiteContentEditor() {
  const { siteContent, saveSiteContent, resetSiteContent, loading: contextLoading } = useSiteContent();

  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  // Sync formData whenever siteContent loads or updates from outside
  useEffect(() => {
    if (siteContent) {
      setFormData(JSON.parse(JSON.stringify(siteContent)));
      setIsDirty(false);
    }
  }, [siteContent]);

  if (!formData) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading Site Content CMS...
      </div>
    );
  }

  // Update top-level or nested field
  const handleFieldChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  // Helper for array item changes
  const handleArrayItemChange = (section, arrayName, index, field, value) => {
    setFormData((prev) => {
      const arr = [...(prev[section]?.[arrayName] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: arr
        }
      };
    });
    setIsDirty(true);
  };

  // Add item to array
  const handleAddArrayItem = (section, arrayName, newItem) => {
    setFormData((prev) => {
      const arr = [...(prev[section]?.[arrayName] || []), newItem];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: arr
        }
      };
    });
    setIsDirty(true);
  };

  // Remove item from array
  const handleRemoveArrayItem = (section, arrayName, index) => {
    setFormData((prev) => {
      const arr = [...(prev[section]?.[arrayName] || [])];
      arr.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: arr
        }
      };
    });
    setIsDirty(true);
  };

  // Save All Changes
  const handleSave = async () => {
    setSaving(true);
    setNotification({ type: '', text: '' });
    try {
      const res = await saveSiteContent(formData);
      setIsDirty(false);
      setNotification({
        type: 'success',
        text: 'All website content successfully updated and published live across the site!'
      });
      setTimeout(() => setNotification({ type: '', text: '' }), 6000);
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.message || 'Failed to save website content'
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset to Factory Defaults
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all site content to original defaults? This will overwrite your custom texts.')) {
      return;
    }
    setSaving(true);
    setNotification({ type: '', text: '' });
    try {
      await resetSiteContent();
      setIsDirty(false);
      setNotification({
        type: 'success',
        text: 'Site content restored to default factory configuration.'
      });
      setTimeout(() => setNotification({ type: '', text: '' }), 6000);
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.message || 'Failed to reset site content'
      });
    } finally {
      setSaving(false);
    }
  };

  const SECTIONS = [
    { id: 'topBar', label: 'Top Bar & Notice', icon: Bell, badge: 'Header' },
    { id: 'hero', label: 'Hero & Metrics', icon: Sparkles, badge: 'Main Fold' },
    { id: 'introVideo', label: 'Video Showcase', icon: Video, badge: 'Media' },
    { id: 'featuredProjectsHeading', label: 'Projects Section', icon: Layers, badge: 'Showcase' },
    { id: 'location', label: 'Location & Facilities', icon: MapPin, badge: 'Campus' },
    { id: 'about', label: 'About & Social', icon: Shield, badge: 'Story' },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle, badge: 'Q&A' },
    { id: 'council', label: 'Council & Leaders', icon: Users, badge: 'Team' },
    { id: 'footer', label: 'Footer & Security', icon: FileText, badge: 'Bottom' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-yellow-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
              Universal CMS
            </span>
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <Sliders className="w-5 h-5 text-yellow-400" /> Website Content Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Edit every title, counter, facility card, video link, FAQ, and story across the site. Changes reflect live instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs font-mono border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white"
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> View Live Site <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={saving}
            className="text-xs font-mono border-red-500/40 text-red-400 hover:bg-red-500/10"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset Defaults
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className={`text-xs font-mono font-bold shadow-lg transition-all ${
              isDirty
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Save className={`w-3.5 h-3.5 mr-1.5 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Publishing Changes...' : isDirty ? 'Save All Changes (Unsaved Edits)' : 'All Changes Saved'}
          </Button>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-mono flex items-center justify-between animate-in fade-in ${
            notification.type === 'error'
              ? 'bg-red-500/10 border border-red-500/30 text-red-300'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification({ type: '', text: '' })}
            className="text-slate-400 hover:text-white ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main CMS Layout: Left Sub-tabs, Right Active Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sub-tabs Navigation (3 Cols) */}
        <div className="lg:col-span-3 space-y-1.5 bg-slate-900/80 p-3 rounded-3xl border border-slate-800 shadow-xl">
          <div className="px-3 py-2 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Site Sections
          </div>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-left text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/50 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-slate-500'}`} />
                  <span>{sec.label}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {sec.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Active Editor Form (9 Cols) */}
        <div className="lg:col-span-9 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          
          {/* ========================================================
              1. TOP BAR & NOTICE EDITOR
             ======================================================== */}
          {activeSection === 'topBar' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-400" /> Top Announcement Bar &amp; Campuses
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Customizes the announcement ticker, admissions alert, portal title, and campus badge pills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Scrolling Notice / Headline</label>
                  <input
                    type="text"
                    value={formData.topBar?.noticeText || ''}
                    onChange={(e) => handleFieldChange('topBar', 'noticeText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="🚀 GUSAC 2026 Admissions & Project Registrations Now Active at Visakhapatnam Main Campus"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Portal Subtitle / Title</label>
                  <input
                    type="text"
                    value={formData.topBar?.portalTitle || ''}
                    onChange={(e) => handleFieldChange('topBar', 'portalTitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Student Tech Innovation Portal"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Status Badge Text</label>
                  <input
                    type="text"
                    value={formData.topBar?.statusBadge || ''}
                    onChange={(e) => handleFieldChange('topBar', 'statusBadge', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Admissions 2026 Active"
                  />
                </div>
              </div>

              {/* Campuses Manager */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Campus Hub Locations ({formData.topBar?.campuses?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddArrayItem('topBar', 'campuses', { name: 'Campus Name', code: 'Code', link: '#location-map' })}
                    className="text-[11px] font-mono border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Add Campus
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {formData.topBar?.campuses?.map((camp, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                      <input
                        type="text"
                        value={camp.name}
                        onChange={(e) => handleArrayItemChange('topBar', 'campuses', idx, 'name', e.target.value)}
                        placeholder="Campus Name (e.g. Visakhapatnam)"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-yellow-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={camp.code}
                        onChange={(e) => handleArrayItemChange('topBar', 'campuses', idx, 'code', e.target.value)}
                        placeholder="Code (e.g. VSP Main)"
                        className="w-28 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-yellow-400 focus:border-yellow-400 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveArrayItem('topBar', 'campuses', idx)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove Campus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              2. HERO SECTION & METRIC COUNTERS
             ======================================================== */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" /> Hero Section &amp; Metric Counters
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  The primary landing fold. Modify headlines, highlight keywords, intro story, call-to-action buttons, and the 4 metric cards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Top Badge Tag</label>
                  <input
                    type="text"
                    value={formData.hero?.badgeTag || ''}
                    onChange={(e) => handleFieldChange('hero', 'badgeTag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="GITAM UNIVERSITY • SCIENCE & ACTIVITY CENTER"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Headline (Pre-Highlight)</label>
                  <input
                    type="text"
                    value={formData.hero?.headlinePre || ''}
                    onChange={(e) => handleFieldChange('hero', 'headlinePre', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Empowering Students to Build"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-yellow-400 font-bold">Headline (Golden Gradient Highlight)</label>
                  <input
                    type="text"
                    value={formData.hero?.headlineHighlight || ''}
                    onChange={(e) => handleFieldChange('hero', 'headlineHighlight', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-yellow-500/40 text-yellow-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Autonomous Rovers, AI & Deep-Tech"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Headline (Post-Highlight)</label>
                  <input
                    type="text"
                    value={formData.hero?.headlinePost || ''}
                    onChange={(e) => handleFieldChange('hero', 'headlinePost', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="From Campus Labs to Global Orbits"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Hero Description Paragraph</label>
                  <textarea
                    rows={3}
                    value={formData.hero?.description || ''}
                    onChange={(e) => handleFieldChange('hero', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none leading-relaxed"
                    placeholder="Enter hero paragraph..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Primary Button Text</label>
                  <input
                    type="text"
                    value={formData.hero?.primaryButtonText || ''}
                    onChange={(e) => handleFieldChange('hero', 'primaryButtonText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Register as Member / Pass"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Primary Button Route / Link</label>
                  <input
                    type="text"
                    value={formData.hero?.primaryButtonLink || ''}
                    onChange={(e) => handleFieldChange('hero', 'primaryButtonLink', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="/register"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Secondary Button Text</label>
                  <input
                    type="text"
                    value={formData.hero?.secondaryButtonText || ''}
                    onChange={(e) => handleFieldChange('hero', 'secondaryButtonText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Explore Projects"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Secondary Button Route / Link</label>
                  <input
                    type="text"
                    value={formData.hero?.secondaryButtonLink || ''}
                    onChange={(e) => handleFieldChange('hero', 'secondaryButtonLink', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="/projects"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Security / Architecture Pill</label>
                  <input
                    type="text"
                    value={formData.hero?.securityPill || ''}
                    onChange={(e) => handleFieldChange('hero', 'securityPill', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:border-yellow-400 focus:outline-none"
                    placeholder="OWASP ASVS 4.0 Verified Architecture • Strict RBAC & Anti-Enumeration Tokens"
                  />
                </div>
              </div>

              {/* Metric Counters (Ribbon) */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Metrics Ribbon Counters ({formData.hero?.metrics?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddArrayItem('hero', 'metrics', { val: '100+', label: 'New Metric', desc: 'Metric description' })}
                    className="text-[11px] font-mono border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Add Metric
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.hero?.metrics?.map((met, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={met.val}
                          onChange={(e) => handleArrayItemChange('hero', 'metrics', idx, 'val', e.target.value)}
                          placeholder="500+"
                          className="w-24 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-sm font-bold font-mono text-yellow-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <button
                          onClick={() => handleRemoveArrayItem('hero', 'metrics', idx)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Remove Metric"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={met.label}
                        onChange={(e) => handleArrayItemChange('hero', 'metrics', idx, 'label', e.target.value)}
                        placeholder="Active Innovators"
                        className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-yellow-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={met.desc}
                        onChange={(e) => handleArrayItemChange('hero', 'metrics', idx, 'desc', e.target.value)}
                        placeholder="Short subtitle description"
                        className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              3. VIDEO SHOWCASE & CHAPTERS
             ======================================================== */}
          {activeSection === 'introVideo' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Video className="w-5 h-5 text-yellow-400" /> Video Showcase &amp; Chapters
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Configure the 4K video reel link (YouTube, Vimeo, MP4), thumbnail banner, telemetry badges, and chapter preview ticker cards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-yellow-400 font-bold flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" /> Video URL (YouTube, Vimeo, or MP4)
                  </label>
                  <input
                    type="text"
                    value={formData.introVideo?.videoUrl || ''}
                    onChange={(e) => handleFieldChange('introVideo', 'videoUrl', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-yellow-500/40 text-yellow-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or leave empty for simulated lab reel"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={formData.introVideo?.thumbnailUrl || ''}
                    onChange={(e) => handleFieldChange('introVideo', 'thumbnailUrl', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Section Tag</label>
                  <input
                    type="text"
                    value={formData.introVideo?.tag || ''}
                    onChange={(e) => handleFieldChange('introVideo', 'tag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="VIDEO SHOWCASE & TOUR"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Title</label>
                  <input
                    type="text"
                    value={formData.introVideo?.title || ''}
                    onChange={(e) => handleFieldChange('introVideo', 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Experience GUSAC in Action"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Description</label>
                  <textarea
                    rows={2}
                    value={formData.introVideo?.description || ''}
                    onChange={(e) => handleFieldChange('introVideo', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Take a high-octane visual journey inside our autonomous robotics arena..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Play Button Subtitle</label>
                  <input
                    type="text"
                    value={formData.introVideo?.buttonText || ''}
                    onChange={(e) => handleFieldChange('introVideo', 'buttonText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="CLICK TO WATCH GUSAC SHOWCASE"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Feature Subtitle</label>
                  <input
                    type="text"
                    value={formData.introVideo?.featureText || ''}
                    onChange={(e) => handleFieldChange('introVideo', 'featureText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Featuring Student Rovers, Drones & Cybersecurity"
                  />
                </div>
              </div>

              {/* Video Chapters */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Video Chapters ({formData.introVideo?.chapters?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddArrayItem('introVideo', 'chapters', { title: 'New Chapter', tag: 'Lab Bay', time: '01:00', desc: 'Chapter description' })}
                    className="text-[11px] font-mono border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Add Chapter
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.introVideo?.chapters?.map((ch, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => handleArrayItemChange('introVideo', 'chapters', idx, 'title', e.target.value)}
                          placeholder="Chapter Title (e.g. 01. Autonomous UAVs)"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-yellow-400 focus:outline-none font-bold"
                        />
                        <button
                          onClick={() => handleRemoveArrayItem('introVideo', 'chapters', idx)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Remove Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <input
                          type="text"
                          value={ch.tag}
                          onChange={(e) => handleArrayItemChange('introVideo', 'chapters', idx, 'tag', e.target.value)}
                          placeholder="Tag (e.g. Aero Flight Bay)"
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-yellow-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={ch.time}
                          onChange={(e) => handleArrayItemChange('introVideo', 'chapters', idx, 'time', e.target.value)}
                          placeholder="Timecode (e.g. 00:15)"
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:border-yellow-400 focus:outline-none"
                        />
                      </div>

                      <input
                        type="text"
                        value={ch.desc}
                        onChange={(e) => handleArrayItemChange('introVideo', 'chapters', idx, 'desc', e.target.value)}
                        placeholder="Brief summary of what happens in this chapter..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              4. FEATURED PROJECTS HEADING
             ======================================================== */}
          {activeSection === 'featuredProjectsHeading' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Layers className="w-5 h-5 text-yellow-400" /> Featured Projects Section Header
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Edit the showcase header above the student project cards on the homepage.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Category Badge / Tag</label>
                  <input
                    type="text"
                    value={formData.featuredProjectsHeading?.tag || ''}
                    onChange={(e) => handleFieldChange('featuredProjectsHeading', 'tag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:border-yellow-400 focus:outline-none font-bold"
                    placeholder="Open Innovation Showcase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Main Title</label>
                  <input
                    type="text"
                    value={formData.featuredProjectsHeading?.title || ''}
                    onChange={(e) => handleFieldChange('featuredProjectsHeading', 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none font-bold text-base"
                    placeholder="Featured Student Projects"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Description Subtitle</label>
                  <textarea
                    rows={3}
                    value={formData.featuredProjectsHeading?.description || ''}
                    onChange={(e) => handleFieldChange('featuredProjectsHeading', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-yellow-400 focus:outline-none leading-relaxed"
                    placeholder="Groundbreaking hardware, AI systems, autonomous rovers, and security platforms built by GITAM students."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              5. CAMPUS LOCATION & FACILITIES
             ======================================================== */}
          {activeSection === 'location' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-400" /> Campus Location, Map &amp; Prototyping Facilities
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Control the Google Map iframe embed, headquarters address, transit distance chips, contact numbers, and all facility cards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Section Tag</label>
                  <input
                    type="text"
                    value={formData.location?.tag || ''}
                    onChange={(e) => handleFieldChange('location', 'tag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Campus Location & Directions"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Title</label>
                  <input
                    type="text"
                    value={formData.location?.title || ''}
                    onChange={(e) => handleFieldChange('location', 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Locate GUSAC Labs"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Description</label>
                  <textarea
                    rows={2}
                    value={formData.location?.description || ''}
                    onChange={(e) => handleFieldChange('location', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Situated right along the scenic Rushikonda Beach coastline on the sprawling 100-acre GITAM Visakhapatnam Campus."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-yellow-400 font-bold">Google Maps Embed URL (iframe src)</label>
                  <input
                    type="text"
                    value={formData.location?.mapEmbedUrl || ''}
                    onChange={(e) => handleFieldChange('location', 'mapEmbedUrl', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-yellow-500/40 text-yellow-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">GPS Coordinates Display</label>
                  <input
                    type="text"
                    value={formData.location?.mapGps || ''}
                    onChange={(e) => handleFieldChange('location', 'mapGps', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="GUSAC GPS: 17.7816° N, 83.3776° E"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Campus Area Subtitle</label>
                  <input
                    type="text"
                    value={formData.location?.campusSubtitle || ''}
                    onChange={(e) => handleFieldChange('location', 'campusSubtitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Rushikonda, Visakhapatnam, AP"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Headquarters Address</label>
                  <input
                    type="text"
                    value={formData.location?.address || ''}
                    onChange={(e) => handleFieldChange('location', 'address', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Student Activity Center, ICT Bhavan, GITAM Deemed to be University, Gandhi Nagar, Rushikonda, Visakhapatnam, AP 530045"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Airport Distance Chip</label>
                  <input
                    type="text"
                    value={formData.location?.airportDistance || ''}
                    onChange={(e) => handleFieldChange('location', 'airportDistance', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="22 KM (40 min)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Railway Stn Distance Chip</label>
                  <input
                    type="text"
                    value={formData.location?.railwayDistance || ''}
                    onChange={(e) => handleFieldChange('location', 'railwayDistance', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="14 KM (25 min)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Contact Phone Number</label>
                  <input
                    type="text"
                    value={formData.location?.contactPhone || ''}
                    onChange={(e) => handleFieldChange('location', 'contactPhone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="+91 (891) 2840501"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Contact Email</label>
                  <input
                    type="text"
                    value={formData.location?.contactEmail || ''}
                    onChange={(e) => handleFieldChange('location', 'contactEmail', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="gusac@gitam.edu"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Lab Access Hours</label>
                  <input
                    type="text"
                    value={formData.location?.labHours || ''}
                    onChange={(e) => handleFieldChange('location', 'labHours', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Lab Hours: 24/7 for Inducted Members (Biometric Access)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Visitor / Delegation Hours</label>
                  <input
                    type="text"
                    value={formData.location?.visitorHours || ''}
                    onChange={(e) => handleFieldChange('location', 'visitorHours', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Mon - Sat: 09:00 AM - 06:00 PM"
                  />
                </div>
              </div>

              {/* Prototyping Facilities List */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Prototyping Facilities &amp; Lab Bays ({formData.location?.facilities?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddArrayItem('location', 'facilities', {
                      id: `facility-${Date.now()}`,
                      name: 'New Prototyping Bay',
                      building: 'Tech Block 1',
                      desc: 'Facility capabilities and machinery...',
                      color: 'border-yellow-500/50 text-yellow-400',
                      badge: 'New Hub'
                    })}
                    className="text-[11px] font-mono border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Add Facility
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.location?.facilities?.map((fac, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={fac.name}
                          onChange={(e) => handleArrayItemChange('location', 'facilities', idx, 'name', e.target.value)}
                          placeholder="Facility Name (e.g. GUSAC Central Arena)"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-yellow-400 focus:outline-none font-bold"
                        />
                        <input
                          type="text"
                          value={fac.badge}
                          onChange={(e) => handleArrayItemChange('location', 'facilities', idx, 'badge', e.target.value)}
                          placeholder="Badge (e.g. Main Hub)"
                          className="w-28 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-yellow-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <button
                          onClick={() => handleRemoveArrayItem('location', 'facilities', idx)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Remove Facility"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={fac.building}
                        onChange={(e) => handleArrayItemChange('location', 'facilities', idx, 'building', e.target.value)}
                        placeholder="Building / Room (e.g. ICT Bhavan Ground & 1st Floor)"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-yellow-400/90 focus:border-yellow-400 focus:outline-none"
                      />

                      <textarea
                        rows={2}
                        value={fac.desc}
                        onChange={(e) => handleArrayItemChange('location', 'facilities', idx, 'desc', e.target.value)}
                        placeholder="Detailed machinery, equipment, tools and capabilities available in this lab..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              6. ABOUT & SOCIAL
             ======================================================== */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" /> About GUSAC &amp; Social Links
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Manage the official foundation story, mission summary, stat metrics, and social media links.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Tag</label>
                  <input
                    type="text"
                    value={formData.about?.tag || ''}
                    onChange={(e) => handleFieldChange('about', 'tag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:border-yellow-400 focus:outline-none font-bold"
                    placeholder="About GUSAC GITAM"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Title</label>
                  <input
                    type="text"
                    value={formData.about?.title || ''}
                    onChange={(e) => handleFieldChange('about', 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none font-bold text-base"
                    placeholder="Empowering Next-Generation Tech Leaders Since 2011"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Story / Narrative</label>
                  <textarea
                    rows={4}
                    value={formData.about?.story || ''}
                    onChange={(e) => handleFieldChange('about', 'story', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none leading-relaxed"
                    placeholder="GUSAC (GITAM University Science and Activity Center) is an autonomous student innovation body incubating groundbreaking projects..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Contact Email</label>
                    <input
                      type="text"
                      value={formData.about?.contactEmail || ''}
                      onChange={(e) => handleFieldChange('about', 'contactEmail', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                      placeholder="gusac@gitam.edu"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.about?.contactPhone || ''}
                      onChange={(e) => handleFieldChange('about', 'contactPhone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                      placeholder="+91 (891) 2840501"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    About Section Stats ({formData.about?.stats?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddArrayItem('about', 'stats', { label: 'New Metric', value: '100+' })}
                    className="text-[11px] font-mono border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Add Stat
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {formData.about?.stats?.map((st, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => handleArrayItemChange('about', 'stats', idx, 'label', e.target.value)}
                          placeholder="Active Members"
                          className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:border-yellow-400 focus:outline-none"
                        />
                        <button
                          onClick={() => handleRemoveArrayItem('about', 'stats', idx)}
                          className="text-slate-500 hover:text-red-400 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => handleArrayItemChange('about', 'stats', idx, 'value', e.target.value)}
                        placeholder="1,250+"
                        className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-bold font-mono text-yellow-400 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Social Media Profiles ({formData.about?.socialLinks?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddArrayItem('about', 'socialLinks', { platform: 'New Platform', url: 'https://', color: 'text-blue-400' })}
                    className="text-[11px] font-mono border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Add Profile
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {formData.about?.socialLinks?.map((soc, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                      <input
                        type="text"
                        value={soc.platform}
                        onChange={(e) => handleArrayItemChange('about', 'socialLinks', idx, 'platform', e.target.value)}
                        placeholder="Platform (e.g. Instagram)"
                        className="w-36 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-yellow-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => handleArrayItemChange('about', 'socialLinks', idx, 'url', e.target.value)}
                        placeholder="Profile URL"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-blue-400 focus:border-yellow-400 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveArrayItem('about', 'socialLinks', idx)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              7. FAQ MANAGER
             ======================================================== */}
          {activeSection === 'faq' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-yellow-400" /> FAQ (Frequently Asked Questions) Manager
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Add, edit, or remove questions and answers displayed in the interactive accordion.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Section Tag</label>
                  <input
                    type="text"
                    value={formData.faq?.tag || ''}
                    onChange={(e) => handleFieldChange('faq', 'tag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 focus:border-yellow-400 focus:outline-none font-bold"
                    placeholder="Frequently Asked Questions"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Title</label>
                  <input
                    type="text"
                    value={formData.faq?.title || ''}
                    onChange={(e) => handleFieldChange('faq', 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none font-bold text-base"
                    placeholder="Everything You Need to Know About GUSAC"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Subtitle</label>
                  <input
                    type="text"
                    value={formData.faq?.subtitle || ''}
                    onChange={(e) => handleFieldChange('faq', 'subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Have more questions? Reach out to our student council at gusac@gitam.edu"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Bottom CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.faq?.ctaText || ''}
                    onChange={(e) => handleFieldChange('faq', 'ctaText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="Ready to join? Register for GUSAC Community & Events →"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Bottom CTA Button Link</label>
                  <input
                    type="text"
                    value={formData.faq?.ctaLink || ''}
                    onChange={(e) => handleFieldChange('faq', 'ctaLink', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="/register"
                  />
                </div>
              </div>

              {/* FAQ Questions List */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Questions &amp; Answers ({formData.faq?.items?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddArrayItem('faq', 'items', {
                      q: 'New Question?',
                      a: 'Detailed and clear explanation answering the question...'
                    })}
                    className="text-[11px] font-mono border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Add FAQ Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.faq?.items?.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.q}
                          onChange={(e) => handleArrayItemChange('faq', 'items', idx, 'q', e.target.value)}
                          placeholder="Question (e.g. Who is eligible to join GUSAC?)"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-yellow-400 focus:outline-none font-bold"
                        />
                        <button
                          onClick={() => handleRemoveArrayItem('faq', 'items', idx)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Remove Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={item.a}
                        onChange={(e) => handleArrayItemChange('faq', 'items', idx, 'a', e.target.value)}
                        placeholder="Comprehensive answer..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:border-yellow-400 focus:outline-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              8. COUNCIL & LEADERS
             ======================================================== */}
          {activeSection === 'council' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" /> Council Leadership &amp; Mentors
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Manage the student leads, mentors, roles, wings, bios, badges, and social links displayed on the Team page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Section Tag</label>
                  <input
                    type="text"
                    value={formData.council?.tag || ''}
                    onChange={(e) => handleFieldChange('council', 'tag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 focus:border-yellow-400 focus:outline-none font-bold"
                    placeholder="Leadership & Faculty Mentorship"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Title</label>
                  <input
                    type="text"
                    value={formData.council?.title || ''}
                    onChange={(e) => handleFieldChange('council', 'title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none font-bold text-base"
                    placeholder="GUSAC Council & Hall of Fame"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Description Subtitle</label>
                  <input
                    type="text"
                    value={formData.council?.description || ''}
                    onChange={(e) => handleFieldChange('council', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="The student leads, domain directors, faculty advisors, and national champions driving innovation at GITAM University."
                  />
                </div>
              </div>

              {/* Council Members List */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Council Members ({formData.council?.members?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddArrayItem('council', 'members', {
                      id: `c-${Date.now()}`,
                      name: 'Student Lead Name',
                      role: 'Technical Lead',
                      wing: 'Projects & Innovations',
                      year: 'Final Year B.Tech',
                      avatarLetter: 'S',
                      bio: 'Passionate innovator leading hardware and software teams at GUSAC.',
                      linkedin: 'https://linkedin.com',
                      github: 'https://github.com',
                      badges: ['Leader', 'Innovator']
                    })}
                    className="text-[11px] font-mono border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Add Member
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.council?.members?.map((mem, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={mem.avatarLetter}
                          onChange={(e) => handleArrayItemChange('council', 'members', idx, 'avatarLetter', e.target.value)}
                          placeholder="A"
                          className="w-12 text-center px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-black font-mono text-yellow-400 focus:border-yellow-400 focus:outline-none uppercase"
                          title="Avatar Initial"
                        />
                        <input
                          type="text"
                          value={mem.name}
                          onChange={(e) => handleArrayItemChange('council', 'members', idx, 'name', e.target.value)}
                          placeholder="Full Name"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-yellow-400 focus:outline-none font-bold"
                        />
                        <input
                          type="text"
                          value={mem.role}
                          onChange={(e) => handleArrayItemChange('council', 'members', idx, 'role', e.target.value)}
                          placeholder="Role (e.g. Student President)"
                          className="w-48 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-yellow-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <button
                          onClick={() => handleRemoveArrayItem('council', 'members', idx)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <input
                          type="text"
                          value={mem.wing}
                          onChange={(e) => handleArrayItemChange('council', 'members', idx, 'wing', e.target.value)}
                          placeholder="Domain / Department"
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:border-yellow-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={mem.year}
                          onChange={(e) => handleArrayItemChange('council', 'members', idx, 'year', e.target.value)}
                          placeholder="Year / Program"
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:border-yellow-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={mem.linkedin}
                          onChange={(e) => handleArrayItemChange('council', 'members', idx, 'linkedin', e.target.value)}
                          placeholder="LinkedIn URL"
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={mem.github}
                          onChange={(e) => handleArrayItemChange('council', 'members', idx, 'github', e.target.value)}
                          placeholder="GitHub URL"
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:border-yellow-400 focus:outline-none"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={mem.bio}
                        onChange={(e) => handleArrayItemChange('council', 'members', idx, 'bio', e.target.value)}
                        placeholder="Short biography and achievements..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              9. FOOTER & SECURITY
             ======================================================== */}
          {activeSection === 'footer' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" /> Footer, Address &amp; Security Specs
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Update the bottom brand statement, official email, address, copyright notice, and OWASP badges.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Brand Description Statement</label>
                  <textarea
                    rows={3}
                    value={formData.footer?.description || ''}
                    onChange={(e) => handleFieldChange('footer', 'description', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none leading-relaxed"
                    placeholder="GUSAC (GITAM University Science and Activity Center) is the premier student innovation ecosystem..."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Security Badge Text</label>
                  <input
                    type="text"
                    value={formData.footer?.securityBadge || ''}
                    onChange={(e) => handleFieldChange('footer', 'securityBadge', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:border-yellow-400 focus:outline-none"
                    placeholder="OWASP ASVS 4.0 Level 2 Verified Architecture"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-slate-300 font-bold">Official Campus Address</label>
                  <input
                    type="text"
                    value={formData.footer?.address || ''}
                    onChange={(e) => handleFieldChange('footer', 'address', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="GUSAC Central Labs, GITAM Deemed to be University, Visakhapatnam, AP, India"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Official Email</label>
                  <input
                    type="text"
                    value={formData.footer?.email || ''}
                    onChange={(e) => handleFieldChange('footer', 'email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="gusac@gitam.edu"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Copyright Statement</label>
                  <input
                    type="text"
                    value={formData.footer?.copyright || ''}
                    onChange={(e) => handleFieldChange('footer', 'copyright', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="© 2026 GUSAC — GITAM University Science and Activity Center. All rights reserved."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Bottom Security Note</label>
                  <input
                    type="text"
                    value={formData.footer?.securityNote || ''}
                    onChange={(e) => handleFieldChange('footer', 'securityNote', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 focus:border-yellow-400 focus:outline-none"
                    placeholder="● End-to-End Encryption Verified"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Encryption / Cipher Tag</label>
                  <input
                    type="text"
                    value={formData.footer?.cipherNote || ''}
                    onChange={(e) => handleFieldChange('footer', 'cipherNote', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 focus:border-yellow-400 focus:outline-none"
                    placeholder="Argon2id Salted Hashes"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
