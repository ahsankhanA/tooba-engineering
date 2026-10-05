'use client';

import React from 'react';
import { Award, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import { CredentialItem } from '@/lib/store';

interface TrustSectionProps {
  credentials: CredentialItem[];
  isCeo: boolean;
  onOpenCeoPanel: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({
  credentials,
  isCeo,
  onOpenCeoPanel,
}) => {
  const activeCredentials = credentials.filter((c) => c.isActive);

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">
              <Award className="w-3.5 h-3.5" />
              Verified Enterprise Credentials
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Certified Partnerships &amp; Engineering Accreditations
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              All surveillance installations are governed by strict PEC engineering compliance and direct OEM tier-1 authorized supply chains.
            </p>
          </div>

          {isCeo && (
            <button
              onClick={onOpenCeoPanel}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600/50 text-xs font-medium transition-all"
            >
              <span>Manage Credentials (CEO Only)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeCredentials.map((cred) => (
            <div
              key={cred.id}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {cred.type.replace('_', ' ')}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                {cred.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{cred.issuer}</p>

              {cred.licenseNumber && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Reg #:</span>
                  <span className="text-slate-300 font-semibold">{cred.licenseNumber}</span>
                </div>
              )}

              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Active &amp; Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
