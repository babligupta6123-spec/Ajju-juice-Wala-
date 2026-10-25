import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageSquare, Instagram, Mail, Send, CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { SHOP_CONFIG } from '../shopConfig';

export const ContactLocation: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide your name (at least 2 characters).';
    }
    if (!formData.emailOrPhone.trim() || formData.emailOrPhone.trim().length < 5) {
      newErrors.emailOrPhone = 'Please provide a valid email or phone number.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide your message (at least 10 characters).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF9] to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Store Location & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0F3822] tracking-tight font-heading">
            Visit Our Juice Bar
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Step by for freshly squeezed goodness, or reach out to us for bulk catering, events, and parties.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Cards & Map Card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Address */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Shop Location
                    </h3>
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                      Needs Exact Landmark
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-stone-900 mt-1 leading-snug">
                    {STORE_INFO.address}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Editable in <code className="bg-stone-100 px-1 rounded text-stone-700">src/shopConfig.ts</code>
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Opening Hours
                  </h3>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5 leading-snug">
                    {STORE_INFO.hours}
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Open 7 Days a Week
                  </span>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Call / WhatsApp
                    </h3>
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                      Placeholder Number
                    </span>
                  </div>
                  <a
                    href={`tel:${STORE_INFO.phone}`}
                    className="text-sm font-bold text-stone-900 hover:text-orange-600 block mt-0.5"
                  >
                    {STORE_INFO.phone}
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    WhatsApp Orders: {STORE_INFO.displayWhatsapp}
                  </p>
                  <p className="text-[10px] text-amber-700 mt-1">
                    * Set your WhatsApp number in shopConfig.ts to receive direct orders
                  </p>
                </div>
              </div>

              {/* Instagram & Social */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Social & Stories
                  </h3>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">
                    {STORE_INFO.instagram}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Tag us with #{SHOP_CONFIG.brandName.replace(/\s+/g, '')}
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Interactive Map Display */}
            <div className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm aspect-[16/8] flex flex-col justify-between p-6">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80)',
                }}
              />
              <div className="relative z-10 flex items-start justify-between">
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-stone-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-stone-900">
                      {STORE_INFO.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">{SHOP_CONFIG.cityArea}</p>
                </div>

                <a
                  href={SHOP_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#0F3822] hover:bg-stone-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-colors"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Pin indicator */}
              <div className="relative z-10 self-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-white text-lg animate-bounce">
                  📍
                </div>
                <span className="text-[10px] font-bold bg-black/75 text-white px-2 py-0.5 rounded-full mt-1">
                  {STORE_INFO.name}
                </span>
              </div>

              <div className="relative z-10 text-[11px] text-stone-600 font-medium bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200/60 inline-flex items-center gap-1.5 self-start">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Configure shop coordinates in <code className="text-stone-800 font-bold">src/shopConfig.ts</code> to update the Google Maps pin.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Catering Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md">
            <h3 className="text-xl font-black text-stone-900 font-heading mb-1">
              Send Us a Message
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Party orders, corporate juice deliveries, or feedback — drop us a note.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-lg font-bold text-stone-900">Message Received!</h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Thank you for contacting {STORE_INFO.name}. Our store team will reach out via phone or email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', emailOrPhone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="mt-4 text-xs font-bold text-orange-600 underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="text-xs font-bold text-stone-800 block mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:border-orange-500 focus:ring-orange-100'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-xs font-bold text-stone-800 block mb-1">
                    Phone Number or Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="text"
                    required
                    value={formData.emailOrPhone}
                    onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                    placeholder="e.g. 9876543210 or ramesh@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 ${
                      errors.emailOrPhone ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:border-orange-500 focus:ring-orange-100'
                    }`}
                  />
                  {errors.emailOrPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.emailOrPhone}</p>}
                </div>

                <div>
                  <label htmlFor="contact-subject" className="text-xs font-bold text-stone-800 block mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="General Inquiry">General Question</option>
                    <option value="Bulk / Party Catering">Bulk / Office / Birthday Catering</option>
                    <option value="Custom Flavor Request">Custom Flavor / Dietary Request</option>
                    <option value="Franchise Opportunity">Franchise or Partnership</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-xs font-bold text-stone-800 block mb-1">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need or how we can assist you..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 ${
                      errors.message ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:border-orange-500 focus:ring-orange-100'
                    }`}
                  />
                  {errors.message && <p className="text-[11px] text-rose-600 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#0F3822] hover:bg-[#14482b] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Send Message</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
