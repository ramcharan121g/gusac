import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import GusacLogo3D from '../components/GusacLogo3D';
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Key
} from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email }
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <GusacLogo3D size="sm" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Account Recovery
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Anti-Enumeration &amp; Hashed Token Storage
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0c101a] border border-slate-800 shadow-2xl space-y-6">
          
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300 font-mono space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Anti-Enumeration Guarantee
            </p>
            <p className="text-[11px] text-slate-300">
              The server returns the exact same generic message whether or not an account exists, preventing email harvesting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@gitam.in or admin@gusac.gitam.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Cryptographic Token...' : 'Send Secure Reset Link'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {result && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{result.message}</span>
              </div>
            </div>
          )}

          <div className="text-center text-xs text-slate-400">
            Remembered your password?{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-semibold">
              Return to login
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
