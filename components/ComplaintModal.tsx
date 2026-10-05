'use client';

import React, { useState } from 'react';
import { X, Headphones, AlertTriangle, CheckCircle2, ShieldCheck, Phone, Clock } from 'lucide-react';
import { ComplaintItem } from '@/lib/initial-data';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplaint: (data: {
    customerName: string;
    customerPhone: string;
    orderNumber?: string;
    issueType: ComplaintItem['issueType'];
    priority: ComplaintItem['priority'];
    description: string;
  }) => ComplaintItem;
  businessWhatsApp: string;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  isOpen,
  onClose,
  onSubmitComplaint,
  businessWhatsApp,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [issueType, setIssueType] = useState<ComplaintItem['issueType']>('CAMERA_OFFLINE');
  const [priority, setPriority] = useState<ComplaintItem['priority']>('HIGH');
  const [description, setDescription] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<ComplaintItem | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !description.trim()) return;

    const ticket = onSubmitComplaint({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderNumber: orderNumber.trim() || undefined,
      issueType,
      priority,
      description: description.trim(),
    });

    setSubmittedTicket(ticket);
  };

  const handleWhatsAppEscalation = () => {
    if (!submittedTicket) return;
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Tooba Customer Care, I have registered formal support complaint #${submittedTicket.ticketNumber} regarding "${submittedTicket.issueType.replace(
        /_/g,
        ' '
      )}". Customer: ${submittedTicket.customerName}, Phone: ${submittedTicket.customerPhone}. Kindly escalate to field supervisor.`
    );
    window.open(`https://wa.me/${businessWhatsApp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
          <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800/80">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Tooba Customer Care &amp; Warranty Service</h3>
            <p className="text-xs text-slate-400">
              Submit a service complaint or hardware issue. Directly reviewed by CEO &amp; Admin.
            </p>
          </div>
        </div>

        {submittedTicket ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-white">Complaint Lodged Successfully</h4>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <span className="text-slate-400">Support Ticket Number:</span>
              <p className="text-cyan-400 font-bold text-base">{submittedTicket.ticketNumber}</p>
              <p className="text-slate-400 text-[11px] mt-1">Priority: {submittedTicket.priority}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Your issue has been routed to Operations Lead Tayyab and executive oversight by Ashraf Sahib. A technician will contact you shortly.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppEscalation}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Notify Support Supervisor on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmittedTicket(null);
                  onClose();
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold cursor-pointer"
              >
                Close Ticket View
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name / Organization *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Tariq Mehmood / Apex Textiles"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number (03XX) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Order / Job # (If known)
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="TE-20261001-XXXX"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Issue Classification *
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as ComplaintItem['issueType'])}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="CAMERA_OFFLINE">Camera Video Feed Offline</option>
                  <option value="NIGHT_VISION_BLUR">Night ColorVu / IR Blur</option>
                  <option value="DVR_STORAGE_FAILURE">DVR / HDD Storage Error</option>
                  <option value="TECHNICIAN_DELAY">Technician Delayed / Reschedule</option>
                  <option value="WIRING_DAMAGE">Cable / Conduit Damage</option>
                  <option value="GENERAL_WARRANTY">Warranty Replacement Claim</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintItem['priority'])}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="LOW">Low (Routine Query)</option>
                  <option value="MEDIUM">Medium (Minor Issue)</option>
                  <option value="HIGH">High (Main Camera Down)</option>
                  <option value="CRITICAL">Critical (Total Site Down)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Problem Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, camera location, or error message on monitor..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-950/60 cursor-pointer"
              >
                Submit Formal Complaint
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
