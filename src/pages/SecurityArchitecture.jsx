import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Database,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  RefreshCw,
  Layers,
  ArrowDown,
  ArrowRight,
  UserCheck,
  Zap
} from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function SecurityArchitecture() {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'account' | 'admin-auth' | 'pwd-reset' | 'db' | 'ai-pipeline'
  const [simulatedLog, setSimulatedLog] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerLiveSim = async (type) => {
    setLoading(true);
    setSimulatedLog(null);
    try {
      let payload = {};
      if (type === 'role_injection') {
        payload = { name: 'Attacker X', email: 'attacker@injected.org', password: 'Password@2026!', role: 'admin' };
      } else if (type === 'password_hash_demo') {
        payload = { password: 'GusacSecurePassword@2026!' };
      } else if (type === 'token_hash_demo') {
        payload = { token: '7c9f8a2b5e4d1c3a9f8b7e6d5c4b3a21' };
      }

      const res = await apiRequest('/audit/test-sandbox', {
        method: 'POST',
        body: { testType: type, payload }
      });
      setSimulatedLog(res);
    } catch (e) {
      setSimulatedLog({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>OWASP ASVS Standardized Blueprint</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          GUSAC Security Architecture
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Explore the exact cryptographic, defensive, and zero-trust engineering layers securing the GUSAC web application.
        </p>
      </div>

      {/* Blueprint Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
        {[
          { id: 'overview', label: '🔐 1. System Architecture' },
          { id: 'account', label: '🔑 2. Account Creation & Role Rule' },
          { id: 'admin-auth', label: '🛡️ 3. Admin Auth & MFA' },
          { id: 'pwd-reset', label: '🔄 4. Password Reset & Anti-Enumeration' },
          { id: 'db', label: '🗄️ 5. Database Isolation' },
          { id: 'ai-pipeline', label: '🤖 6. AI Development Pipeline' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSection(tab.id);
              setSimulatedLog(null);
            }}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeSection === tab.id
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg shadow-red-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================
          SECTION 1: OVERVIEW SYSTEM ARCHITECTURE
         ======================================================== */}
      {activeSection === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Multi-Tier Zero-Trust Architecture
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every request entering GUSAC undergoes TLS termination, strict security header checks (CSP, HSTS, X-Frame-Options), server-side input validation, rate limiting, cryptographic session authentication, and role-based access verification before reaching sensitive data layers.
            </p>

            {/* ASCII Architecture Flow Render */}
            <div className="p-6 rounded-2xl bg-black/90 border border-slate-800 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto text-slate-300 space-y-1 shadow-inner">
              <div className="text-blue-400">                         🌐 WEBSITE</div>
              <div className="text-slate-600">                            │</div>
              <div className="text-emerald-400">                    HTTPS / TLS ONLY</div>
              <div className="text-slate-600">                            │</div>
              <div className="text-slate-600">                            ▼</div>
              <div className="text-yellow-400">                    SECURITY HEADERS (CSP / HSTS / Frame-Options)</div>
              <div className="text-slate-600">                            │</div>
              <div className="text-slate-600">                            ▼</div>
              <div className="text-blue-300">                    ┌───────────────┐</div>
              <div className="text-blue-300">                    │   FRONTEND    │ (React / Next.js / Vite)</div>
              <div className="text-blue-300">                    └───────┬───────┘</div>
              <div className="text-slate-600">                            │</div>
              <div className="text-emerald-400">                     HTTPS API calls</div>
              <div className="text-slate-600">                            │</div>
              <div className="text-slate-600">                            ▼</div>
              <div className="text-rose-400">                ┌──────────────────────┐</div>
              <div className="text-rose-400">                │      BACKEND API     │</div>
              <div className="text-slate-300">                │ Authentication       │</div>
              <div className="text-slate-300">                │ Authorization / RBAC │</div>
              <div className="text-slate-300">                │ Input validation     │</div>
              <div className="text-slate-300">                │ Rate limiting        │</div>
              <div className="text-slate-300">                │ CSRF protection      │</div>
              <div className="text-rose-400">                └──────────┬───────────┘</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                  ┌────────┴────────┐</div>
              <div className="text-slate-600">                  │                 │</div>
              <div className="text-emerald-400">             USER ROLE          ADMIN ROLE</div>
              <div className="text-slate-600">                  │                 │</div>
              <div className="text-slate-600">                  ▼                 ▼</div>
              <div className="text-emerald-400">            USER ACCESS        ADMIN ACCESS</div>
              <div className="text-slate-600">                                    │</div>
              <div className="text-yellow-400">                              MFA REQUIRED (TOTP 6-digit)</div>
              <div className="text-slate-600">                                    │</div>
              <div className="text-yellow-400">                           Sensitive actions (Step-up Re-Auth)</div>
              <div className="text-slate-600">                                    │</div>
              <div className="text-slate-600">                                    ▼</div>
              <div className="text-purple-400">                         DATABASE / SERVICES (Parameterized Access)</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 2: ACCOUNT CREATION & ROLE SANITIZATION
         ======================================================== */}
      {activeSection === 'account' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-400" />
                Account Creation &amp; Role Integrity Rule
              </h2>
              <span className="px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-mono font-bold">
                Anti-Privilege Escalation
              </span>
            </div>

            <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-200">
              <strong className="text-red-400 font-bold block mb-1">CRITICAL SECURITY PRINCIPLE:</strong>
              Never let the browser choose <code className="bg-black/60 px-1.5 py-0.5 rounded text-red-300">role = admin</code>. Even if a client maliciously sends forged JSON attributes like <code className="bg-black/60 px-1.5 py-0.5 rounded text-red-300">"role": "admin"</code>, the backend strips it, logs an audit violation, and forces <code className="bg-black/60 px-1.5 py-0.5 rounded text-emerald-400">role = "user"</code>.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* ASCII Flow */}
              <div className="p-6 rounded-2xl bg-black/90 border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 shadow-inner">
                <div className="text-slate-500">// Account Creation Flow</div>
                <div className="text-white font-bold">Create Account</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-emerald-400">Validate input (Sanitization &amp; Regex)</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-yellow-400">Rate-limit registration (Sliding window)</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-blue-400">Verify email format</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-purple-400">Hash password with Argon2/Scrypt</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-purple-400">Store password HASH + unique SALT</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-red-400 font-bold">Create user with role = user (Backend Enforced)</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-emerald-400">Create secure session token</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-white">User Dashboard</div>
              </div>

              {/* Live Interactive Attack Simulation */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Live Defense Simulator
                </h3>
                <p className="text-xs text-slate-400">
                  Click below to dispatch an intentional privilege escalation payload <code className="text-red-400">role: "admin"</code> and observe how the backend intercepts and neutralizes it.
                </p>

                <button
                  onClick={() => triggerLiveSim('role_injection')}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  <Play className="w-3.5 h-3.5" />
                  {loading ? 'Simulating...' : 'Simulate role="admin" Attack'}
                </button>

                {simulatedLog && (
                  <pre className="p-3.5 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    {JSON.stringify(simulatedLog, null, 2)}
                  </pre>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 3: ADMIN AUTHENTICATION & MFA
         ======================================================== */}
      {activeSection === 'admin-auth' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-400" />
                Admin Authentication &amp; Multi-Factor Verification
              </h2>
              <span className="px-3 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-mono font-bold">
                MFA Enforced
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-black/90 border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 shadow-inner">
                <div className="text-slate-500">// Admin Authentication Flow</div>
                <div className="text-white font-bold">Admin Login</div>
                <div className="text-slate-600">     ↓</div>
                <div className="text-emerald-400">HTTPS / TLS Gateway</div>
                <div className="text-slate-600">     ↓</div>
                <div className="text-yellow-400">Rate limiting (Strict brute-force limiter)</div>
                <div className="text-slate-600">     ↓</div>
                <div className="text-blue-400">Email + password verification (Argon2 constant-time)</div>
                <div className="text-slate-600">     ↓</div>
                <div className="text-yellow-400 font-bold">MFA verification (RFC 6238 TOTP 6-digit code)</div>
                <div className="text-slate-600">     ↓</div>
                <div className="text-emerald-400">Session creation (HttpOnly / Secure token)</div>
                <div className="text-slate-600">     ↓</div>
                <div className="text-purple-400 font-bold">Backend checks role == 'admin'</div>
                <div className="text-slate-600">     ↓</div>
                <div className="text-white">role == admin ?</div>
                <div className="text-slate-600">   ┌──────┴──────┐</div>
                <div className="text-emerald-400">  YES            NO</div>
                <div className="text-slate-600">   ↓              ↓</div>
                <div className="text-emerald-400 font-bold">Admin Dashboard  <span className="text-red-400 font-bold">403 Forbidden</span></div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                  <h3 className="font-bold text-white font-mono text-sm">
                    Why Backend Role Checks Matter
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    The <strong>backend API</strong>, never the frontend UI, decides whether the user is an administrator. Any direct API invocation without a valid session token holding <code className="text-red-400">role === 'admin'</code> and <code className="text-yellow-400">mfaVerified: true</code> immediately triggers an automated 403 Forbidden response and an immutable security audit event.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-emerald-400 font-mono text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Demo Admin credentials available in login for evaluation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 4: PASSWORD RESET & ANTI-ENUMERATION
         ======================================================== */}
      {activeSection === 'pwd-reset' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                Secure Anti-Enumeration Password Reset Flow
              </h2>
              <span className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-mono font-bold">
                Zero User Leakage
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200">
              <strong className="text-blue-400 font-bold block mb-1">ANTI-ENUMERATION DEFENSE:</strong>
              The reset endpoint returns the exact same generic message whether an email exists or not. Furthermore, only the <strong>SHA-256 hash</strong> of the random token is stored in the database. Even in the event of a full database leak, reset links cannot be forged!
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-black/90 border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 shadow-inner">
                <div className="text-slate-500">// Secure Password Reset Pipeline</div>
                <div className="text-white font-bold">Forgot Password</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-blue-400">Enter email</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-yellow-400">Generic response (Prevents user enumeration)</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-purple-400">Generate cryptographically random 32-byte token</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-red-400 font-bold">Store ONLY token hash in DB (SHA-256)</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-yellow-400">Short expiration (15-minute TTL)</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-blue-400">User opens HTTPS reset link</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-emerald-400">Verify token hash &amp; TTL</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-purple-400">Argon2/Scrypt hash new password</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-purple-400">Replace old password hash</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-red-400">Invalidate reset token</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-red-400 font-bold">Invalidate ALL existing active sessions</div>
                <div className="text-slate-600">      ↓</div>
                <div className="text-white">Login again with new credentials</div>
              </div>

              {/* Live Hash Sandbox */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Live Token Hash Inspector
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect how random reset tokens are hashed before storage to guarantee database security.
                </p>

                <button
                  onClick={() => triggerLiveSim('token_hash_demo')}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  {loading ? 'Hashing...' : 'Generate & Hash Token Live'}
                </button>

                {simulatedLog && (
                  <pre className="p-3.5 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    {JSON.stringify(simulatedLog, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 5: DATABASE SECURITY & SENSITIVE ACTION RE-AUTH
         ======================================================== */}
      {activeSection === 'db' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Database Security &amp; Sensitive Action Step-up Re-Auth
              </h2>
              <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
                Least Privilege
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-black/90 border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 shadow-inner">
                <div className="text-slate-500">// Database Security Architecture</div>
                <div className="text-blue-300">Frontend</div>
                <div className="text-red-400 font-bold">   ❌ (Never directly access database)</div>
                <div className="text-slate-600">   │</div>
                <div className="text-slate-600">   ▼</div>
                <div className="text-yellow-400">Backend API</div>
                <div className="text-slate-400">   ├── Authentication</div>
                <div className="text-slate-400">   ├── Authorization (RBAC)</div>
                <div className="text-slate-400">   ├── Validation &amp; Sanitization</div>
                <div className="text-slate-400">   ├── Rate limiting</div>
                <div className="text-slate-400">   └── Parameterized Database queries</div>
                <div className="text-slate-600">             │</div>
                <div className="text-slate-600">             ▼</div>
                <div className="text-emerald-400 font-bold">        PostgreSQL / Encrypted Store</div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                  <h3 className="font-bold text-white font-mono text-sm">
                    Sensitive Action Step-Up Re-Authentication
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Elevated operations like <strong>Deleting a user</strong>, <strong>Elevating admin roles</strong>, or <strong>Exporting system data</strong> require interactive step-up password or 6-digit MFA re-verification before execution.
                  </p>
                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-yellow-300">
                    Delete User / Change Admin / Export Data → Step-up Re-Auth → Action → Audit Log Dispatched
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 6: AI PIPELINE & OWASP ASVS
         ======================================================== */}
      {activeSection === 'ai-pipeline' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                AI Development &amp; Continuous Security Pipeline
              </h2>
              <span className="px-3 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-mono font-bold">
                OWASP Top 10 + ASVS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Security is an active gate in the development pipeline, continuously tested against the OWASP Application Security Verification Standard (ASVS) and OWASP Top 10.
            </p>

            <div className="p-6 rounded-2xl bg-black/90 border border-slate-800 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto text-slate-300 space-y-1 shadow-inner">
              <div className="text-purple-400">                    AI / ANTIGRAVITY</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-blue-400">                      Generate Code</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-blue-400">                    Code Review</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-yellow-400">                  Static Security Scan</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-yellow-400">                     Unit Tests</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-emerald-400">                 Authentication Tests</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-emerald-400">                Authorization (RBAC) Tests</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-yellow-400">                Dependency/Vulnerability Scanning</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-blue-300">                  Staging Environment</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                           ▼</div>
              <div className="text-rose-400">                    Security Testing</div>
              <div className="text-slate-600">                           │</div>
              <div className="text-slate-600">                     ┌─────┴─────┐</div>
              <div className="text-emerald-400 font-bold">                   PASS         FAIL</div>
              <div className="text-slate-600">                     │           │</div>
              <div className="text-emerald-400">                     ▼           ▼</div>
              <div className="text-emerald-400 font-bold">                  Deploy      Fix Code</div>
              <div className="text-slate-600">                     │</div>
              <div className="text-slate-600">                     ▼</div>
              <div className="text-white font-bold">                Production</div>
              <div className="text-slate-600">                     │</div>
              <div className="text-slate-600">                     ▼</div>
              <div className="text-blue-400 font-bold">             Continuous Monitoring &amp; Audit Logs</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
