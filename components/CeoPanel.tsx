'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Shield,
  Award,
  Layers,
  FileCheck,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  Building2,
  Lock,
  MessageSquare,
  Headphones,
  Settings,
  Phone,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ProductItem, OrderItem, CredentialItem, AuditLogItem, ComplaintItem } from '@/lib/initial-data';

interface CeoPanelProps {
  products: ProductItem[];
  orders: OrderItem[];
  credentials: CredentialItem[];
  auditLogs: AuditLogItem[];
  businessWhatsApp: string;
  onUpdateWhatsApp: (newNumber: string) => string;
  complaints: ComplaintItem[];
  onToggleCredential: (credId: string) => void;
  onAddCredential: (cred: Omit<CredentialItem, 'id'>) => void;
  onOpenAddProduct: () => void;
}

export const CeoPanel: React.FC<CeoPanelProps> = ({
  products,
  orders,
  credentials,
  auditLogs,
  businessWhatsApp,
  onUpdateWhatsApp,
  complaints,
  onToggleCredential,
  onAddCredential,
  onOpenAddProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'FINANCIALS' | 'CREDENTIALS' | 'COMPLAINTS' | 'SETTINGS' | 'AUDIT_LOGS'>('FINANCIALS');
  const [isAddingCredential, setIsAddingCredential] = useState(false);

  // WhatsApp Routing Settings State
  const [newWhatsAppNumber, setNewWhatsAppNumber] = useState(businessWhatsApp);
  const [whatsAppSuccess, setWhatsAppSuccess] = useState<string | null>(null);
  const [whatsAppError, setWhatsAppError] = useState<string | null>(null);

  // New Credential Form State
  const [credTitle, setCredTitle] = useState('');
  const [credType, setCredType] = useState<CredentialItem['type']>('OEM_PARTNERSHIP');
  const [credIssuer, setCredIssuer] = useState('');
  const [credLicense, setCredLicense] = useState('');

  // 1. Authoritative Backend Financial Aggregation Simulation
  const installedOrders = orders.filter((o) => o.status === 'Installed');

  const grossSales = installedOrders.reduce((sum, o) => sum + o.grossTotal, 0);
  const costOfGoods = installedOrders.reduce((sum, o) => sum + o.totalCostOfGoods, 0);
  const netProfit = installedOrders.reduce((sum, o) => sum + o.netProfit, 0);
  const profitMargin = grossSales > 0 ? (netProfit / grossSales) * 100 : 0;

  const outstandingReceivables = orders
    .filter((o) => o.status === 'Installed' && o.paymentStatus === 'Pending')
    .reduce((sum, o) => sum + o.grossTotal, 0);

  const warehouseCostValuation = products.reduce((sum, p) => sum + p.costPrice * p.stockQuantity, 0);
  const warehouseRetailValuation = products.reduce(
    (sum, p) => sum + (p.discountedPrice || p.sellingPrice) * p.stockQuantity,
    0
  );

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credTitle || !credIssuer) return;

    onAddCredential({
      title: credTitle.trim(),
      type: credType,
      issuer: credIssuer.trim(),
      licenseNumber: credLicense.trim() || undefined,
      validFrom: new Date().toISOString().slice(0, 10),
      badgeImageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=80',
      badgeColor: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
      displayOrder: credentials.length + 1,
      isActive: true,
    });

    setIsAddingCredential(false);
    setCredTitle('');
    setCredIssuer('');
    setCredLicense('');
  };

  return (
    <div className="py-8 bg-slate-950 text-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-800/60 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              Executive Governance (Ashraf Sahib - CEO)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Financials &amp; Brand Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Confidential executive analytics: Net profit margins, Cost of Goods Sold (COGS), receivables, and OEM partner credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddProduct}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Add New Camera / Hardware
            </button>
            <span className="text-xs text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800 font-mono font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              CONFIDENTIAL / CEO EYES ONLY
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2.5 mt-6 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setActiveTab('FINANCIALS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'FINANCIALS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Financial Aggregation &amp; Margins
          </button>
          <button
            onClick={() => setActiveTab('CREDENTIALS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CREDENTIALS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Brand Credentials ({credentials.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLAINTS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'COMPLAINTS'
                ? 'bg-red-700 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-red-400" />
            Customer Complaints ({complaints.filter((c) => c.status !== 'RESOLVED').length} Active)
          </button>
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'SETTINGS'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            WhatsApp &amp; Settings
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'AUDIT_LOGS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* TAB 1: FINANCIALS */}
        {activeTab === 'FINANCIALS' && (
          <div className="mt-6 space-y-6">
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>Gross Sales (Installed)</span>
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  PKR {grossSales.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Completed Jobs: {installedOrders.length}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>Cost of Goods Sold (COGS)</span>
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-amber-300 font-mono">
                  PKR {costOfGoods.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Direct hardware wholesale cost
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>Net Profit (Take-Home)</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  PKR {netProfit.toLocaleString()}
                </div>
                <div className="mt-2 text-xs font-mono text-emerald-300 font-semibold">
                  Net Margin: {profitMargin.toFixed(1)}%
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>Outstanding Receivables</span>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-extrabold text-red-400 font-mono">
                  PKR {outstandingReceivables.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Work done, awaiting client payment
                </p>
              </div>
            </div>

            {/* Warehouse Valuation Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Warehouse Inventory Valuation &amp; Unrealized Equity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Wholesale Cost Investment:</span>
                  <span className="text-xl font-bold text-white">
                    PKR {warehouseCostValuation.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Projected Retail Turnover:</span>
                  <span className="text-xl font-bold text-cyan-400">
                    PKR {warehouseRetailValuation.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Projected Unrealized Margin:</span>
                  <span className="text-xl font-bold text-emerald-400">
                    PKR {(warehouseRetailValuation - warehouseCostValuation).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Installed Orders Profit Ledger */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 font-bold text-sm">
                Executive Order Profit Ledger
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono">
                    <tr>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4 text-right">Gross Total</th>
                      <th className="py-3 px-4 text-right">Cost Price (COGS)</th>
                      <th className="py-3 px-4 text-right">Net Profit</th>
                      <th className="py-3 px-4 text-center">Margin %</th>
                      <th className="py-3 px-4">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {installedOrders.map((ord) => {
                      const orderMargin = ord.grossTotal > 0 ? (ord.netProfit / ord.grossTotal) * 100 : 0;

                      return (
                        <tr key={ord._id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-bold text-cyan-400">{ord.orderNumber}</td>
                          <td className="py-3 px-4 font-sans font-medium text-white">
                            {ord.customer.fullName} ({ord.customer.siteType})
                          </td>
                          <td className="py-3 px-4 text-right text-white">
                            PKR {ord.grossTotal.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-amber-300">
                            PKR {ord.totalCostOfGoods.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-400">
                            PKR {ord.netProfit.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-300">
                            {orderMargin.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.paymentStatus === 'Verified'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                                  : 'bg-red-950 text-red-400 border border-red-800'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREDENTIALS MANAGER */}
        {activeTab === 'CREDENTIALS' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Official Brand Credentials &amp; Certifications</h3>
                <p className="text-xs text-slate-400">These badges appear dynamically in the public marketplace trust section.</p>
              </div>
              <button
                onClick={() => setIsAddingCredential(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Partnership / Accreditation
              </button>
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credentials.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                        {c.type.replace('_', ' ')}
                      </span>
                      {c.isActive ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Active on Website
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Hidden
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-white">{c.title}</h4>
                    <p className="text-xs text-slate-400">{c.issuer}</p>
                    {c.licenseNumber && (
                      <p className="text-[11px] font-mono text-slate-300">License #: {c.licenseNumber}</p>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleCredential(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      c.isActive
                        ? 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800'
                        : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {c.isActive ? 'Deactivate' : 'Publish'}
                  </button>
                </div>
              ))}
            </div>

            {/* Modal: Add Credential */}
            {isAddingCredential && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
                  <button
                    onClick={() => setIsAddingCredential(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                  <h3 className="text-base font-bold mb-4">Add B2B Trust Credential</h3>

                  <form onSubmit={handleCreateCredential} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Credential Title *</label>
                      <input
                        type="text"
                        required
                        value={credTitle}
                        onChange={(e) => setCredTitle(e.target.value)}
                        placeholder="e.g. Dell Authorized Enterprise Solutions Partner"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                      <select
                        value={credType}
                        onChange={(e) => setCredType(e.target.value as CredentialItem['type'])}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                      >
                        <option value="OEM_PARTNERSHIP">OEM Partnership (Hikvision/Dahua/Dell)</option>
                        <option value="GOVERNMENT_REGISTRATION">Government / Engineering Council (PEC)</option>
                        <option value="ISO_CERTIFICATION">ISO Quality Certification</option>
                        <option value="AWARD">National Security Award</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Issuer Body *</label>
                      <input
                        type="text"
                        required
                        value={credIssuer}
                        onChange={(e) => setCredIssuer(e.target.value)}
                        placeholder="e.g. Dell Technologies South Asia"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Registration / Certificate #</label>
                      <input
                        type="text"
                        value={credLicense}
                        onChange={(e) => setCredLicense(e.target.value)}
                        placeholder="e.g. DELL-PK-ENT-7782"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingCredential(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                      >
                        Save Credential
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER COMPLAINTS OVERSIGHT */}
        {activeTab === 'COMPLAINTS' && (
          <div className="mt-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-red-400" />
                    Customer Complaints &amp; Warranty Service Oversight
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time monitoring of customer issues, offline cameras, and field repair escalations.
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  Total Complaints: <span className="text-white font-bold">{complaints.length}</span> ({complaints.filter(c => c.status !== 'RESOLVED').length} Active)
                </div>
              </div>

              {complaints.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No complaints registered yet. System operational without open tickets.
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80 mt-2">
                  {complaints.map((c) => {
                    const handleDirectWhatsApp = () => {
                      const text = encodeURIComponent(
                        `Assalam-o-Alaikum ${c.customerName}, I am Ashraf (CEO, Tooba Engineering). I am personally following up on your complaint #${c.ticketNumber} regarding "${c.issueType.replace(/_/g, ' ')}". We have dispatched our technical lead to resolve this.`
                      );
                      window.open(`https://wa.me/${c.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                    };

                    return (
                      <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60">
                              {c.ticketNumber}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                c.priority === 'CRITICAL'
                                  ? 'bg-red-600 text-white'
                                  : c.priority === 'HIGH'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {c.priority} PRIORITY
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                c.status === 'RESOLVED'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white">
                            {c.customerName} - <span className="text-slate-400 font-mono text-xs">{c.customerPhone}</span>
                          </h4>
                          <p className="text-xs text-slate-300">
                            <span className="text-slate-500 font-mono font-semibold">Issue:</span> {c.issueType.replace(/_/g, ' ')}
                            {c.orderNumber && <span className="text-cyan-400 font-mono ml-2">[{c.orderNumber}]</span>}
                          </p>
                          <p className="text-xs text-slate-400 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                            &quot;{c.description}&quot;
                          </p>
                          {c.resolutionNotes && (
                            <p className="text-xs text-emerald-400 mt-1">
                              ✓ Resolution: {c.resolutionNotes}
                            </p>
                          )}
                          <div className="text-[10px] text-slate-500 font-mono">
                            Logged: {new Date(c.createdAt).toLocaleString('en-PK')}
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <button
                            onClick={handleDirectWhatsApp}
                            className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            WhatsApp Customer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: WHATSAPP ROUTING & EXECUTIVE SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div className="mt-6 space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6 max-w-3xl">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/60 mb-2">
                  <Settings className="w-3.5 h-3.5" />
                  Executive Communications Control
                </div>
                <h3 className="text-xl font-bold text-white">Official Business WhatsApp Routing</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Agar kisi waja say CEO ka WhatsApp band ho jaye ya official number tabdeel karna ho, to yahan naya number save kar dain.
                  Tamam customer orders, inquiries, aur quotation alerts foran is naye number per send hongay.
                </p>
              </div>

              {/* Current Active Routing Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block">
                    Currently Active WhatsApp Target
                  </span>
                  <div className="text-lg font-mono font-bold text-emerald-400 flex items-center gap-2 mt-0.5">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    +{businessWhatsApp}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                    wa.me/{businessWhatsApp}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(
                        'CEO WhatsApp Route Verification Test: Connection is verified and operational.'
                      )}`,
                      '_blank'
                    );
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Test Live Connection
                </button>
              </div>

              {/* Update Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setWhatsAppError(null);
                  setWhatsAppSuccess(null);

                  let clean = newWhatsAppNumber.replace(/[^0-9]/g, '');
                  if (clean.startsWith('03')) {
                    clean = '92' + clean.slice(1);
                  }
                  if (!clean || clean.length < 10) {
                    setWhatsAppError('Please provide a valid phone number (e.g. 923001234567 or 03001234567).');
                    return;
                  }

                  const applied = onUpdateWhatsApp(clean);
                  setNewWhatsAppNumber(applied);
                  setWhatsAppSuccess(`WhatsApp routing successfully updated to +${applied}. All customer orders will now route to this number.`);
                }}
                className="space-y-4 pt-2 border-t border-slate-800/80"
              >
                {whatsAppSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{whatsAppSuccess}</span>
                  </div>
                )}

                {whatsAppError && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{whatsAppError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enter New Business WhatsApp Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={newWhatsAppNumber}
                      onChange={(e) => {
                        setNewWhatsAppNumber(e.target.value);
                        setWhatsAppSuccess(null);
                        setWhatsAppError(null);
                      }}
                      placeholder="e.g. 923001234567 or 03008451234"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-300 font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Formats accepted: <span className="font-mono text-slate-400">923001234567</span> or <span className="font-mono text-slate-400">03001234567</span>. Non-digits are cleaned automatically.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
                  <p className="font-semibold text-slate-300">Operational Guarantee:</p>
                  <p>• Customer cart Cash-on-Delivery submissions immediately use this number.</p>
                  <p>• Top Navbar &amp; Hero WhatsApp buttons will deep-link directly to this number.</p>
                  <p>• Customer care ticket escalation messages route here.</p>
                  <p>• Saved in local state with an immutable audit log entry.</p>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save &amp; Apply WhatsApp Number
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="mt-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center">
                <span className="font-bold text-sm">Immutable Security &amp; Administrative Audit Stream</span>
                <span className="text-[11px] text-slate-400 font-mono">APPEND-ONLY / ZERO DELETE PERMISSIONS</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target / Reference</th>
                      <th className="py-3 px-4">Details &amp; Reason</th>
                      <th className="py-3 px-4 font-mono">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {new Date(log.timestamp).toLocaleString('en-PK')}
                        </td>
                        <td className="py-3 px-4 font-medium text-white">
                          <div>{log.actorName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{log.actorEmail}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">{log.action}</td>
                        <td className="py-3 px-4 font-mono text-cyan-400">{log.target}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs">{log.details}</td>
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
