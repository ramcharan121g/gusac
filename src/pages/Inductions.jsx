import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import GusacLogo3D from '../components/GusacLogo3D';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Code,
  Layers,
  Award,
  Calendar,
  AlertCircle,
  FileCheck,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Inductions() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [step, setStep] = useState(1);
  const [submittedAppId, setSubmittedAppId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    year: user?.year || '1st Year',
    branch: 'Computer Science & Engineering',
    wing: 'Robotics & Automation',
    cgpa: '8.8',
    skills: 'Python, C++, ROS2, SolidWorks, Arduino',
    github: '',
    reason: 'I want to build cutting-edge autonomous hardware systems and represent GITAM in national hackathons!'
  });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await apiRequest('/inductions/status');
      setStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest('/inductions/apply', {
        method: 'POST',
        body: form
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSubmittedAppId(res.applicationId);
      setStep(4); // Success step
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-red-500/20 border border-yellow-500/30 text-xs font-mono text-yellow-300 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Spring 2026 Batch Inductions Live</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Join the GUSAC Innovation Elite
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Be part of university history. Work on multi-rotor UAVs, autonomous rovers, edge AI, cyber warfare sandboxes, and space telescopes.
        </p>
      </div>

      {/* Recruitment Timeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-blue-400 font-bold">ROUND 1</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">ACTIVE NOW</span>
          </div>
          <h4 className="text-sm font-bold text-white">Application &amp; Domain Preference</h4>
          <p className="text-xs text-slate-400">Tell us your passions, past projects, or what you want to learn from seniors.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-yellow-400 font-bold">ROUND 2</span>
            <span className="text-slate-500">March 22-24</span>
          </div>
          <h4 className="text-sm font-bold text-white">Hands-on Task &amp; Mini-Hack</h4>
          <p className="text-xs text-slate-400">A fun 2-day technical problem-solving sprint in your selected domain lab.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-red-400 font-bold">ROUND 3</span>
            <span className="text-slate-500">March 28-30</span>
          </div>
          <h4 className="text-sm font-bold text-white">Core Council Personal Interview</h4>
          <p className="text-xs text-slate-400">Interactive chat with Domain Leads &amp; keycard onboarding into GUSAC Labs.</p>
        </div>
      </div>

      {/* Main Multi-step Application Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0c101a] border border-slate-800 shadow-2xl space-y-8">
        
        {step < 4 && (
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 text-xs font-mono text-slate-400">
            <span className="font-bold text-white">Application Form • Step {step} of 3</span>
            <div className="flex gap-2">
              <span className={`w-8 h-1.5 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-slate-800'}`} />
              <span className={`w-8 h-1.5 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-slate-800'}`} />
              <span className={`w-8 h-1.5 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-slate-800'}`} />
            </div>
          </div>
        )}

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-white">1. Student Details &amp; Preferred Domain</h3>
              <p className="text-xs text-slate-400 font-mono">Select the primary technical wing you wish to join</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Nikhil"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">GITAM Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="nikhil@gitam.in"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Student ID</label>
                <input
                  type="text"
                  placeholder="VU24CSEN..."
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Year of Study</label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Branch / Department</label>
                <input
                  type="text"
                  placeholder="CSE / ECE / Aero / Mech"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2 font-semibold">Primary Wing Domain You Want to Specialize In *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: 'Aeromodelling & UAVs', color: '#F5C400', desc: 'Drones, Fixed-Wing, VTOL, PX4' },
                  { name: 'Robotics & Automation', color: '#1E7B28', desc: 'Rovers, ROS2, Manipulators' },
                  { name: 'Web, Cloud & CyberSecurity', color: '#124EB4', desc: 'Zero-Trust, CTF, DevSecOps' },
                  { name: 'AI, ML & Data Science', color: '#C62828', desc: 'Vision, PyTorch, Edge AI' },
                  { name: 'Astronomy & Space Tech', color: '#6366F1', desc: 'Telescopes, CubeSat, Radio' },
                  { name: 'IoT & Hardware Systems', color: '#EC4899', desc: 'Altium PCB, LoRaWAN, Sensors' }
                ].map((w) => (
                  <div
                    key={w.name}
                    onClick={() => setForm({ ...form, wing: w.name })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      form.wing === w.name
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                        : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white flex items-center justify-between">
                      <span>{w.name}</span>
                      {form.wing === w.name && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">{w.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                Continue to Experience <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TECHNICAL EXPERIENCE */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-white">2. Technical Skills &amp; Projects</h3>
              <p className="text-xs text-slate-400 font-mono">No prior experience required for freshmen — enthusiasm counts most!</p>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Current CGPA (approx)</label>
              <input
                type="text"
                placeholder="e.g. 8.5"
                value={form.cgpa}
                onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Technical Skills / Software / Hardware Known</label>
              <input
                type="text"
                placeholder="e.g. C++, Python, Arduino, ROS2, Blender, Soldering, SolidWorks"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">GitHub / Portfolio / LinkedIn (Optional)</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                Continue to Statement <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MOTIVATION & SUBMISSION */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-white">3. Motivation Statement &amp; Commitment</h3>
              <p className="text-xs text-slate-400 font-mono">Why do you want to join GUSAC and what ideas do you want to build?</p>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Statement of Purpose *</label>
              <textarea
                rows={5}
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Explain what excites you about this domain and how many hours per week you can dedicate to the club labs..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
              <p className="text-white font-bold">Summary Review:</p>
              <p>Applicant: <strong>{form.name}</strong> ({form.email})</p>
              <p>Selected Wing: <strong className="text-yellow-400">{form.wing}</strong></p>
              <p>Year: <strong>{form.year}</strong></p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting Application...' : 'Submit Official Induction Application'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION BADGE */}
        {step === 4 && (
          <div className="text-center py-10 space-y-6 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl">
              <FileCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Application Received!</h2>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                Application Tracking ID: <span className="text-emerald-400 font-bold">{submittedAppId}</span>
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your application for the <strong>{form.wing}</strong> wing has been submitted to the Student Council. Keep an eye on your email for the Round 1 shortlist.
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link
                to="/wings"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Explore Wing Labs
              </Link>
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
              >
                Go to Member Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
