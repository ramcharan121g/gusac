import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function SsoModal({ isOpen, onClose }) {
  const { loginWithSso } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const performSso = async (emailToAuth, nameToAuth) => {
    setError('');
    setLoading(true);

    try {
      await loginWithSso(emailToAuth, nameToAuth);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      onClose();
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'SSO Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) {
      setError('Please provide your university student email or Google ID.');
      return;
    }
    performSso(customEmail.trim(), customName.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-1">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            GITAM &amp; Google Cloud SSO
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Institutional Identity Provider &amp; OAuth 2.0 Gateway
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Option 1: 1-Click Fast Student Sign-In */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-slate-400 font-bold block uppercase tracking-wider">
            Fast Institutional 1-Click Access
          </span>
          <button
            type="button"
            disabled={loading}
            onClick={() => performSso('student@student.gitam.edu', 'Student Innovator')}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs font-mono flex items-center justify-between shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="text-left">
                <div className="text-white">Sign In as GITAM Student</div>
                <div className="text-[10px] text-blue-200 font-normal">student@student.gitam.edu</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <span className="w-full border-t border-slate-800"></span>
          <span className="px-3 text-[11px] text-slate-500 bg-slate-900 absolute font-mono">
            Or sign in with custom university ID
          </span>
        </div>

        {/* Option 2: Enter custom email */}
        <form onSubmit={handleCustomSubmit} className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1 text-[11px]">
              University Email / Google Account *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. vu24csen010... @student.gitam.edu"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 text-[11px]">
              Full Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Charan Kumar"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-600/60 shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating with IdP...</span>
              </div>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authorize &amp; Continue with Institutional SSO</span>
              </>
            )}
          </button>
        </form>

        {/* Institutional Trust Badge */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Automated student verification and instant pass provisioning active.</span>
        </div>

      </div>
    </div>
  );
}
