import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GusacLogo from './GusacLogo3D';
import GitamTopBar from './GitamTopBar';
import { Button } from './ui/button';
import {
  ShieldCheck,
  User,
  LogOut,
  Sparkles,
  Layers,
  Calendar,
  FolderGit2,
  Lock,
  Menu,
  X,
  ChevronDown,
  Wrench,
  Trophy,
  GraduationCap
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* University Top Accreditation & Campus Bar */}
      <GitamTopBar />

      {/* Main Navigation Bar */}
      <nav className="w-full backdrop-blur-xl bg-[#080b11]/95 border-b border-slate-800/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand / Exact Flat Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <GusacLogo size="sm" />
                <div className="hidden lg:block border-l border-slate-700 pl-3">
                  <span className="text-xs font-mono font-bold tracking-wider text-blue-400 block">
                    GITAM VISAKHAPATNAM
                  </span>
                  <span className="text-[10px] text-slate-400 block tracking-tight">
                    Science &amp; Activity Center (GUSAC)
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1 text-xs font-medium font-mono">
              <Link
                to="/projects"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  isActive('/projects')
                    ? 'text-blue-400 bg-blue-400/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                Projects
              </Link>

              <Link
                to="/events"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  isActive('/events')
                    ? 'text-yellow-400 bg-yellow-400/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                Events &amp; Passes
              </Link>

              <Link
                to="/team"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  isActive('/team')
                    ? 'text-purple-400 bg-purple-400/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-purple-400" />
                Council &amp; Trophies
              </Link>
            </div>

            {/* Right Controls */}
            <div className="hidden md:flex items-center space-x-3">

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-white transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      user.role === 'admin' ? 'bg-gradient-to-br from-red-600 to-amber-600 text-white' : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden lg:block">
                      <span className="block text-xs font-semibold leading-tight">{user.name.split(' ')[0]}</span>
                      <span className={`block text-[10px] uppercase font-mono tracking-wider font-bold ${
                        user.role === 'admin' ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[11px] font-mono text-slate-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        Student Digital ID &amp; Portal
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-red-400 hover:bg-red-500/10 font-bold transition-colors"
                        >
                          <Lock className="w-4 h-4 text-red-400" />
                          Admin Control Center
                        </Link>
                      )}

                      <div className="border-t border-slate-800 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="font-semibold text-xs text-slate-300 hover:text-white">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="gold" size="sm" className="font-bold text-xs shadow-md shadow-yellow-500/20">
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-b border-slate-800 bg-[#0a0e17] px-4 pt-2 pb-6 space-y-2 text-sm font-mono">
            <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-blue-400 hover:bg-slate-800 font-semibold">
              Student Projects Directory
            </Link>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-yellow-400 hover:bg-slate-800 font-semibold">
              Events &amp; Hackathons
            </Link>
            <Link to="/team" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-purple-400 hover:bg-slate-800">
              Council &amp; Hall of Fame
            </Link>

            {user ? (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 font-medium">
                  Student ID Badge ({user.name})
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg bg-red-600/20 text-red-400 font-medium">
                    Admin Control Center
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center px-4 py-2 rounded-lg bg-slate-800 text-white font-medium">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
