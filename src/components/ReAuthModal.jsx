import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, KeyRound, X, AlertTriangle } from 'lucide-react';

export default function ReAuthModal() {
  const { reAuthRequest, closeReAuth } = useAuth();
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'mfa'
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!reAuthRequest) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (reAuthRequest.onSuccess) {
        await reAuthRequest.onSuccess({
          password: authMethod === 'password' ? password : null,
          mfaCode: authMethod === 'mfa' ? mfaCode : null
        });
      }
      closeReAuth();
    } catch (err) {
      setError(err.message || 'Re-authentication verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#0e1320] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header with security warning alert */}
        <div className="p-6 bg-gradient-to-b from-red-950/40 to-transparent border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Sensitive Action Verification</h3>
                <p className="text-xs text-red-300/80 font-mono">OWASP Step-Up Re-Authentication</p>
              </div>
            </div>
            <button
              onClick={closeReAuth}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Action: {reAuthRequest.actionName || 'Elevated Operation'}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                To prevent session hijacking and unauthorized changes, please confirm your identity before proceeding.
              </p>
            </div>
          </div>

          {/* Toggle between Password and MFA code */}
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setError('');
              }}
              className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'password'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('mfa');
                setError('');
              }}
              className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'mfa'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              6-Digit MFA / TOTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMethod === 'password' ? (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Confirm Current Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  6-Digit Authenticator Code:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="• • • • • •"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-lg font-mono tracking-widest text-center text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[10px] text-slate-500 font-mono mt-1 text-center">
                  Enter the 6-digit time-based code from your authenticator app.
                </p>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 font-mono">
                {error}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={closeReAuth}
                className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                {submitting ? 'Verifying...' : 'Authorize Action'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
