'use client';

import React, { useState } from 'react';
import { X, Wrench, Plus, Phone, CheckCircle2, UserCheck, Star, Shield, MapPin, MessageSquare, Trash2 } from 'lucide-react';
import { TechnicianItem } from '@/lib/initial-data';

interface TechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicians: TechnicianItem[];
  onAddTechnician: (tech: Omit<TechnicianItem, 'id' | 'rating'>) => TechnicianItem;
  onUpdateStatus: (techId: string, status: TechnicianItem['status']) => void;
  onRemoveTechnician?: (techId: string) => void;
}

export const TechnicianModal: React.FC<TechnicianModalProps> = ({
  isOpen,
  onClose,
  technicians,
  onAddTechnician,
  onUpdateStatus,
  onRemoveTechnician,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('03001234567');
  const [whatsappNumber, setWhatsappNumber] = useState('923001234567');
  const [address, setAddress] = useState('Model Town, Lahore');
  const [specialization, setSpecialization] = useState<TechnicianItem['specialization']>('CCTV_NVR');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [totalJobsCompleted, setTotalJobsCompleted] = useState<number>(45);
  const [activeCity, setActiveCity] = useState('Lahore & Surrounding Areas');
  const [status, setStatus] = useState<TechnicianItem['status']>('AVAILABLE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    onAddTechnician({
      name: name.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.replace(/[^0-9]/g, '') || phone.replace(/[^0-9]/g, ''),
      address: address.trim(),
      specialization,
      experienceYears: Number(experienceYears) || 1,
      totalJobsCompleted: Number(totalJobsCompleted) || 0,
      status,
      activeCity: activeCity.trim() || 'Lahore',
    });

    setName('');
    setAddress('Model Town, Lahore');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Field Engineering Staff &amp; Technicians Directory</h3>
              <p className="text-xs text-slate-400">
                Register verified engineers with WhatsApp contacts, address, experience, and completed site counts.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'View All Technicians' : '+ Enlist New Certified Technician'}
          </button>
        </div>

        {/* Form: Enlist New Technician */}
        {showAddForm ? (
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 mb-6">
            <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Enroll Certified Field Installation Engineer
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name &amp; Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Engr. Rashid Minhas"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone (Calling Number) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp Direct Number *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="923001234567"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-400 font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Orders will be forwarded to this WhatsApp</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Residential / Workshop Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 42, Main Market, Model Town, Lahore"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assigned Territory / Operating City
                </label>
                <input
                  type="text"
                  value={activeCity}
                  onChange={(e) => setActiveCity(e.target.value)}
                  placeholder="e.g. Lahore / Sundar / Sheikhupura"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technical Specialization *
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value as TechnicianItem['specialization'])}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="CCTV_NVR">IP Surveillance &amp; AcuSense NVRs</option>
                  <option value="FIBER_NETWORKING">Optical Fiber &amp; Cat6 Cabling</option>
                  <option value="BIOMETRICS_ACCESS">Biometrics &amp; Turnstile Barriers</option>
                  <option value="ELECTRICAL_CONDUIT">Electrical Conduit &amp; PVC Piping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Field Experience (Years) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Orders / Sites Completed *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={totalJobsCompleted}
                  onChange={(e) => setTotalJobsCompleted(parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 142"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-400 font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Visible to customers for trust</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/60"
              >
                Save &amp; Enroll Technician
              </button>
            </div>
          </form>
        ) : null}

        {/* Technicians List Grid */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                      {tech.specialization.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        tech.status === 'AVAILABLE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : tech.status === 'ON_JOB'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tech.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{tech.name}</h4>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{tech.address}</span>
                  </div>

                  <div className="mt-3 py-2.5 px-3 rounded-lg bg-slate-900/80 border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Experience</span>
                      <span className="text-white font-bold">{tech.experienceYears} Yrs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Sites Completed</span>
                      <span className="text-emerald-400 font-bold">{tech.totalJobsCompleted} Sites</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Rating</span>
                      <span className="text-amber-400 font-bold">★ {tech.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">WA:</span>
                    <span className="text-emerald-400 font-semibold">{tech.whatsappNumber}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateStatus(tech.id, 'AVAILABLE')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        tech.status === 'AVAILABLE'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => onUpdateStatus(tech.id, 'ON_JOB')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        tech.status === 'ON_JOB'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      On Job
                    </button>
                    {onRemoveTechnician && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove technician ${tech.name}?`)) {
                            onRemoveTechnician(tech.id);
                          }
                        }}
                        className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/60 border border-red-900/60 transition-colors cursor-pointer"
                        title="Remove Technician"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
