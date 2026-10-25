import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, FileCode, ExternalLink, HelpCircle } from 'lucide-react';
import { SHOP_CONFIG } from '../shopConfig';

interface SetupChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupChecklistModal: React.FC<SetupChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-checklist-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-[#0A2616] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close configuration checklist"
            className="absolute top-5 right-5 text-stone-300 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FF5E0E] text-white flex items-center justify-center text-xl shadow-md">
              ⚙️
            </div>
            <div>
              <h2 id="setup-checklist-title" className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                Store Setup & Customization Guide
              </h2>
              <p className="text-xs text-amber-200 mt-0.5">
                Everything you need to launch {SHOP_CONFIG.brandName} for real customers
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">Single Source of Truth:</p>
              <p className="leading-relaxed">
                All store details (name, prices, WhatsApp number, opening hours, address) are centralized in a single file: <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-amber-950">src/shopConfig.ts</code>. You can customize them in 1 minute.
              </p>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Items That Need Store Confirmation:
            </h3>

            {SHOP_CONFIG.setupChecklist.map((item) => (
              <div
                key={item.key}
                className="p-4 rounded-2xl border border-stone-200/90 bg-stone-50/60 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">
                      {item.label}
                    </span>
                    {item.isConfigured ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Needs Your Real Detail
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.helpText}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Code Reference */}
          <div className="bg-stone-900 text-stone-200 rounded-2xl p-4 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <FileCode className="w-4 h-4" />
              <span>How to edit src/shopConfig.ts:</span>
            </div>
            <pre className="text-[11px] text-stone-300 overflow-x-auto whitespace-pre p-2 bg-black/40 rounded-xl leading-relaxed">
{`export const SHOP_CONFIG = {
  brandName: 'Ajju juice Wala',
  whatsappNumber: '919876543210', // <-- Enter your 10-digit number
  displayPhone: '+91 98765 43210',  // <-- Enter phone for calls
  address: 'Shop No. 4, Market Road, [Your City]',
  openingHours: '8:00 AM – 10:30 PM',
  ...
};`}
            </pre>
          </div>

          {/* Close button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#0A2616] hover:bg-[#123822] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              Done / Close Setup Guide
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
