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

        {/* Official Institutional SSO Login Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1 text-[11px]">
              Institutional Email / Google ID *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. rollnumber@student.gitam.edu"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-sans text-xs placeholder:text-slate-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Supports <code className="text-blue-300">@student.gitam.edu</code>, <code className="text-blue-300">@gitam.edu</code>, <code className="text-blue-300">@gitam.in</code>, or verified Google accounts.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 text-[11px]">
              Student / Full Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Your Full Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-sans text-xs placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold font-mono text-xs shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating with Institutional Gateway...</span>
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
