'use client';

import React, { useState } from 'react';
import { X, Wrench, CheckCircle2, ShieldAlert } from 'lucide-react';
import { OrderItem } from '@/lib/store';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSurvey: (data: {
    customer: OrderItem['customer'];
    customerNotes?: string;
  }) => OrderItem;
}

export const SurveyModal: React.FC<SurveyModalProps> = ({
  isOpen,
  onClose,
  onRequestSurvey,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [siteType, setSiteType] = useState<OrderItem['customer']['siteType']>('Commercial');
  const [notes, setNotes] = useState('');
  const [confirmedSurvey, setConfirmedSurvey] = useState<OrderItem | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !address) return;

    const survey = onRequestSurvey({
      customer: {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        city,
        siteType,
      },
      customerNotes: notes.trim(),
    });

    setConfirmedSurvey(survey);
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

        {confirmedSurvey ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Physical Site Survey Scheduled!</h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <p className="text-slate-400">Survey Reference ID:</p>
              <p className="text-cyan-400 font-bold text-sm">{confirmedSurvey.orderNumber}</p>
              <p className="text-slate-400 mt-2">Location: {confirmedSurvey.customer.city} ({confirmedSurvey.customer.siteType})</p>
            </div>
            <p className="text-xs text-slate-400">
              Senior Field Engineer Muhammad Irfan has been notified. You will receive an appointment confirmation call within 2 business hours.
            </p>
            <button
              onClick={() => {
                setConfirmedSurvey(null);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Schedule an On-Site Security Survey</h3>
                <p className="text-xs text-slate-400">Certified PEC engineer visit for camera angles &amp; cabling estimation.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Individual Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Director Operations, Nishat Mills"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Contact (03XX) *</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Site / Physical Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot #, Street, Industrial Area, Commercial Plaza..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Gujranwala">Gujranwala</option>
                  <option value="Sialkot">Sialkot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Facility Category</label>
                <select
                  value={siteType}
                  onChange={(e) => setSiteType(e.target.value as OrderItem['customer']['siteType'])}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Industrial">Industrial / Factory</option>
                  <option value="Commercial">Commercial Plaza / Retail</option>
                  <option value="Corporate_B2B">Corporate Headquarters</option>
                  <option value="Government_Education">University / College</option>
                  <option value="Residential">Private Estate / Residence</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Requirements / Camera Estimates</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Approx 16-32 cameras needed, perimeter boundary cabling, biometric gates..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
              >
                Submit Survey Request (Free of Charge)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
