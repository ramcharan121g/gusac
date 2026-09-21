import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { apiRequest } from '../utils/api';
import { ShieldCheck, Copy, Check, Key, QrCode, AlertCircle, X } from 'lucide-react';

export default function MfaModal({ isOpen, onClose, onMfaEnabled }) {
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initMfaSetup();
    }
  }, [isOpen]);

  const initMfaSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/auth/mfa/setup', { method: 'POST' });
      setSetupData(data);
      if (data.otpauthUrl) {
        const url = await QRCode.toDataURL(data.otpauthUrl, {
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrDataUrl(url);
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize MFA setup.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEnableMfa = async (e) => {
    e.preventDefault();
    if (!verifyCode || verifyCode.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await apiRequest('/auth/mfa/enable', {
        method: 'POST',
        body: {
          secret: setupData.secret,
          code: verifyCode
        }
      });
      if (onMfaEnabled) onMfaEnabled();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to enable 2FA. Please check the code.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0e1320] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-blue-950/40 to-transparent border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Enable Multi-Factor Authentication (2FA)</h3>
              <p className="text-xs text-slate-400 font-mono">RFC 6238 Time-based One-Time Password (TOTP)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm font-mono animate-pulse">
              Generating cryptographic TOTP key pair...
            </div>
          ) : setupData ? (
            <div className="space-y-5">
              
              {/* Step 1: Scan QR */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">
                  Step 1: Scan QR Code with Authenticator
                </span>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  {qrDataUrl ? (
                    <div className="p-2 bg-white rounded-lg shrink-0 shadow-md">
                      <img src={qrDataUrl} alt="2FA QR Code" className="w-32 h-32" />
                    </div>
                  ) : null}
                  <div className="text-xs text-slate-300 space-y-2">
                    <p>
                      Open <strong>Google Authenticator</strong>, <strong>Authy</strong>, or <strong>Microsoft Authenticator</strong> and scan this code.
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Can't scan? Enter the manual setup key below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Manual Secret Key */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">
                  Step 2: Manual Secret Key
                </span>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/60 border border-slate-800">
                  <Key className="w-4 h-4 text-yellow-400 shrink-0" />
                  <code className="text-xs font-mono text-yellow-300 flex-1 select-all font-bold">
                    {setupData.secret}
                  </code>
                  <button
                    onClick={handleCopySecret}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 font-mono transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Step 3: Enter 6-digit confirmation */}
              <form onSubmit={handleEnableMfa} className="space-y-4 pt-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  Step 3: Enter 6-Digit Code to Verify
                </span>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="000000"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-black/60 border border-slate-700 text-center text-lg font-mono tracking-widest text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting || verifyCode.length !== 6}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {submitting ? 'Verifying...' : 'Activate 2FA'}
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 font-mono">
                    {error}
                  </p>
                )}
              </form>

            </div>
          ) : (
            <div className="text-red-400 text-sm font-mono">{error}</div>
          )}
        </div>

      </div>
    </div>
  );
}
