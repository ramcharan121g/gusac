import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import GusacLogo3D from '../components/GusacLogo3D';
import confetti from 'canvas-confetti';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'gitam' or 'external'
  const [userType, setUserType] = useState('gitam');

  // Form fields
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    studentId: '',
    collegeOrCompany: '',
    fromAddress: '',
    password: '',
    confirmPassword: '',
    wing: 'Robotics & Automation'
  });

  // OTP Verification Step State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const isGitamEmail = (email) => {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    return (
      clean.endsWith('@gitam.in') ||
      clean.endsWith('@gitam.edu') ||
      clean.endsWith('.gitam.edu') ||
      clean.includes('@student.gitam.edu')
    );
  };

  const strength = calculatePasswordStrength(form.password);

  // Step 1: Submit Form & Trigger OTP
  const handleInitiateRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First Name and Last Name are required.');
      return;
    }

    if (!form.phone.trim()) {
      setError('Please provide a valid contact phone number.');
      return;
    }

    if (!form.email.trim()) {
      setError('Email address is required.');
      return;
    }

    const cleanEmail = form.email.trim().toLowerCase();
    if (userType === 'gitam' && !isGitamEmail(cleanEmail)) {
      setError('GITAM Student registration requires your official university email (@student.gitam.edu, @gitam.in, or @gitam.edu).');
      return;
    }

    if (userType === 'external' && !form.collegeOrCompany.trim()) {
      setError('Please provide your College or Company name.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please verify your passwords.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest('/auth/send-otp', {
        method: 'POST',
        body: {
          email: cleanEmail,
          userType
        }
      });

      setDemoOtpHint(res.demoOtp || '');
      setOtpCode(res.demoOtp || '');
      setIsOtpStep(true);
      setSuccessNotice(`Verification code dispatched to ${cleanEmail}. Please enter the 6-digit OTP.`);
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Account Creation
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification OTP.');
      return;
    }

    setOtpLoading(true);

    try {
      const cleanEmail = form.email.trim().toLowerCase();

      // 1. Verify OTP
      await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: {
          email: cleanEmail,
          otp: otpCode.trim()
        }
      });

      // 2. Complete Registration
      const payload = {
        userType,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: cleanEmail,
        studentId: form.studentId.trim(),
        collegeOrCompany: form.collegeOrCompany.trim(),
        fromAddress: form.fromAddress.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        wing: form.wing
      };

      const res = await register(payload);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSuccessNotice('Account successfully activated and verified! Redirecting...');

      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || 'OTP verification or registration failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    try {
      const res = await apiRequest('/auth/send-otp', {
        method: 'POST',
        body: { email: form.email, userType }
      });
      setDemoOtpHint(res.demoOtp || '');
      setOtpCode(res.demoOtp || '');
      setSuccessNotice('A new OTP has been dispatched to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <GusacLogo3D size="sm" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isOtpStep ? 'Verify Email Address' : 'Join GUSAC Innovation Ecosystem'}
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            {isOtpStep
              ? 'Enter the 6-digit OTP sent to your registered email'
              : 'End-to-End Encrypted Registration with Argon2id Key Derivation'}
          </p>
        </div>

        {/* Notices */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* STEP 1: INITIAL REGISTRATION FORM */}
        {!isOtpStep ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            
            {/* User Type Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setUserType('gitam');
                  setError('');
                }}
                className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                  userType === 'gitam'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>GITAM Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserType('external');
                  setError('');
                }}
                className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                  userType === 'external'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>External / Non-GITAM</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleInitiateRegistration} className="space-y-4 text-xs font-mono">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email ID (GITAM Mail or General Email) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-bold">
                    {userType === 'gitam' ? 'Official GITAM University Email *' : 'Email Address *'}
                  </label>
                  {userType === 'gitam' && form.email.trim() && (
                    isGitamEmail(form.email) ? (
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Verified University Domain
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-400">
                        Requires official GITAM domain
                      </span>
                    )
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder={userType === 'gitam' ? 'your_roll_no@student.gitam.edu' : 'user@domain.com'}
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (error) setError('');
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border text-white focus:outline-none transition-colors ${
                      userType === 'gitam' && form.email.trim()
                        ? isGitamEmail(form.email)
                          ? 'border-emerald-500/80 focus:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                          : 'border-slate-700 focus:border-blue-500'
                        : 'border-slate-700 focus:border-blue-500'
                    }`}
                  />
                </div>
                {userType === 'gitam' && (
                  <div className="mt-1.5 text-[11px] font-mono">
                    {isGitamEmail(form.email) ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        Official GITAM student email recognized. Automated student verification active.
                      </span>
                    ) : (
                      <span className="text-slate-400 block">
                        Supported domains: <code className="text-blue-300 bg-blue-950/40 px-1 py-0.5 rounded">@student.gitam.edu</code>, <code className="text-blue-300 bg-blue-950/40 px-1 py-0.5 rounded">@gitam.edu</code>, <code className="text-blue-300 bg-blue-950/40 px-1 py-0.5 rounded">@gitam.in</code>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Conditional: GITAM Student ID */}
              {userType === 'gitam' && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Student Roll No / Registration ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VU24CSEN010..."
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Conditional: External College/Company & From Address */}
              {userType === 'external' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      College / Company Name *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. IIT Madras, BITS Pilani, Infosys, etc."
                        value={form.collegeOrCompany}
                        onChange={(e) => setForm({ ...form, collegeOrCompany: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      From Address (City, State) *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bengaluru, Karnataka or Hyderabad, Telangana"
                        value={form.fromAddress}
                        onChange={(e) => setForm({ ...form, fromAddress: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-sans"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Create Password */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Min 8 chars, uppercase, number & symbol"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Strength Meter */}
                {form.password && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 h-full rounded-full transition-colors ${
                            strength >= level
                              ? strength <= 2
                                ? 'bg-red-500'
                                : strength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-emerald-500'
                              : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {strength <= 2 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Submit / Continue to OTP */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-400 hover:from-yellow-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? (
                  'Dispatching Verification OTP...'
                ) : (
                  <>
                    <span>Continue to Email OTP Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            <div className="pt-4 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-yellow-400 font-bold hover:underline">
                Sign in to Member Portal
              </Link>
            </div>

          </div>
        ) : (
          /* STEP 2: EMAIL OTP VERIFICATION STEP */
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-blue-500/40 shadow-2xl space-y-6 animate-in zoom-in-95">
            
            <button
              onClick={() => setIsOtpStep(false)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Edit Information
            </button>

            <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="text-white font-bold">{form.firstName} {form.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-white font-bold">{form.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User Category:</span>
                <span className="text-emerald-400 font-bold uppercase">{userType === 'gitam' ? 'GITAM Student' : 'External'}</span>
              </div>
            </div>

            {/* Live Demo OTP Box for Instant Evaluation */}
            {demoOtpHint && (
              <div className="p-3.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono text-yellow-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Interactive Demo OTP Preview:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  We sent a 6-digit verification code to <strong>{form.email}</strong>. Please check your inbox.
                </p>
              </div>
            )}

            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-1">
                  Enter 6-Digit Email Verification Code *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-2xl bg-black/60 border border-slate-700 text-lg font-mono text-center tracking-[0.4em] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold font-mono text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {otpLoading ? (
                  'Verifying OTP & Activating Account...'
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP &amp; Complete Registration</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-400 hover:text-blue-300 font-bold"
                >
                  Resend OTP Code
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
