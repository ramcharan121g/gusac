import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import DigitalPassModal from '../components/DigitalPassModal';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Users,
  CheckCircle2,
  Ticket,
  ArrowLeft,
  Share2,
  Phone,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Building,
  Info,
  ChevronRight,
  Play,
  Video,
  Film
} from 'lucide-react';
import confetti from 'canvas-confetti';

function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&autoplay=0`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
}

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentPass, setCurrentPass] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Modals
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpNotice, setRsvpNotice] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id, user]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/events/${id}`);
      setEvent(res.event);
      setIsRegistered(res.isRegistered);
      setCurrentPass(res.registration);
    } catch (err) {
      console.error('Failed to fetch event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFreeRegister = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setRsvpLoading(true);
    setRsvpNotice('');
    try {
      const res = await apiRequest(`/events/${id}/rsvp`, { method: 'POST' });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setRsvpNotice('Registration confirmed! Your digital pass has been generated.');
      setIsRegistered(true);
      setCurrentPass(res.registration);
      setIsPassOpen(true);
      fetchEventDetails();
    } catch (err) {
      alert(err.message || 'Failed to complete registration.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handlePaymentSuccess = (res) => {
    setIsPaymentOpen(false);
    setIsRegistered(true);
    setCurrentPass(res.registration);
    setIsPassOpen(true);
    fetchEventDetails();
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3 font-mono text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading event information and registration registry...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-slate-400 font-mono">
          The requested event could not be located or may have concluded.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-mono font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Events
        </Link>
      </div>
    );
  }

  const isPast = event.status === 'past';
  const coverUrl = event.coverImage || (event.images && event.images.length > 0 ? event.images[0] : 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80');
  const images = event.images && event.images.length > 0 ? event.images : [coverUrl];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events Catalog
        </Link>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            isPast ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isPast ? '● Concluded Fest' : '● Registration Open'}
          </span>
        </div>
      </div>

      {/* Hero Banner Grid: Left Gallery/Image, Right Quick Action & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Gallery & Event Title (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Hero Image */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[320px] sm:h-[440px] bg-slate-950">
            <img
              src={images[activeImageIdx]}
              alt={event.title}
              className="w-full h-full object-cover brightness-[0.8] contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-xl text-xs font-mono font-bold shadow-lg"
                style={{ backgroundColor: `${event.badgeColor}30`, color: event.badgeColor, border: `1px solid ${event.badgeColor}60` }}
              >
                {event.category}
              </span>
              {event.isPaid ? (
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ₹{event.fee} Entry Fee
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  100% Free Entry
                </span>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Thumbnail Gallery Strip if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIdx === idx ? 'border-yellow-400 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Event Key Information Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Calendar className="w-3.5 h-3.5" /> Date:
              </div>
              <p className="text-white font-semibold">{event.date}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <Clock className="w-3.5 h-3.5" /> Time:
              </div>
              <p className="text-white font-semibold">{event.time}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Users className="w-3.5 h-3.5" /> Capacity:
              </div>
              <p className="text-white font-semibold">{event.registeredCount} / {event.capacity} Slots</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Award className="w-3.5 h-3.5" /> Prize / Awards:
              </div>
              <p className="text-white font-semibold truncate">{event.prizePool}</p>
            </div>
          </div>

          {/* Description & Detailed Overview */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Info className="w-4 h-4 text-yellow-400" /> About This Gathering
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.details || event.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {event.tags?.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-black/60 text-slate-400 border border-slate-800"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Event Teaser & Promo Video Player */}
          {event.videoUrl && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-400" /> Event Teaser &amp; Video Highlights
                </h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-red-400" /> Official Preview
                </span>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                {getEmbedUrl(event.videoUrl) ? (
                  <iframe
                    src={getEmbedUrl(event.videoUrl)}
                    title={event.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={event.videoUrl}
                    controls
                    poster={coverUrl}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          )}

          {/* Schedule & Agenda Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Event Itinerary &amp; Timeline
              </h3>

              <div className="space-y-3">
                {event.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-black/50 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-mono text-yellow-400 font-bold block">
                        {item.time}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {item.title}
                      </h4>
                    </div>
                    {item.speaker && (
                      <span className="text-xs font-mono text-slate-400 sm:text-right shrink-0">
                        Lead: {item.speaker}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Event Gallery / Highlights */}
          {isPast && event.gallery && event.gallery.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Event Retrospective &amp; Photo Gallery
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {event.gallery.map((photo, pIdx) => (
                  <div key={pIdx} className="rounded-2xl overflow-hidden border border-slate-800 h-28">
                    <img src={photo} alt="Gallery Photo" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>

              {event.winnerSummary && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-1">
                  <span className="text-emerald-400 font-bold uppercase block">Champions &amp; Awards:</span>
                  <p className="text-white">{event.winnerSummary}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Registration & Access Pass Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e1424] via-slate-900 to-slate-950 border border-blue-500/40 shadow-2xl space-y-6">
            
            {/* Price / Pass Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Official Admission
                </span>
                <h3 className="text-xl font-bold text-white">
                  {event.isPaid ? `₹${event.fee}` : 'Free RSVP'}
                </h3>
              </div>
              <div className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                event.isPaid ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                {event.isPaid ? 'Paid Event Pass' : 'Complimentary'}
              </div>
            </div>

            {/* Registration Notice */}
            {rsvpNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{rsvpNotice}</span>
              </div>
            )}

            {/* Venue & Location Mini-Card */}
            <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">Venue Location</span>
                  <p className="text-slate-400 leading-relaxed mt-0.5">{event.venue}</p>
                </div>
              </div>
              <a
                href="#location-map"
                className="text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-bold pt-1"
              >
                View on GUSAC Campus Map →
              </a>
            </div>

            {/* Action Buttons Depending on User & Registration Status */}
            {isPast ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono text-xs text-slate-400">
                This event took place on {event.date}. Stay tuned for the next edition!
              </div>
            ) : isRegistered ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center text-xs font-mono font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are Registered for this Event!</span>
                </div>

                <button
                  onClick={() => setIsPassOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold font-mono text-xs shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View &amp; Print Digital Pass (QR Code)</span>
                </button>
              </div>
            ) : user ? (
              event.isPaid ? (
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold font-mono text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Register &amp; Pay ₹{event.fee} via Gateway</span>
                </button>
              ) : (
                <button
                  onClick={handleFreeRegister}
                  disabled={rsvpLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold font-mono text-xs shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {rsvpLoading ? (
                    'Generating Digital Pass...'
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>RSVP Free &amp; Issue Digital Pass</span>
                    </>
                  )}
                </button>
              )
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  state={{ from: { pathname: `/events/${id}` } }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold font-mono text-xs shadow-xl flex items-center justify-center gap-2 transition-all text-center block"
                >
                  Login / Register to Attend
                </Link>
                <p className="text-[11px] text-slate-400 font-mono text-center">
                  Supports GITAM students (@gitam.in) &amp; external college participants.
                </p>
              </div>
            )}

            {/* Event Coordinators */}
            {event.coordinators && event.coordinators.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-mono">
                <span className="text-slate-400 block font-bold">Event Coordinators:</span>
                {event.coordinators.map((c, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center text-slate-300">
                    <div>
                      <span className="font-bold text-white block">{c.name}</span>
                      <span className="text-[10px] text-slate-500">{c.role}</span>
                    </div>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {c.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* PAYMENT GATEWAY MODAL */}
      <PaymentModal
        event={event}
        user={user}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* DIGITAL ACCESS PASS MODAL */}
      <DigitalPassModal
        pass={currentPass}
        event={event}
        isOpen={isPassOpen}
        onClose={() => setIsPassOpen(false)}
      />

    </div>
  );
}
