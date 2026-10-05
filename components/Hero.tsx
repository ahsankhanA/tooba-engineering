'use client';

import React from 'react';
import { ShieldCheck, Video, Award, Clock, ArrowRight, CheckCircle2, MessageSquare, Wrench } from 'lucide-react';

interface HeroProps {
  onOpenSurvey: () => void;
  onExplorePackages: () => void;
  businessWhatsApp?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenSurvey,
  onExplorePackages,
  businessWhatsApp = '923001234567',
}) => {
  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      'Hello Tooba Engineering, I would like to schedule a security consultation and site quotation.'
    );
    window.open(`https://wa.me/${businessWhatsApp}?text=${text}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 lg:py-24 border-b border-slate-800">
      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-medium">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>17+ Years of Engineering Integrity in Pakistan (Est. 2007)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Enterprise CCTV &amp; <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                Surveillance Infrastructure
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Tooba Engineering delivers high-security turnkey solutions: 4K AcuSense CCTV, industrial networking,
              biometric access control, and structured data centers for corporations, universities, and upscale residences.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hikvision &amp; Dahua Authorized Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PEC Registered Contracting Firm</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Year Hardware Replacement Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cash on Delivery &amp; Bank Transfer</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onOpenSurvey}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-900/40 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Book Free Site Survey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExplorePackages}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium px-5 py-3.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 text-cyan-400" />
                <span>Browse Packages</span>
              </button>

              <button
                onClick={handleWhatsAppChat}
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Instant Quote</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Trust Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 border border-slate-800 shadow-2xl shadow-cyan-950/20">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Tooba Engineering Portal</h3>
                    <p className="text-xs text-slate-400">Official Executive &amp; Operations Hub</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ONLINE
                </span>
              </div>

              {/* Key Features Callout */}
              <div className="space-y-4 py-5">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">4K ColorVu &amp; AcuSense AI</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Full-color night vision and AI false-alarm elimination for industrial perimeters and residences.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">24/7 Technician Dispatch</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dedicated teams under Operations Lead Tayyab for prompt installation and emergency on-site support.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Executive CEO Governance</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct quality oversight by Ashraf Sahib with verified OEM partner credentials.
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Hotline Banner */}
              <div className="rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 p-3.5 border border-cyan-800/40 flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Head Office &amp; Engineering Lab:</p>
                  <p className="text-white font-semibold">Gulberg III &amp; Model Town, Lahore</p>
                </div>
                <a
                  href="tel:+923001234567"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold transition-colors"
                >
                  CALL NOW
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">17+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-medium">Years in Business</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">4,500+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-medium">Cameras Deployed</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">450+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-medium">Institutions &amp; B2B Clients</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-medium">COD / Tested Handoff</div>
          </div>
        </div>
      </div>
    </section>
  );
};
