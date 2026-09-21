import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import GusacLogo3D from '../components/GusacLogo3D';
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Check
} from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const evaluatePassword = (pwd) => {
    const hasMinLength = Boolean(pwd && pwd.length >= 8);
    const hasUpper = /[A-Z]/.test(pwd || '');
    const hasLower = /[a-z]/.test(pwd || '');
    const hasNumber = /[0-9]/.test(pwd || '');
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd || '');

    const categoriesMet = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    const isValid = hasMinLength && categoriesMet >= 3;

    let message = '';
    if (!hasMinLength) {
      message = 'Password must be at least 8 characters long.';
    } else if (categoriesMet < 3) {
      message = 'Password must contain at least 3 of: uppercase, lowercase, numbers, and special characters.';
    }

    return {
      hasMinLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      categoriesMet,
      isValid,
      message
    };
  };

  const pwdEval = evaluatePassword(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token.trim()) {
      setError('Reset token is required.');
      return;
    }

    if (!pwdEval.isValid) {
      setError(pwdEval.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify your passwords.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: {
          token,
          newPassword
        }
      });
      setSuccess(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Password reset failed.');
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
            Set New Password
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Cryptographic Token Verification &amp; Session Invalidation
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0c101a] border border-slate-800 shadow-2xl space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                Reset Token (from Link / Email)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter 32-byte cryptographic token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono text-slate-300 font-semibold">
                  New Password *
                </label>
                {newPassword && (
                  <span
                    className={`text-[10px] font-mono font-semibold transition-colors ${
                      pwdEval.isValid
                        ? 'text-emerald-400'
                        : pwdEval.hasMinLength
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {pwdEval.isValid
                      ? '✓ Security Policy Met'
                      : `Satisfies ${pwdEval.categoriesMet}/3 categories`}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Min 8 chars, 3 of: upper, lower, number, symbol"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    newPassword
                      ? pwdEval.isValid
                        ? 'border-emerald-500/70 focus:border-emerald-400'
                        : 'border-amber-500/60 focus:border-amber-400'
                      : 'border-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Real-time Password Requirements Checklist */}
              {newPassword && (
                <div className="mt-2.5 p-3 rounded-2xl bg-black/60 border border-slate-800 text-[11px] font-mono space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Security Criteria:</span>
                    <span className="text-[10px] text-slate-500">8+ chars &amp; 3 of 4 types</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className={`flex items-center gap-1.5 transition-colors ${pwdEval.hasMinLength ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {pwdEval.hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-3 h-3 text-center leading-3">•</span>}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${pwdEval.hasUpper ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {pwdEval.hasUpper ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-3 h-3 text-center leading-3">•</span>}
                      <span>Uppercase (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${pwdEval.hasLower ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {pwdEval.hasLower ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-3 h-3 text-center leading-3">•</span>}
                      <span>Lowercase (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${pwdEval.hasNumber ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {pwdEval.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-3 h-3 text-center leading-3">•</span>}
                      <span>Numbers (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 col-span-2 transition-colors ${pwdEval.hasSpecial ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {pwdEval.hasSpecial ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-3 h-3 text-center leading-3">•</span>}
                      <span>Special symbols (!@#$%^&amp;*...)</span>
                    </div>
                  </div>

                  {!pwdEval.isValid ? (
                    <p className="text-[10px] text-amber-400/90 pt-1.5 border-t border-slate-800 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Password must contain at least 3 of: uppercase, lowercase, numbers, and special characters.</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-400 pt-1.5 border-t border-slate-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>Ready! Meets all security criteria.</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono space-y-1 animate-in fade-in">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Password Updated!
                </p>
                <p className="text-[11px] text-slate-300">
                  {success} Redirecting to login...
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Re-deriving Hash & Revoking Sessions...' : 'Update Password & Invalidate Sessions'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
