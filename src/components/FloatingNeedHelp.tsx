import React, { useState } from 'react';
import { Headphones, MessageCircle, Phone, Mail, X, CheckCircle2 } from 'lucide-react';

export const FloatingNeedHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-5 right-4 z-40">
        <button
          id="floating-need-help-btn"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-label="Need Help Customer Support"
          className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.18)] border border-gray-200/90 flex flex-col items-center justify-center space-y-1 transition-all duration-200 hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
              <Headphones className="w-4 h-4" />
            </div>
            {/* Green Online Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-gray-700 tracking-tight leading-none group-hover:text-orange-600">
            Need Help
          </span>
        </button>
      </div>

      {/* Support Dialog Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            id="support-dialog"
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Skill Grow Support</h3>
                  <p className="text-[11px] text-orange-100 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                    <span>Live 10 AM - 7 PM (Mon-Sat)</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Options */}
            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs text-gray-600 font-medium">
                Namaste! How can our support team assist you today?
              </p>

              {/* WhatsApp Live Chat */}
              <a
                href="https://api.whatsapp.com/send?phone=916265083155&text=Hello%20Skill%20Grow%20IND%20Support,%20I%20need%20help%20with%20course%20enrollment"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-bold">Instant WhatsApp Support</h4>
                  <p className="text-[10px] text-emerald-700">Chat directly with an executive</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600">Chat ➔</span>
              </a>

              {/* Call Helpline */}
              <a
                href="tel:+916265083155"
                className="flex items-center space-x-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-bold">Call Helpline</h4>
                  <p className="text-[10px] text-amber-700">(+91) 6265 083 155</p>
                </div>
                <span className="text-[11px] font-bold text-amber-600">Call ➔</span>
              </a>

              {/* Email Support */}
              <a
                href="mailto:support@skillgrowind.com"
                className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-bold">Email Desk</h4>
                  <p className="text-[10px] text-slate-500">support@skillgrowind.com</p>
                </div>
                <span className="text-[11px] font-bold text-slate-600">Send ➔</span>
              </a>

              <div className="pt-2 text-center text-[10px] text-gray-400">
                <span>Certified Skill Grow India Support Network</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
