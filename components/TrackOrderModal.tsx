'use client';

import React, { useState } from 'react';
import { X, Search, ShieldCheck, CheckCircle2, Clock, Truck, Wrench, AlertCircle } from 'lucide-react';
import { OrderItem } from '@/lib/store';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<OrderItem | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    const cleanNo = orderNumber.trim().toUpperCase();
    const cleanPhone = phoneNumber.replace(/[\s-]/g, '');

    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanNo &&
        o.customer.phoneNumber.replace(/[\s-]/g, '').endsWith(cleanPhone.slice(-9))
    );

    setMatchedOrder(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Track Surveillance Job &amp; Warranty</h3>
            <p className="text-xs text-slate-400">Anti-IDOR protected: Verified by Order ID and Phone.</p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Order # *</label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="TE-20261001-XXXX"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Phone *</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="03001234567"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            Verify &amp; Track Status
          </button>
        </form>

        {searched && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            {matchedOrder ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 font-mono text-[11px]">{matchedOrder.orderNumber}</span>
                    <h4 className="font-bold text-white text-sm mt-0.5">{matchedOrder.customer.fullName}</h4>
                    <p className="text-slate-400 text-[11px]">{matchedOrder.customer.city} ({matchedOrder.customer.siteType})</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs font-mono uppercase ${
                      matchedOrder.status === 'Installed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : matchedOrder.status === 'Survey_Scheduled'
                        ? 'bg-blue-950 text-blue-400 border border-blue-700'
                        : 'bg-amber-950 text-amber-400 border border-amber-700'
                    }`}
                  >
                    {matchedOrder.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Timeline */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Order Verified &amp; Hardware Allocated</span>
                  </div>

                  <div className={`flex items-center gap-2 ${
                    matchedOrder.status === 'Survey_Scheduled' || matchedOrder.status === 'Installed'
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}>
                    {matchedOrder.status === 'Survey_Scheduled' || matchedOrder.status === 'Installed' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 shrink-0" />
                    )}
                    <span>
                      {matchedOrder.assignedTechnician
                        ? `Technician Assigned: ${matchedOrder.assignedTechnician.name}`
                        : 'Site Survey & Engineering Assessment'}
                    </span>
                  </div>

                  <div className={`flex items-center gap-2 ${
                    matchedOrder.status === 'Installed' ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {matchedOrder.status === 'Installed' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <Wrench className="w-4 h-4 shrink-0" />
                    )}
                    <span>Installation, Angle Alignment &amp; Mobile Setup Handover</span>
                  </div>
                </div>

                {matchedOrder.assignedTechnician && (
                  <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-cyan-300">Assigned Field Engineer:</p>
                    <p className="text-white font-medium">{matchedOrder.assignedTechnician.name} ({matchedOrder.assignedTechnician.phone})</p>
                    {matchedOrder.assignedTechnician.notes && (
                      <p className="text-slate-300 italic text-[11px]">&ldquo;{matchedOrder.assignedTechnician.notes}&rdquo;</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No order matches this Order ID and Customer Phone combination.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
