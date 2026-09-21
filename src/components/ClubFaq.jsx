import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

export default function ClubFaq() {
  const { siteContent } = useSiteContent();
  const faqData = siteContent?.faq || {};
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = faqData.items?.length ? faqData.items : [
    {
      q: 'Who is eligible to join GUSAC and build projects?',
      a: 'All undergraduate, postgraduate, and PhD students from ANY department (CSE, ECE, Aerospace, Mechanical, Civil, Biotechnology, etc.) at GITAM are eligible. Prior hardware or coding experience is NOT mandatory for 1st-year students — passion and curiosity matter most!'
    },
    {
      q: 'How do student teams get funding and components for hardware projects?',
      a: 'Once you submit your project idea on the portal and it gets approved by the technical council, you can request direct component checkout (NVIDIA Jetson, Pixhawk, LiDARs, 3D printers) from the GUSAC hardware inventory, funded by university R&D grants.'
    },
    {
      q: 'How do I get 24/7 keycard access to GUSAC prototyping centers?',
      a: 'Active student members working on registered innovation projects or national competitions (Smart India Hackathon, URC, Boeing Aero Prix) are granted RFID student badge access for 24/7 facility entry after safety onboarding.'
    },
    {
      q: 'How can I participate in GUSAC hackathons and workshops?',
      a: 'All active fests, workshops, and hackathons are listed under the Events page. You can register directly with your student credentials or as an external participant to get a verified digital pass with instant QR verification.'
    },
    {
      q: 'Can I collaborate across multiple technical domains (e.g. AI + Robotics)?',
      a: 'Yes! GUSAC thrives on multidisciplinary collaboration. Many projects (like the Astra Planetary Rover or Garuda-X VTOL) involve members combining Robotics, Embedded IoT, and Edge AI.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> {faqData.tag || 'Frequently Asked Questions'}
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-white">
          {faqData.title || 'Everything You Need to Know About GUSAC'}
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          {faqData.subtitle || 'Have more questions? Reach out to our student council at gusac@gitam.edu'}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-slate-900 border-blue-500/40 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white"
              >
                <span className="text-sm">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-blue-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 font-mono leading-relaxed border-t border-slate-800/80 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link
          to={faqData.ctaLink || "/register"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-bold text-xs shadow-lg shadow-yellow-500/20 hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 text-black" />
          {faqData.ctaText || 'Ready to join? Register for GUSAC Community & Events →'}
        </Link>
      </div>
    </div>
  );
}
