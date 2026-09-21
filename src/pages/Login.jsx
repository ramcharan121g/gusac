import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GusacLogo3D from '../components/GusacLogo3D';
import SsoModal from '../components/SsoModal';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserCheck,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({
  children,
  isAdmin = false
}) => (
  <div
    className={`rounded-2xl border bg-slate-950/60 backdrop-blur-md transition-all ${
      isAdmin
        ? 'border-slate-800 focus-within:border-red-500/80 focus-within:bg-red-500/10 focus-within:ring-1 focus-within:ring-red-500/30'
        : 'border-slate-800 focus-within:border-yellow-400/80 focus-within:bg-yellow-500/10 focus-within:ring-1 focus-within:ring-yellow-500/30'
    }`}
  >
    {children}
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="flex items-start gap-3.5 rounded-3xl bg-slate-950/75 dark:bg-slate-900/80 backdrop-blur-xl border border-white/10 p-5 shadow-2xl transition-transform hover:-translate-y-1">
    <img
      src={testimonial.avatarSrc}
      className="h-11 w-11 object-cover rounded-2xl border border-slate-700/80 shrink-0"
      alt={testimonial.name}
    />
    <div className="text-xs leading-snug space-y-0.5">
      <div className="flex items-center gap-2">
        <p className="font-bold text-white tracking-tight">{testimonial.name}</p>
        {testimonial.roleTag && (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            {testimonial.roleTag}
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-400 font-mono">{testimonial.handle}</p>
      <p className="text-slate-300 text-[11px] leading-relaxed pt-1">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN LOGIN PAGE ---

export default function Login() {
  const { login, verifyMfa } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'member' or 'admin'
  const [loginMode, setLoginMode] = useState('member');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSsoModal, setShowSsoModal] = useState(false);

  // MFA Challenge State
  const [mfaChallenge, setMfaChallenge] = useState(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaSubmitting, setMfaSubmitting] = useState(false);

  const testimonials = [
    {
      name: 'Sneha Reddy',
      handle: '@sneha.gitam',
      roleTag: 'Student President',
      avatarSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: 'Leading the University Rover Challenge team at GUSAC gave me direct access to 24/7 labs and ₹50Cr equipment.'
    },
    {
      name: 'Aarav Sharma',
      handle: '@aarav.aero',
      roleTag: 'Aero Wing Pilot',
      avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      text: 'Developed autonomous VTOL aircraft with PX4 telemetry right at Hangar 3. Seamless QR check-in for every fest!'
    }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);

      if (res.mfaRequired) {
        setMfaChallenge({
          mfaTempToken: res.mfaTempToken,
          user: res.user,
          demoTotpCode: res.demoTotpCode,
          message: res.message
        });
        if (res.demoTotpCode) {
          setMfaCode(res.demoTotpCode);
        }
      } else {
        const from = location.state?.from?.pathname || (res.user?.role === 'admin' ? '/admin' : '/dashboard');
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (!mfaCode || mfaCode.length !== 6) {
      setError('Please enter a 6-digit MFA verification code.');
      return;
    }

    setError('');
    setMfaSubmitting(true);

    try {
      const res = await verifyMfa(mfaChallenge.mfaTempToken, mfaCode);
      const destination = location.state?.from?.pathname || (res.user?.role === 'admin' ? '/admin' : '/dashboard');
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'MFA verification failed. Please check your code.');
    } finally {
      setMfaSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError('');
    setShowSsoModal(true);
  };

  const isGitamEmail = email.endsWith('@gitam.in') || email.endsWith('@gitam.edu');
  const isAdmin = loginMode === 'admin';

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row w-full bg-[#080b11] text-slate-100 overflow-hidden">
      
      {/* ========================================================
          LEFT COLUMN: SIGN-IN FORM (GUSAC AUTHENTIC DESIGN)
         ======================================================== */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 z-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* Brand Logo & Heading */}
          <div className="space-y-2">
            <Link to="/" className="inline-block mb-1">
              <GusacLogo3D size="sm" />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {mfaChallenge ? (
                'Two-Factor Verification'
              ) : isAdmin ? (
                <span>
                  Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">Control Access</span>
                </span>
              ) : (
                <span>
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-blue-400">GUSAC Hub</span>
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              {mfaChallenge
                ? 'Multi-Factor Authentication (MFA) TOTP Required'
                : 'Access your innovator pass, lab access keycard & event admissions'}
            </p>
          </div>

          {/* Portal Switcher Tabs: Member Login vs Admin Login */}
          {!mfaChallenge && (
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('member');
                  setError('');
                }}
                className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  !isAdmin
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Member Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('admin');
                  setError('');
                }}
                className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isAdmin
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg shadow-red-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            </div>
          )}

          {/* Admin Authorization Notice */}
          {isAdmin && !mfaChallenge && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/40 text-xs font-mono text-red-300 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-red-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Administrative Notice:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong>Only administrators can verify passes and record event attendance.</strong> Member accounts can generate passes but cannot mark check-ins.
              </p>
            </div>
          )}


          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MAIN FORM */}
          {!mfaChallenge ? (
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Address with Glass Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <label className="font-bold">
                    {isAdmin ? 'Admin GITAM Mail *' : 'Email Address / GITAM Mail *'}
                  </label>
                  {email && (
                    <span className={`text-[10px] font-bold ${isGitamEmail || email.toLowerCase() === 'ramcharan20070@gmail.com' ? 'text-blue-400' : 'text-emerald-400'}`}>
                      {isGitamEmail || email.toLowerCase() === 'ramcharan20070@gmail.com' ? '● Verified Admin / GITAM' : '● External Identity'}
                    </span>
                  )}
                </div>

                <GlassInputWrapper isAdmin={isAdmin}>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 absolute left-4 text-slate-500 pointer-events-none" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder={isAdmin ? 'ramcharan20070@gmail.com or admin@gusac.gitam.edu' : 'student@gitam.in or name@domain.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Password with Eye Toggle and Glass Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <label className="font-bold">Password *</label>
                  <Link
                    to="/forgot-password"
                    className={`text-[11px] font-bold transition-colors ${
                      isAdmin ? 'text-red-400 hover:text-red-300' : 'text-yellow-400 hover:text-yellow-300'
                    }`}
                  >
                    Reset password
                  </Link>
                </div>

                <GlassInputWrapper isAdmin={isAdmin}>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 absolute left-4 text-slate-500 pointer-events-none" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm pl-11 pr-12 py-3.5 text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Keep Me Signed In Checkbox */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-slate-300">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button with Original Website Accent */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50 ${
                  isAdmin
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-500/25'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Session...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to {isAdmin ? 'Admin Console' : 'Member Hub'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Or continue with divider */}
              <div className="relative flex items-center justify-center py-2">
                <span className="w-full border-t border-slate-800"></span>
                <span className="px-3 text-xs text-slate-500 bg-[#080b11] absolute font-mono">
                  Or continue with
                </span>
              </div>

              {/* Google / GITAM SSO Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 border border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-900 rounded-2xl py-3.5 text-xs font-mono text-slate-200 transition-colors shadow-sm"
              >
                <GoogleIcon />
                <span>Continue with Google / GITAM SSO</span>
              </button>

              {/* Create Account Link */}
              <p className="text-center text-xs font-mono text-slate-400 pt-2">
                New to our platform?{' '}
                <Link
                  to="/register"
                  className="text-yellow-400 hover:text-yellow-300 font-bold hover:underline transition-colors"
                >
                  Create Account
                </Link>
              </p>

            </form>
          ) : (
            /* ========================================================
                MFA CHALLENGE SCREEN
               ======================================================== */
            <form onSubmit={handleMfaSubmit} className="space-y-4 font-mono text-xs animate-in zoom-in-95">
              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
                <span className="text-slate-400">Target Account:</span>
                <p className="text-white font-bold">{mfaChallenge.user?.email}</p>
                <span className="text-emerald-400 font-bold block pt-1">
                  ● Password verified. Please enter the current 6-digit TOTP code.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">
                  Enter 6-Digit Authenticator Code *
                </label>
                <GlassInputWrapper isAdmin={isAdmin}>
                  <div className="relative flex items-center">
                    <KeyRound className="w-4 h-4 absolute left-4 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="• • • • • •"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full bg-transparent text-lg font-mono text-center tracking-[0.4em] py-3 text-white focus:outline-none"
                    />
                  </div>
                </GlassInputWrapper>
              </div>

              <button
                type="submit"
                disabled={mfaSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-xl shadow-red-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {mfaSubmitting ? (
                  'Verifying Token...'
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete MFA Authorization</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMfaChallenge(null)}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
              >
                Cancel and return to login
              </button>
            </form>
          )}

        </div>
      </section>

      {/* ========================================================
          RIGHT COLUMN: HERO IMAGE + FLOATING TESTIMONIAL CARDS
         ======================================================== */}
      <section className="hidden lg:block flex-1 relative p-6">
        <div
          className="relative h-full w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-cover bg-center flex flex-col justify-between p-8"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80)'
          }}
        >
          {/* Overlay gradients preserving original GUSAC deep colors */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/50 to-[#080b11]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

          {/* Top HUD Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/70 border border-slate-700/80 backdrop-blur-md text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="text-white font-bold">GUSAC INNOVATION ARENA</span>
              <span className="text-slate-500">|</span>
              <span className="text-yellow-400 font-bold">GITAM VIZAG</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700/80 text-[11px] font-mono text-slate-300 backdrop-blur-md">
              24/7 Keycard Lab Access
            </div>
          </div>

          {/* Center Callout */}
          <div className="relative z-10 max-w-lg space-y-3 my-auto py-8">
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono font-bold">
              Autonomous Systems &amp; Space Tech
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xl">
              Where Engineering Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-blue-400">Boundless Curiosity</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed drop-shadow-md">
              Join over 1,250+ student researchers building interplanetary Mars rovers, autonomous VTOL aircraft, and defending national cybersecurity sandboxes.
            </p>
          </div>

          {/* Bottom Floating Testimonial Cards */}
          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-4 pt-4">
            <TestimonialCard testimonial={testimonials[0]} />
            <TestimonialCard testimonial={testimonials[1]} />
          </div>

        </div>
      </section>

      {/* Google & GITAM Institutional SSO Modal */}
      <SsoModal
        isOpen={showSsoModal}
        onClose={() => setShowSsoModal(false)}
      />

    </div>
  );
}
