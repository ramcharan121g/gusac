import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import { broadcastUpdate } from '../utils/sync';
import QrAttendanceScanner from '../components/QrAttendanceScanner';
import SiteContentEditor from '../components/SiteContentEditor';
import {
  Sliders,
  ShieldAlert,
  ShieldCheck,
  Users,
  FolderGit2,
  Calendar,
  Lock,
  Trash2,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Download,
  Terminal,
  Activity,
  Plus,
  Ticket,
  Camera,
  History,
  CreditCard,
  Building,
  GraduationCap,
  Image as ImageIcon,
  Video,
  Upload,
  Play,
  Film,
  Link2,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

export default function AdminDashboard() {
  const { user, requestReAuth } = useAuth();
  const navigate = useNavigate();

  // Active tab: 'overview' | 'attendance' | 'passes' | 'events' | 'users' | 'projects' | 'audit'
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [passesList, setPassesList] = useState([]);
  const [approvalsList, setApprovalsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditFilter, setAuditFilter] = useState('');
  const [userFilter, setUserFilter] = useState('all'); // 'all' | 'gitam' | 'external' | 'admin'
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '10:00 AM IST',
    venue: 'GUSAC Central Labs',
    category: 'Hands-on Workshop',
    badgeColor: '#124EB4',
    capacity: 100,
    fee: 0,
    status: 'upcoming',
    description: '',
    prizePool: '₹25,000 + Incubation Grants',
    coverImage: '',
    videoUrl: ''
  });

  const [coverSourceType, setCoverSourceType] = useState('preset'); // 'preset' | 'url' | 'upload'
  const [videoSourceType, setVideoSourceType] = useState('url'); // 'url' | 'upload'

  const PRESET_COVERS = [
    { label: '🚁 Aero & Drone Prix', url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80' },
    { label: '🤖 Robotics Combat', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80' },
    { label: '💻 24h Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
    { label: '🛰️ Space Exploration', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' }
  ];

  const handleCoverFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        setNewEvent((prev) => ({ ...prev, coverImage: evt.target?.result || '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 80 * 1024 * 1024) {
        alert('Video file size exceeds 80MB limit for local browser upload.');
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setNewEvent((prev) => ({ ...prev, videoUrl: objectUrl }));
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [st, u, pr, lg, ev, ps, app] = await Promise.all([
        apiRequest('/admin/stats'),
        apiRequest('/admin/users'),
        apiRequest('/projects'),
        apiRequest('/audit?limit=50'),
        apiRequest('/events'),
        apiRequest('/admin/passes'),
        apiRequest('/admin/approvals').catch(() => ({ applications: [] }))
      ]);
      setStats(st);
      setUsersList(u.users || []);
      setProjectsList(pr.projects || []);
      setAuditLogs(lg.logs || []);
      setEventsList(ev.events || []);
      setPassesList(ps.passes || []);
      setApprovalsList(app?.applications || []);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sensitive Action: Change User Role (Requires Step-Up Re-Auth)
  const handleChangeRole = (targetUser, newRole) => {
    requestReAuth(
      `Role Elevation for ${targetUser.name} to '${newRole}'`,
      async (reauthCredentials) => {
        const res = await apiRequest(`/admin/users/${targetUser.id}/role`, {
          method: 'POST',
          headers: {
            'x-reauth-password': reauthCredentials.password || '',
            'x-reauth-mfa': reauthCredentials.mfaCode || ''
          },
          body: { newRole }
        });
        setActionNotice(res.message);
        fetchAdminData();
        broadcastUpdate('USER_UPDATED');
      }
    );
  };

  // Sensitive Action: Delete User (Requires Step-Up Re-Auth)
  const handleDeleteUser = (targetUser) => {
    requestReAuth(
      `Permanent Account Deletion for ${targetUser.name} (${targetUser.email})`,
      async (reauthCredentials) => {
        const res = await apiRequest(`/admin/users/${targetUser.id}`, {
          method: 'DELETE',
          headers: {
            'x-reauth-password': reauthCredentials.password || '',
            'x-reauth-mfa': reauthCredentials.mfaCode || ''
          }
        });
        setActionNotice(res.message);
        fetchAdminData();
        broadcastUpdate('USER_UPDATED');
      }
    );
  };

  // Sensitive Action: Data Export (Requires Step-Up Re-Auth)
  const handleExportData = () => {
    requestReAuth(
      'Full Security Audit & Database Export',
      async (reauthCredentials) => {
        const res = await apiRequest('/admin/export-data', {
          method: 'POST',
          headers: {
            'x-reauth-password': reauthCredentials.password || '',
            'x-reauth-mfa': reauthCredentials.mfaCode || ''
          }
        });

        const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GUSAC_Security_Audit_Snapshot_${Date.now()}.json`;
        a.click();

        setActionNotice('System snapshot & audit log successfully exported with encrypted signature.');
        fetchAdminData();
      }
    );
  };

  // Project Moderation
  const handleProjectStatus = async (projectId, status) => {
    try {
      const res = await apiRequest(`/admin/projects/${projectId}/status`, {
        method: 'POST',
        body: { status }
      });
      setActionNotice(res.message);
      fetchAdminData();
      broadcastUpdate('PROJECTS_UPDATED');
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Event Creation
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/events', {
        method: 'POST',
        body: newEvent
      });
      setActionNotice(res.message);
      setNewEvent({
        title: '',
        date: '',
        time: '10:00 AM IST',
        venue: 'GUSAC Central Labs',
        category: 'Hands-on Workshop',
        badgeColor: '#124EB4',
        capacity: 100,
        fee: 0,
        status: 'upcoming',
        description: '',
        prizePool: '₹25,000 + Incubation Grants',
        coverImage: '',
        videoUrl: ''
      });
      fetchAdminData();
      broadcastUpdate('EVENTS_UPDATED');
    } catch (err) {
      alert(err.message || 'Failed to create event');
    }
  };

  // Delete Event
  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      const res = await apiRequest(`/admin/events/${eventId}`, { method: 'DELETE' });
      setActionNotice(res.message);
      fetchAdminData();
      broadcastUpdate('EVENTS_UPDATED');
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    }
  };

  // Toggle Event Status (Upcoming <-> Past)
  const handleToggleEventStatus = async (eventId) => {
    try {
      const res = await apiRequest(`/admin/events/${eventId}/toggle-status`, { method: 'POST' });
      setActionNotice(res.message);
      fetchAdminData();
      broadcastUpdate('EVENTS_UPDATED');
    } catch (err) {
      alert(err.message || 'Failed to toggle event status');
    }
  };

  // Process Leadership Application Decision (Approve / Reject)
  const handleApprovalDecision = async (appId, decision) => {
    const remarks = window.prompt(
      decision === 'APPROVED'
        ? 'Enter congratulatory remarks or instructions for the student:'
        : 'Enter review feedback for the student:'
    );
    if (remarks === null) return; // User cancelled prompt
    try {
      const res = await apiRequest(`/admin/approvals/${appId}/decide`, {
        method: 'POST',
        body: { decision, remarks }
      });
      setActionNotice(res.message);
      fetchAdminData();
      broadcastUpdate('USER_UPDATED');
    } catch (err) {
      alert(err.message || 'Failed to process leadership decision');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Filter users by category
  const filteredUsers = usersList.filter((u) => {
    if (userFilter === 'gitam') return u.userType === 'gitam';
    if (userFilter === 'external') return u.userType === 'external';
    if (userFilter === 'admin') return u.role === 'admin';
    return true;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Admin Top Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-red-950/50 via-slate-900 to-slate-900 border border-red-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-red-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">GUSAC Admin Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                MFA Verified
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Official Management for Events, Passes, Attendance &amp; User Registries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-white flex items-center gap-2 transition-colors"
            title="Requires step-up MFA re-authentication"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export Audit (Re-Auth)
          </button>
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'overview' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" /> Overview &amp; Health
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg'
              : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>QR Attendance &amp; Scanner</span>
          <span className="text-[9px] bg-red-500/40 text-red-200 px-1 py-0.5 rounded font-bold">Admin Only</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'content'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold shadow-lg'
              : 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Site Content CMS</span>
          <span className="text-[9px] bg-yellow-400/30 text-yellow-300 px-1.5 py-0.5 rounded font-bold">Edit All Pages</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'approvals'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg'
              : 'text-purple-400 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>Leadership Approvals</span>
          {approvalsList.filter((a) => a.status === 'PENDING').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-500 text-white font-bold animate-pulse">
              {approvalsList.filter((a) => a.status === 'PENDING').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('passes')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'passes' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Ticket className="w-4 h-4" /> Pass Registry ({passesList.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'events' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Event Management ({eventsList.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'users' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> User Management ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'projects' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4" /> Projects ({projectsList.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'audit' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" /> Audit Stream ({auditLogs.length})
        </button>
      </div>

      {/* ========================================================
          TAB: QR ATTENDANCE SCANNER & ENTRY VERIFICATION
         ======================================================== */}
      {activeTab === 'attendance' && (
        <QrAttendanceScanner />
      )}

      {/* ========================================================
          TAB: UNIVERSAL SITE CONTENT CMS (EDIT EVERYTHING)
         ======================================================== */}
      {activeTab === 'content' && (
        <div className="animate-in fade-in">
          <SiteContentEditor />
        </div>
      )}

      {/* ========================================================
          TAB: DIGITAL PASS REGISTRY
         ======================================================== */}
      {activeTab === 'passes' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Ticket className="w-5 h-5 text-yellow-400" /> Digital Pass Registry
              </h3>
              <p className="text-xs font-mono text-slate-400">
                All generated event access passes, payment transactions, and admission statuses.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Total Passes: <strong className="text-white">{passesList.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-slate-400 border-b border-slate-800 uppercase">
                <tr>
                  <th className="p-4">Ticket Pass ID</th>
                  <th className="p-4">Attendee Name</th>
                  <th className="p-4">User Type</th>
                  <th className="p-4">Event Name</th>
                  <th className="p-4">Payment Info</th>
                  <th className="p-4">Check-In Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {passesList.map((pass) => (
                  <tr key={pass.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-yellow-400">{pass.ticketCode}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{pass.userName}</div>
                      <div className="text-[11px] text-slate-400">{pass.userEmail}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pass.userType === 'gitam' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {pass.userType === 'gitam' ? 'GITAM' : 'External'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{pass.eventTitle}</td>
                    <td className="p-4">
                      <div className="text-white font-bold">{pass.paymentStatus === 'free' ? 'Complimentary' : `₹${pass.paymentAmount}`}</div>
                      <div className="text-[10px] text-slate-500">{pass.paymentMethod}</div>
                    </td>
                    <td className="p-4">
                      {pass.checkedIn ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Admitted
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold text-[10px]">○ Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 1: STATS & SYSTEM HEALTH
         ======================================================== */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase">Registered Innovators</span>
              <div className="text-3xl font-bold text-white font-mono mt-2">{stats.totalUsers}</div>
              <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                {stats.mfaEnabledUsers} with MFA enabled
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase">Active Event Passes</span>
              <div className="text-3xl font-bold text-yellow-400 font-mono mt-2">{passesList.length}</div>
              <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                QR Passes Issued
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase">Total Events Listed</span>
              <div className="text-3xl font-bold text-blue-400 font-mono mt-2">{eventsList.length}</div>
              <span className="text-[11px] font-mono text-blue-400 mt-1 block">
                Upcoming &amp; Past Fests
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase">OWASP ASVS Score</span>
              <div className="text-3xl font-bold text-emerald-400 font-mono mt-2">{stats.securityHealthScore}%</div>
              <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                Level 2 Verification
              </span>
            </div>
          </div>

          {/* OWASP Architecture Health Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security Controls &amp; ASVS Baseline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold block">Argon2id Hashing:</span>
                <span className="text-slate-300">{stats.owaspCompliance?.cryptoAlgorithm}</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold block">Rate Limiting:</span>
                <span className="text-blue-400">{stats.owaspCompliance?.rateLimiting}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: EVENT MANAGEMENT & PUBLISHER
         ======================================================== */}
      {activeTab === 'events' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* New Event Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Create / Publish New Event</h3>
                <p className="text-xs text-slate-400 font-mono">Will be broadcasted to all students and external attendees</p>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Drone Racing Prix"
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={newEvent.category || 'Hands-on Workshop'}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Flagship Fest">Flagship Fest</option>
                    <option value="Hands-on Workshop">Hands-on Workshop</option>
                    <option value="CyberSecurity & CTF">CyberSecurity &amp; CTF</option>
                    <option value="Science Expedition">Science Expedition</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. April 12, 2026"
                    value={newEvent.date || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 05:00 PM IST"
                    value={newEvent.time || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Registration Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 for free, e.g. 199"
                    value={newEvent.fee ?? ''}
                    onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Event Status</label>
                  <select
                    value={newEvent.status || 'upcoming'}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="upcoming">Upcoming Event</option>
                    <option value="past">Past / Concluded Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GUSAC Robotics Bay, Tech Park"
                  value={newEvent.venue || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview of the event, activities, and workshops..."
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Cover Page Selection & Upload */}
              <div className="p-5 rounded-2xl bg-black/40 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-slate-200 font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Event Cover Page (Poster / Hero Banner)</span>
                  </label>
                  <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCoverSourceType('preset')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        coverSourceType === 'preset' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverSourceType('url')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        coverSourceType === 'url' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverSourceType('upload')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        coverSourceType === 'upload' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {coverSourceType === 'preset' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_COVERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, coverImage: preset.url })}
                        className={`p-2 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                          newEvent.coverImage === preset.url
                            ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                            : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="h-16 rounded-lg overflow-hidden bg-black/60">
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-semibold truncate">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {coverSourceType === 'url' && (
                  <input
                    type="url"
                    placeholder="Paste high-res image link (e.g. https://images.unsplash.com/...)"
                    value={newEvent.coverImage || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, coverImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                )}

                {coverSourceType === 'upload' && (
                  <div className="p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/80 bg-slate-900/40 text-center transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      id="cover-upload"
                      className="hidden"
                      onChange={handleCoverFileUpload}
                    />
                    <label htmlFor="cover-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <Upload className="w-5 h-5 text-blue-400" />
                      <span className="text-xs text-slate-300 font-semibold">Choose an image file (.png, .jpg, .webp)</span>
                      <span className="text-[10px] text-slate-500">Max size 5MB • Instant browser preview</span>
                    </label>
                  </div>
                )}

                {/* Cover Live Preview */}
                {newEvent.coverImage && (
                  <div className="relative rounded-2xl overflow-hidden border border-blue-500/40 h-36 bg-slate-950">
                    <img
                      src={newEvent.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover brightness-[0.8]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Cover Preview Active
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, coverImage: '' })}
                        className="px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white text-[10px] transition-colors"
                      >
                        Remove Cover
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Upload / Embed Option */}
              <div className="p-5 rounded-2xl bg-black/40 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-slate-200 font-bold flex items-center gap-2">
                    <Film className="w-4 h-4 text-red-400" />
                    <span>Event Promo / Teaser Video (Optional)</span>
                  </label>
                  <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setVideoSourceType('url')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        videoSourceType === 'url' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Video URL (YouTube/MP4)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceType('upload')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        videoSourceType === 'upload' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Upload Video File
                    </button>
                  </div>
                </div>

                {videoSourceType === 'url' ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 link"
                      value={newEvent.videoUrl || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, videoUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    />
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <Link2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Supports YouTube, Vimeo, and direct cloud `.mp4` / `.webm` video streams</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-red-500/80 bg-slate-900/40 text-center transition-colors">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      id="video-upload"
                      className="hidden"
                      onChange={handleVideoFileUpload}
                    />
                    <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <Video className="w-5 h-5 text-red-400" />
                      <span className="text-xs text-slate-300 font-semibold">Choose a video file (.mp4, .webm)</span>
                      <span className="text-[10px] text-slate-500">Max 80MB • Playable directly in Event Details</span>
                    </label>
                  </div>
                )}

                {/* Video Live Preview */}
                {newEvent.videoUrl && (
                  <div className="p-3 rounded-2xl bg-black border border-red-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5 text-red-400">
                        <Play className="w-3.5 h-3.5 fill-red-400" /> Live Video Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, videoUrl: '' })}
                        className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white text-[10px] transition-colors"
                      >
                        Remove Video
                      </button>
                    </div>

                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      {getEmbedUrl(newEvent.videoUrl) ? (
                        <iframe
                          src={getEmbedUrl(newEvent.videoUrl)}
                          title="Video Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={newEvent.videoUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Publish Event
              </button>
            </form>
          </div>

          {/* Existing Events List */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white font-mono">
              All Configured Events ({eventsList.length})
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 text-slate-400 border-b border-slate-800 uppercase">
                  <tr>
                    <th className="p-4">Event Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date &amp; Fee</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {eventsList.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={ev.coverImage || ev.images?.[0] || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=200&q=80'}
                            alt={ev.title}
                            className="w-12 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white">{ev.title}</div>
                            {ev.videoUrl && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-mono">
                                <Video className="w-3 h-3" /> Has Video
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{ev.category}</td>
                      <td className="p-4 text-slate-400">
                        {ev.date} • {ev.isPaid ? `₹${ev.fee}` : 'Free'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.status === 'upcoming' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {ev.status === 'upcoming' ? 'Upcoming' : 'Past'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleEventStatus(ev.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                        >
                          Shift to {ev.status === 'past' ? 'Upcoming' : 'Past'}
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className="p-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB: LEADERSHIP APPROVALS QUEUE (MAIN HEADS & WING LEADS)
         ======================================================== */}
      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  Main Heads &amp; Wing Lead Approvals
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Strict Governance
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Review leadership applications, elevate member roles, and trigger automated decision emails via Brevo SMTP.
              </p>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                Pending: <strong>{approvalsList.filter((a) => a.status === 'PENDING').length}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                Approved: <strong>{approvalsList.filter((a) => a.status === 'APPROVED').length}</strong>
              </div>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 gap-4">
            {approvalsList.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 font-mono text-xs">
                No leadership applications in the queue at this time.
              </div>
            ) : (
              approvalsList.map((app) => (
                <div
                  key={app.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    app.status === 'PENDING'
                      ? 'bg-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20'
                      : app.status === 'APPROVED'
                      ? 'bg-slate-900/60 border-emerald-500/30'
                      : 'bg-slate-900/40 border-slate-800 opacity-75'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-bold text-white">{app.name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          app.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            : app.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {app.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                          Applying for: {app.requested_role}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                        <span>Email: <strong className="text-slate-200">{app.email}</strong></span>
                        <span>Student ID: <strong className="text-slate-200">{app.student_id || 'N/A'}</strong></span>
                        <span>Target Wing: <strong className="text-blue-400">{app.target_wing}</strong></span>
                        <span>Submitted: <strong>{new Date(app.created_at).toLocaleDateString()}</strong></span>
                      </div>

                      {app.statement_of_purpose && (
                        <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-300 font-sans italic mt-2">
                          “{app.statement_of_purpose}”
                        </div>
                      )}

                      {app.remarks && (
                        <div className="text-xs font-mono text-slate-400 mt-1">
                          Reviewer Remarks: <span className="text-amber-300 italic">{app.remarks}</span>
                          {app.reviewed_by && <span className="text-slate-500"> (by {app.reviewed_by})</span>}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {app.status === 'PENDING' ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleApprovalDecision(app.id, 'APPROVED')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve &amp; Elevate</span>
                        </button>
                        <button
                          onClick={() => handleApprovalDecision(app.id, 'REJECTED')}
                          className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/30 hover:border-red-600 text-red-300 hover:text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-right text-xs font-mono text-slate-500 shrink-0">
                        Decision finalized
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: RBAC USER MANAGEMENT (WITH GITAM VS EXTERNAL FILTER)
         ======================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 text-xs font-mono">
              <button
                onClick={() => setUserFilter('all')}
                className={`px-3 py-1.5 rounded-xl border ${
                  userFilter === 'all' ? 'bg-red-600 text-white font-bold border-red-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                All Users ({usersList.length})
              </button>
              <button
                onClick={() => setUserFilter('gitam')}
                className={`px-3 py-1.5 rounded-xl border ${
                  userFilter === 'gitam' ? 'bg-blue-600 text-white font-bold border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                GITAM Students
              </button>
              <button
                onClick={() => setUserFilter('external')}
                className={`px-3 py-1.5 rounded-xl border ${
                  userFilter === 'external' ? 'bg-emerald-600 text-white font-bold border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                External Users
              </button>
              <button
                onClick={() => setUserFilter('admin')}
                className={`px-3 py-1.5 rounded-xl border ${
                  userFilter === 'admin' ? 'bg-red-600 text-white font-bold border-red-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Admins
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-slate-400 border-b border-slate-800 uppercase">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Affiliation / Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">2FA</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.userType === 'gitam' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {u.userType === 'gitam' ? 'GITAM' : 'External'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      <div>{u.collegeOrCompany || 'GITAM University'}</div>
                      <div className="text-[11px] text-slate-500">{u.phone || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        u.mfaEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                      }`}>
                        {u.mfaEnabled ? 'ACTIVE' : 'OFF'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {u.role !== 'admin' ? (
                        <button
                          onClick={() => handleChangeRole(u, 'admin')}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/30 transition-colors"
                        >
                          Make Admin
                        </button>
                      ) : u.id !== user.id ? (
                        <button
                          onClick={() => handleChangeRole(u, 'user')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          Demote
                        </button>
                      ) : null}

                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: PROJECT MODERATION
         ======================================================== */}
      {activeTab === 'projects' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Domain Wing</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projectsList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{p.title}</td>
                    <td className="p-4 text-slate-300">{p.wing}</td>
                    <td className="p-4 text-slate-400">{p.author}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        p.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {p.status !== 'Approved' && (
                        <button
                          onClick={() => handleProjectStatus(p.id, 'Approved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-bold"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: LIVE AUDIT LOG STREAM
         ======================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Showing last 50 cryptographic audit events (Immutable Log)
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4 font-bold text-yellow-400">{log.action}</td>
                    <td className="p-4 text-slate-300">{log.actor}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 truncate max-w-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
