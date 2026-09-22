import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { subscribeToUpdates } from '../utils/sync';
import { Link } from 'react-router-dom';
import DigitalPassModal from '../components/DigitalPassModal';
import PaymentModal from '../components/PaymentModal';
import confetti from 'canvas-confetti';
import {
  Calendar,
  MapPin,
  Award,
  Users,
  CheckCircle2,
  Ticket,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowRight,
  CreditCard,
  Layers,
  History,
  Image as ImageIcon,
  Video
} from 'lucide-react';

export default function Events() {
  const { user } = useAuth();
  
  // Tab: 'upcoming' | 'past'
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals for direct pass view / payment
  const [activePass, setActivePass] = useState(null);
  const [selectedEventForPayment, setSelectedEventForPayment] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const categories = ['All', 'Flagship Fest', 'Hands-on Workshop', 'CyberSecurity & CTF', 'Science Expedition'];

  useEffect(() => {
    fetchEvents();

    const unsubscribe = subscribeToUpdates((ev) => {
      if (['EVENTS_UPDATED', 'PASSES_UPDATED'].includes(ev.type)) {
        fetchEvents();
      }
    });

    const handleFocus = () => fetchEvents();
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/events');
      setUpcomingEvents(data.upcoming || []);
      setPastEvents(data.past || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRsvpFree = async (ev) => {
    if (!user) {
      alert('Please sign in or register to RSVP for GUSAC events.');
      return;
    }

    try {
      const res = await apiRequest(`/events/${ev.id}/rsvp`, { method: 'POST' });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setActivePass(res.registration);
      setIsPassModalOpen(true);
      fetchEvents();
    } catch (err) {
      if (err.data?.registration) {
        setActivePass(err.data.registration);
        setIsPassModalOpen(true);
      } else {
        alert(err.message || 'Failed to RSVP.');
      }
    }
  };

  const currentList = activeTab === 'upcoming' ? upcomingEvents : pastEvents;
  const filteredEvents = selectedCategory === 'All'
    ? currentList
    : currentList.filter((e) => e.category === selectedCategory);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-400 shadow-xl">
          <Calendar className="w-3.5 h-3.5" />
          <span>University Innovation Tracks &amp; Fests</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          GUSAC Events, Fests &amp; Bootcamps
        </h1>
        <p className="text-slate-400 text-sm sm:text-base font-light">
          Experience national robotics wars, 24-hour hackathons, autonomous drone fly-offs, and cybersecurity CTFs.
        </p>
      </div>

      {/* Primary Tab Switcher: Upcoming Events vs Past Events */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono shadow-2xl">
          <button
            onClick={() => {
              setActiveTab('upcoming');
              setSelectedCategory('All');
            }}
            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Events ({upcomingEvents.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('past');
              setSelectedCategory('All');
            }}
            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'past'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-lg shadow-yellow-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Past Events &amp; Gallery ({pastEvents.length})</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-mono">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedCategory === c
                ? 'bg-slate-800 text-white border border-slate-700 font-bold shadow-sm'
                : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-mono animate-pulse">
          Loading events catalog...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 font-mono text-xs">
          No events found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEvents.map((ev) => {
            const isPast = ev.status === 'past';
            const heroImg = ev.coverImage || ev.images?.[0] || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';

            return (
              <div
                key={ev.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden glass-card-hover group"
              >
                {/* Event Top Banner Image */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={heroImg}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span
                      className="px-3 py-1 rounded-xl text-xs font-mono font-bold shadow-lg"
                      style={{ backgroundColor: `${ev.badgeColor}30`, color: ev.badgeColor, border: `1px solid ${ev.badgeColor}60` }}
                    >
                      {ev.category}
                    </span>

                    {isPast ? (
                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-900/80 text-slate-300 border border-slate-700">
                        {ev.attendeesCount || ev.registeredCount} Attendees
                      </span>
                    ) : ev.isPaid ? (
                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        ₹{ev.fee} Entry Fee
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Free Entry
                      </span>
                    )}
                  </div>

                  {/* Video Indicator Badge */}
                  {ev.videoUrl && (
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-black/80 text-red-400 border border-red-500/40 backdrop-blur-sm flex items-center gap-1 shadow-lg">
                      <Video className="w-3 h-3 text-red-400" /> Video Teaser
                    </span>
                  )}
                </div>

                {/* Event Body Content */}
                <div className="p-6 sm:p-8 space-y-4 flex-1">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                      <Clock className="w-3.5 h-3.5" /> {ev.date}
                    </span>
                    {!isPast && (
                      <span>{ev.registeredCount} / {ev.capacity} Registered</span>
                    )}
                  </div>

                  <Link to={`/events/${ev.id}`}>
                    <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {ev.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {ev.description}
                  </p>

                  <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-1">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                      <span className="truncate"><strong>Prize Pool / Grant:</strong> {ev.prizePool}</span>
                    </p>
                  </div>

                  {/* Past Event Gallery Strip */}
                  {isPast && ev.gallery && ev.gallery.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-mono text-slate-400 block mb-2 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-yellow-400" /> Event Photos:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {ev.gallery.slice(0, 4).map((gImg, gIdx) => (
                          <div key={gIdx} className="rounded-xl overflow-hidden h-14 border border-slate-800">
                            <img src={gImg} alt="Gallery" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Card Bottom Actions */}
                <div className="p-6 sm:p-8 pt-0 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Link
                    to={`/events/${ev.id}`}
                    className="w-full sm:w-auto text-xs font-mono text-blue-400 hover:text-blue-300 font-bold flex items-center justify-center gap-1 py-2"
                  >
                    View Details &amp; Agenda <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {!isPast ? (
                    user ? (
                      ev.isPaid ? (
                        <button
                          onClick={() => {
                            setSelectedEventForPayment(ev);
                            setIsPaymentModalOpen(true);
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay ₹{ev.fee} &amp; Get Pass</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRsvpFree(ev)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>RSVP Free Pass</span>
                        </button>
                      )
                    ) : (
                      <Link
                        to="/login"
                        state={{ from: { pathname: `/events/${ev.id}` } }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 text-center transition-colors"
                      >
                        Login to Register
                      </Link>
                    )
                  ) : (
                    <Link
                      to={`/events/${ev.id}`}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 text-center transition-colors"
                    >
                      View Retrospective
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PAYMENT MODAL */}
      <PaymentModal
        event={selectedEventForPayment}
        user={user}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={(res) => {
          setIsPaymentModalOpen(false);
          setActivePass(res.registration);
          setIsPassModalOpen(true);
          fetchEvents();
        }}
      />

      {/* DIGITAL PASS MODAL */}
      <DigitalPassModal
        pass={activePass}
        event={upcomingEvents.find((e) => e.id === activePass?.eventId)}
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />

    </div>
  );
}
