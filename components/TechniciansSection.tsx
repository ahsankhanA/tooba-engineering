'use client';

import React from 'react';
import { Wrench, Phone, MessageSquare, CheckCircle2, Star, ShieldCheck, MapPin } from 'lucide-react';
import { TechnicianItem } from '@/lib/initial-data';

interface TechniciansSectionProps {
  technicians: TechnicianItem[];
}

export const TechniciansSection: React.FC<TechniciansSectionProps> = ({ technicians }) => {
  return (
    <section className="py-14 bg-slate-950 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              PEC Certified Field Engineers
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Our Professional Installation Staff &amp; Technicians
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              All surveillance cabling, AcuSense camera alignment, and NVR networking are conducted by vetted, full-time engineering technicians.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{technicians.filter((t) => t.status === 'AVAILABLE').length} Engineers On-Call in Lahore</span>
          </div>
        </div>

        {/* Technicians Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {technicians.map((tech) => {
            const handleWhatsAppChat = () => {
              const text = encodeURIComponent(
                `Assalam-o-Alaikum ${tech.name}, I am contacting you through the Tooba Engineering portal for installation assistance and site consultation.`
              );
              window.open(`https://wa.me/${tech.whatsappNumber || tech.phone}?text=${text}`, '_blank');
            };

            return (
              <div
                key={tech.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                      {tech.specialization.replace(/_/g, ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 font-mono">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {tech.rating.toFixed(1)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                    {tech.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{tech.address}</span>
                  </div>

                  {/* Trust Highlights */}
                  <div className="my-4 py-3 px-3.5 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                    <div className="border-r border-slate-900 pr-2">
                      <span className="text-[10px] text-slate-500 block uppercase">Experience</span>
                      <span className="font-bold text-white text-sm">{tech.experienceYears}+ Years</span>
                    </div>
                    <div className="pl-2">
                      <span className="text-[10px] text-slate-500 block uppercase">Sites Completed</span>
                      <span className="font-bold text-emerald-400 text-sm">{tech.totalJobsCompleted} Jobs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>{tech.phone}</span>
                  </div>

                  <button
                    onClick={handleWhatsAppChat}
                    className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Direct WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Chat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
