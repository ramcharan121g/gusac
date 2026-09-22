import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Users,
  Download,
  Calendar,
  Sparkles,
  Camera,
  ShieldCheck,
  RefreshCw,
  Clock,
  Building,
  UserCheck
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import { broadcastUpdate } from '../utils/sync';
import confetti from 'canvas-confetti';

export default function QrAttendanceScanner() {
  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { status, message, attendee, event }
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [passesList, setPassesList] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [rosterLoading, setRosterLoading] = useState(false);

  useEffect(() => {
    fetchEventsAndPasses();
  }, []);

  const fetchEventsAndPasses = async () => {
    setRosterLoading(true);
    try {
      const [evRes, passRes] = await Promise.all([
        apiRequest('/events'),
        apiRequest('/admin/passes')
      ]);
      setEventsList(evRes.events || []);
      setPassesList(passRes.passes || []);
    } catch (err) {
      console.error('Failed to load passes/events:', err);
    } finally {
      setRosterLoading(false);
    }
  };

  const handleScanSubmit = async (codeToScan) => {
    const code = (codeToScan || ticketInput).trim();
    if (!code) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await apiRequest('/admin/attendance/scan-qr', {
        method: 'POST',
        body: { ticketCode: code }
      });

      setScanResult(res);
      setTicketInput('');

      if (res.status === 'SUCCESS') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      fetchEventsAndPasses();
      broadcastUpdate('PASSES_UPDATED');
    } catch (err) {
      setScanResult({
        status: 'ERROR',
        message: err.message || 'Verification failed. Pass not recognized.',
        scannedCode: code
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualToggle = async (registrationId, currentStatus) => {
    try {
      await apiRequest('/admin/attendance/toggle', {
        method: 'POST',
        body: { registrationId, checkedIn: !currentStatus }
      });
      fetchEventsAndPasses();
      broadcastUpdate('PASSES_UPDATED');
    } catch (err) {
      alert(err.message || 'Failed to toggle attendance status.');
    }
  };

  const handleExportCsv = () => {
    const rows = [
      ['Ticket Code', 'Attendee Name', 'Email', 'Phone', 'Type', 'College / Company', 'Event', 'Status', 'Checked In At', 'Checked In By']
    ];

    filteredPasses.forEach((p) => {
      rows.push([
        p.ticketCode,
        p.userName,
        p.userEmail,
        p.userPhone || '',
        p.userType || 'gitam',
        p.collegeOrCompany || '',
        p.eventTitle,
        p.checkedIn ? 'Checked-In' : 'Pending',
        p.checkedInAt ? new Date(p.checkedInAt).toLocaleString() : 'N/A',
        p.checkedInBy || 'N/A'
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map(val => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GUSAC_Attendance_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter passes
  const filteredPasses = passesList.filter((p) => {
    const matchesEvent = selectedEventId === 'all' || p.eventId === selectedEventId;
    const matchesSearch =
      searchFilter === '' ||
      p.userName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.ticketCode?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.userEmail?.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const totalRegistered = filteredPasses.length;
  const totalAttended = filteredPasses.filter((p) => p.checkedIn).length;
  const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Top Banner: Strict Admin Role Notice */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-mono">
                Event Attendance &amp; QR Pass Verification Console
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                ADMIN AUTHORIZED ONLY
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Strict RBAC enforcement: Only authenticated Administrators can mark and manage official attendance.
            </p>
          </div>
        </div>

        <button
          onClick={fetchEventsAndPasses}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${rosterLoading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {/* Grid: Left QR Scanner Box, Right Scanner Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SCANNER INPUT BOX (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              Live Scanner / Pass Code Entry
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Supports Camera Scanners &amp; Handheld Readers
            </span>
          </div>

          {/* Code Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScanSubmit();
            }}
            className="space-y-3"
          >
            <label className="block text-xs font-mono text-slate-300">
              Scan or Enter Ticket Code (e.g. GUSAC-EVT_01-8932):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Scan QR or paste Pass ID..."
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-black/60 border border-slate-700 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !ticketInput.trim()}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
              >
                {loading ? 'Verifying...' : 'Verify Entry'}
              </button>
            </div>
          </form>

          {/* Quick 1-Click Pass Simulator for Testing */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-yellow-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Fast Scan Simulator (Registered Passes):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {passesList.slice(0, 3).map((pass) => (
                <button
                  key={pass.id}
                  onClick={() => handleScanSubmit(pass.ticketCode)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 text-left transition-colors text-xs font-mono group"
                >
                  <span className="text-white font-bold block truncate group-hover:text-emerald-400">
                    {pass.userName}
                  </span>
                  <span className="text-[10px] text-yellow-400 block truncate">
                    {pass.ticketCode}
                  </span>
                  <span className={`text-[9px] font-bold block mt-1 ${pass.checkedIn ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {pass.checkedIn ? '● Checked-In' : '○ Pending'}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* SCAN RESULT DISPLAY (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-center">
          {!scanResult ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
                <QrCode className="w-7 h-7" />
              </div>
              <p className="text-xs font-mono text-slate-400">
                Ready to scan. Present a student/attendee QR pass to verify admission.
              </p>
            </div>
          ) : scanResult.status === 'SUCCESS' ? (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-400" />
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider block">
                    Verified Entry Approved
                  </span>
                  <p className="text-xs font-bold text-white">
                    Attendance officially recorded in university registry!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Attendee:</span>
                  <span className="text-white font-bold">{scanResult.attendee?.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Affiliation:</span>
                  <span className="text-slate-300">{scanResult.attendee?.collegeOrCompany}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-emerald-400 font-bold uppercase">{scanResult.attendee?.userType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Event:</span>
                  <span className="text-yellow-400 font-bold">{scanResult.attendee?.eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ticket Code:</span>
                  <span className="text-white font-mono">{scanResult.attendee?.ticketCode}</span>
                </div>
              </div>
            </div>
          ) : scanResult.status === 'ALREADY_CHECKED_IN' ? (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 shrink-0 text-amber-400" />
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider block">
                    Duplicate Scan Warning
                  </span>
                  <p className="text-xs font-bold text-white">
                    Attendee has already been admitted!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 text-xs font-mono space-y-1.5">
                <p className="text-slate-300">
                  <strong>Attendee:</strong> {scanResult.attendee?.userName}
                </p>
                <p className="text-slate-300">
                  <strong>First Admitted At:</strong>{' '}
                  {scanResult.checkedInAt ? new Date(scanResult.checkedInAt).toLocaleTimeString() : 'Earlier'}
                </p>
                <p className="text-slate-400">
                  <strong>Verified By Admin:</strong> {scanResult.checkedInBy || 'GUSAC Staff'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2">
                <XCircle className="w-6 h-6 shrink-0" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Pass Verification Failed
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {scanResult.message}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ATTENDANCE ROSTER & MANAGEMENT TABLE */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        
        {/* Roster Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Event Attendance Roster ({filteredPasses.length} Attendees)
            </h4>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Real-time synchronization across all entry gates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Event Filter */}
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none"
            >
              <option value="all">All Events Combined</option>
              {eventsList.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search attendee or ticket..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Quick Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
            <span className="text-slate-400">Total Registered:</span>
            <div className="text-xl font-bold text-white mt-0.5">{totalRegistered}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
            <span className="text-emerald-400">Checked-In (Admitted):</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{totalAttended}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
            <span className="text-yellow-400">Pending Arrival:</span>
            <div className="text-xl font-bold text-yellow-400 mt-0.5">{totalRegistered - totalAttended}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800">
            <span className="text-blue-400">Attendance Rate:</span>
            <div className="text-xl font-bold text-blue-400 mt-0.5">{attendanceRate}%</div>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Attendee</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">College / Affiliation</th>
                <th className="py-3 px-4">Ticket Pass</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPasses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 font-mono">
                    No attendees match the selected event or search filter.
                  </td>
                </tr>
              ) : (
                filteredPasses.map((pass) => (
                  <tr key={pass.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{pass.userName}</div>
                      <div className="text-[11px] text-slate-400">{pass.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pass.userType === 'gitam' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {pass.userType === 'gitam' ? 'GITAM' : 'External'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {pass.collegeOrCompany || 'GITAM University'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-yellow-400 font-bold">{pass.ticketCode}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {pass.checkedIn ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Checked-In
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            {pass.checkedInAt ? new Date(pass.checkedInAt).toLocaleTimeString() : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-bold text-[11px]">
                          ○ Pending Arrival
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleManualToggle(pass.id, pass.checkedIn)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                          pass.checkedIn
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {pass.checkedIn ? 'Revoke Entry' : 'Admit Attendee'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
