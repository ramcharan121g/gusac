import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import { subscribeToUpdates } from '../utils/sync';
import MfaModal from '../components/MfaModal';
import QRCode from 'qrcode';
import GusacLogo3D from '../components/GusacLogo3D';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  FolderGit2,
  Ticket,
  Key,
  Lock,
  QrCode,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'projects' | 'events' | 'security'
  const [myProjects, setMyProjects] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [idCardQr, setIdCardQr] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState('');
  const [securityError, setSecurityError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserDashboardData();
      generateIdBadgeQr();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUpdates((ev) => {
      if (['EVENTS_UPDATED', 'PROJECTS_UPDATED', 'PASSES_UPDATED', 'USER_UPDATED'].includes(ev.type)) {
        fetchUserDashboardData();
        checkAuth();
      }
    });

    const handleFocus = () => {
      fetchUserDashboardData();
      checkAuth();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const generateIdBadgeQr = async () => {
    if (!user) return;
    try {
      const qr = await QRCode.toDataURL(`GUSAC-VERIFIED-ID:${user.studentId || user.id}:${user.email}`, {
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      });
      setIdCardQr(qr);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserDashboardData = async () => {
    try {
      const [projRes, evRes] = await Promise.all([
        apiRequest('/projects'),
        apiRequest('/events/user/my-registrations')
      ]);
      setMyProjects(projRes.projects?.filter((p) => p.authorId === user.id) || []);
      setMyRegistrations(evRes.registrations || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisableMfa = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecurityMsg('');
    try {
      const res = await apiRequest('/auth/mfa/disable', {
        method: 'POST',
        body: { password: disablePassword }
      });
      setSecurityMsg(res.message);
      setDisablePassword('');
      checkAuth();
    } catch (err) {
      setSecurityError(err.message || 'Failed to disable 2FA.');
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-400">Please sign in to access your student dashboard.</p>
        <Link to="/login" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0c1220] to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-blue-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                user.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              ID: <span className="text-blue-400 font-bold">{user.studentId || user.id}</span> • {user.wing}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <ShieldCheck className={`w-4 h-4 ${user.mfaEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>2FA / TOTP: <strong>{user.mfaEnabled ? 'ACTIVE' : 'OFF'}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-mono">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'profile' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" /> Digital ID Badge
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'projects' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4" /> My Projects ({myProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'events' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Ticket className="w-4 h-4" /> Event Passes ({myRegistrations.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'security' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" /> Security &amp; 2FA
        </button>
      </div>

      {/* TAB 1: DIGITAL ID BADGE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
          
          {/* Visual Digital ID Badge */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a0f1d] to-[#121c33] border border-blue-500/40 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <GusacLogo3D size="sm" />
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  VERIFIED INNOVATOR
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-black text-white shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{user.name}</h3>
                  <p className="text-xs text-blue-300 font-mono mt-0.5">{user.studentId || 'GUSAC-MEMBER'}</p>
                  <p className="text-xs text-slate-400 mt-1">{user.wing}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{user.year}</p>
                </div>
              </div>

              {/* ID QR */}
              {idCardQr && (
                <div className="p-3 bg-white rounded-xl inline-block mx-auto shadow-md">
                  <img src={idCardQr} alt="Student ID QR" className="w-28 h-28 mx-auto" />
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>GITAM Science &amp; Activity Center</span>
                <span>ASVS Level 2 Auth</span>
              </div>
            </div>
          </div>

          {/* Member Details */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">
              Member Profile Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-slate-500 block">Registered Email:</span>
                <span className="text-white font-semibold">{user.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-slate-500 block">Assigned Role:</span>
                <span className="text-emerald-400 font-bold uppercase">{user.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-slate-500 block">Domain / Track:</span>
                <span className="text-yellow-400 font-semibold">{user.wing}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-slate-500 block">Account Status:</span>
                <span className="text-emerald-400 font-bold">Active / Verified</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MY PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Your Submitted Projects</h3>
            <Link
              to="/projects"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              + Submit Another Project
            </Link>
          </div>

          {myProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
              You haven't submitted any projects yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400">
                      {proj.wing}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {proj.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{proj.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EVENT PASSES */}
      {activeTab === 'events' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-white">Your Digital Event Passes</h3>
          {myRegistrations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
              You haven't registered for any events yet. Explore upcoming fests!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRegistrations.map((reg) => (
                <div key={reg.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-yellow-400 font-bold">{reg.ticketCode}</span>
                    <span className="text-slate-500">{new Date(reg.registeredAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{reg.event?.title || reg.eventTitle}</h4>
                  <p className="text-xs text-slate-400">{reg.event?.venue}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SECURITY & 2FA */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-2xl animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  Two-Factor Multi-Factor Authentication (MFA)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Protects your account with standard 6-digit TOTP codes (Google Authenticator / Authy).
                </p>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                user.mfaEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {user.mfaEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>

            {!user.mfaEnabled ? (
              <div className="pt-2">
                <button
                  onClick={() => setIsMfaModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Set Up &amp; Enable 2FA Now
                </button>
              </div>
            ) : user.role !== 'admin' ? (
              <form onSubmit={handleDisableMfa} className="pt-2 space-y-3">
                <label className="block text-xs font-mono text-slate-300">
                  Confirm Password to Disable 2FA:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 text-xs font-semibold transition-colors"
                  >
                    Disable 2FA
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs font-mono text-yellow-400 pt-2">
                🔒 MFA is mandatory for Administrator accounts and cannot be disabled.
              </p>
            )}

            {securityMsg && (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 font-mono">
                {securityMsg}
              </p>
            )}
            {securityError && (
              <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 font-mono">
                {securityError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* MFA Setup Modal */}
      <MfaModal
        isOpen={isMfaModalOpen}
        onClose={() => setIsMfaModalOpen(false)}
        onMfaEnabled={() => checkAuth()}
      />

    </div>
  );
}
