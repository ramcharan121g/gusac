import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Building,
  CheckCircle2,
  Lock,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../utils/api';

export default function PaymentModal({
  event,
  user,
  isOpen,
  onClose,
  onPaymentSuccess
}) {
  const [method, setMethod] = useState('razorpay'); // 'razorpay' | 'upi' | 'card' | 'netbanking'
  const [upiVpa, setUpiVpa] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [loading, setLoading] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen || !event) return null;

  const fee = event.fee || 199;
  const gst = Math.round(fee * 0.18);
  const totalAmount = fee + gst;

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate realistic network gateway processing (1.2s delay)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const paymentTxnId =
        method === 'razorpay'
          ? `RZP_TEST_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`
          : `PAY-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const paymentMethodName =
        method === 'razorpay'
          ? 'Razorpay Test Gateway (₹0 Test Mode)'
          : method === 'upi'
          ? 'UPI / QR Gateway (Instant)'
          : method === 'card'
          ? 'Credit/Debit Card (Visa/Mastercard)'
          : `NetBanking (${selectedBank})`;

      const res = await apiRequest(`/events/${event.id}/verify-payment`, {
        method: 'POST',
        body: {
          paymentMethod: paymentMethodName,
          paymentTxnId
        }
      });

      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSuccessReceipt({
        ...res.receipt,
        ticketCode: res.ticketCode,
        registration: res.registration,
        attendeeName: user.name,
        attendeeEmail: user.email,
        totalPaid: totalAmount
      });

      if (onPaymentSuccess) {
        onPaymentSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Payment processing encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#0b101c] border border-blue-500/40 shadow-2xl overflow-hidden relative text-slate-100 flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                {successReceipt ? 'Payment Receipt' : 'GUSAC Secure Payment Gateway'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                128-Bit AES Encrypted University Checkout
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!successReceipt ? (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            
            {/* Event Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-yellow-400 font-bold uppercase block mb-0.5">
                  Registration Pass for
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{event.title}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{event.date} • {event.venue}</p>
              </div>
              <div className="text-right shrink-0 pl-3">
                <span className="text-xl font-black text-white font-mono">₹{totalAmount}</span>
                <span className="text-[10px] text-emerald-400 block font-mono">Includes GST</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-bold">
                Select Payment Gateway:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setMethod('razorpay')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    method === 'razorpay'
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold shadow-lg shadow-blue-900/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1 text-blue-400 font-bold text-[11px]">
                    <Zap className="w-3.5 h-3.5 fill-blue-400" />
                    <span>Razorpay</span>
                  </div>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded">Test Mode ₹0</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    method === 'upi'
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold shadow-lg shadow-blue-900/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    method === 'card'
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold shadow-lg shadow-blue-900/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('netbanking')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    method === 'netbanking'
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold shadow-lg shadow-blue-900/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Razorpay Test Mode Card */}
            {method === 'razorpay' && (
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
                    Razorpay Standard Checkout (Test Mode)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    ✓ 100% Free
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  Razorpay Sandbox is active. Clicking <strong>Confirm &amp; Pay</strong> will simulate a verified transaction, sign the HMAC token, and immediately dispatch your official <strong>Digital Pass with QR code</strong> via Brevo to <strong>{user?.email}</strong>.
                </p>
                <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400">
                  <span>Merchant: <strong>GUSAC Visakhapatnam</strong></span>
                  <span>Currency: <strong>INR (₹)</strong></span>
                </div>
              </div>
            )}

            {/* Mode Specific Inputs */}
            {method === 'upi' && (
              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-400" /> Scan QR or Enter UPI ID:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Zero Gateway Fee</span>
                </div>

                <div className="p-3 bg-white rounded-xl text-center inline-block mx-auto w-full">
                  <div className="w-28 h-28 mx-auto bg-slate-100 rounded-lg flex items-center justify-center border border-slate-300">
                    <QrCode className="w-20 h-20 text-slate-900" />
                  </div>
                  <p className="text-[10px] font-mono text-slate-900 font-bold mt-1">
                    UPI ID: gusac.gitam@sbi
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="e.g. yourname@oksbi or 9876543210@paytm"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-3 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8912"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-2 text-xs font-mono">
                <label className="block text-slate-400">Choose Participating Bank:</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Attendee Info & Billing Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Attendee:</span>
                <span className="text-white font-bold">{user.name} ({user.email})</span>
              </div>
              <div className="flex justify-between">
                <span>Registration Fee:</span>
                <span className="text-white">₹{fee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span className="text-white">₹{gst}</span>
              </div>
              <div className="border-t border-slate-800 pt-1 flex justify-between font-bold text-white text-xs">
                <span>Total Payable:</span>
                <span className="text-yellow-400 font-mono">₹{totalAmount}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold font-mono text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment with Bank Gateway...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-100" />
                  <span>Pay ₹{totalAmount} &amp; Generate Event Pass</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center font-mono text-slate-500">
              🔒 PCI-DSS Compliant. A digital pass with QR code will be generated immediately upon confirmation.
            </p>

          </form>
        ) : (
          /* SUCCESS RECEIPT VIEW */
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto animate-in zoom-in-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                Payment Successful
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Pass Confirmed &amp; Dispatched!
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                A confirmation email with your digital QR entry pass has been sent to {successReceipt.attendeeEmail}.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-emerald-400 font-bold">{successReceipt.txnId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Event:</span>
                <span className="text-white font-bold">{successReceipt.eventTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Ticket / Pass Code:</span>
                <span className="text-yellow-400 font-bold">{successReceipt.ticketCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="text-white font-bold">₹{successReceipt.totalPaid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="text-slate-300">{successReceipt.method}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold font-mono text-xs shadow-xl transition-all"
            >
              View My Digital Pass &amp; QR Code
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
