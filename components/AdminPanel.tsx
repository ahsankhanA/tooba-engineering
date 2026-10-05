'use client';

import React, { useState } from 'react';
import {
  Package,
  Wrench,
  Users,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Search,
  RotateCcw,
  UserCheck,
  Video,
  Phone,
  MessageSquare,
  Headphones,
  Check,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { ProductItem, OrderItem, TechnicianItem, ComplaintItem } from '@/lib/initial-data';

interface AdminPanelProps {
  products: ProductItem[];
  orders: OrderItem[];
  technicians: TechnicianItem[];
  complaints: ComplaintItem[];
  onAdjustStock: (productId: string, adjustment: number, reason: string) => void;
  onUpdateOrder: (orderId: string, updates: Partial<OrderItem>) => void;
  onResolveComplaint: (ticketId: string, notes: string) => void;
  onSendJobToTechnicianWhatsApp: (order: OrderItem, tech?: TechnicianItem) => void;
  onOpenQuoteGenerator: () => void;
  onOpenAddProduct: () => void;
  onOpenTechnicianModal: () => void;
  onUpdateTechStatus: (techId: string, status: TechnicianItem['status']) => void;
  onRemoveTechnician?: (techId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  technicians,
  complaints,
  onAdjustStock,
  onUpdateOrder,
  onResolveComplaint,
  onSendJobToTechnicianWhatsApp,
  onOpenQuoteGenerator,
  onOpenAddProduct,
  onOpenTechnicianModal,
  onUpdateTechStatus,
  onRemoveTechnician,
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'INVENTORY' | 'TECHNICIANS' | 'COMPLAINTS'>('ORDERS');
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [searchOrder, setSearchOrder] = useState<string>('');

  // Stock Adjustment State
  const [selectedProductForStock, setSelectedProductForStock] = useState<ProductItem | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(5);
  const [stockReason, setStockReason] = useState<string>('Restocked from Hikvision authorized distributor');

  // Technician Dispatch State
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<OrderItem | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string>(technicians[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState('2026-10-06T10:00');
  const [dispatchNotes, setDispatchNotes] = useState('Bring 40m PVC pipe and 8x BNC connectors.');

  // Complaint Resolution State
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === 'ALL' || o.status === orderFilter;
    const matchesSearch =
      searchOrder === '' ||
      o.orderNumber.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.customer.phoneNumber.includes(searchOrder);
    return matchesStatus && matchesSearch;
  });

  const lowStockProducts = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);
  const pendingComplaints = complaints.filter((c) => c.status !== 'RESOLVED');

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForStock || !stockReason) return;
    onAdjustStock(selectedProductForStock._id, stockDelta, stockReason);
    setSelectedProductForStock(null);
  };

  const handleDispatchSubmit = (e: React.FormEvent, andWhatsApp: boolean = false) => {
    e.preventDefault();
    if (!selectedOrderForDispatch) return;

    const chosenTech = technicians.find((t) => t.id === selectedTechId) || technicians[0];

    onUpdateOrder(selectedOrderForDispatch._id, {
      status: 'Survey_Scheduled',
      assignedTechnician: {
        name: chosenTech.name,
        phone: chosenTech.phone,
        scheduledDate: scheduledDate,
        notes: dispatchNotes,
      },
    });

    if (andWhatsApp && chosenTech) {
      onSendJobToTechnicianWhatsApp(selectedOrderForDispatch, chosenTech);
    }

    setSelectedOrderForDispatch(null);
  };

  const handleResolveSubmit = (ticketId: string) => {
    if (!resolutionText.trim()) return;
    onResolveComplaint(ticketId, resolutionText);
    setResolvingTicketId(null);
    setResolutionText('');
  };

  return (
    <div className="py-8 bg-slate-950 text-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/60 mb-2">
              <Users className="w-3.5 h-3.5" />
              Role: Operations Admin (Tayyab)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Operational Command &amp; Field Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Process customer orders, forward job details to technicians via WhatsApp, and resolve customer complaints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddProduct}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Add Camera / Product
            </button>

            <button
              onClick={onOpenTechnicianModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              Manage Staff ({technicians.length})
            </button>

            <button
              onClick={onOpenQuoteGenerator}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/50 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Generate B2B Quote (PDF)
            </button>
          </div>
        </div>

        {/* Operational Tabs */}
        <div className="flex items-center gap-3 mt-6 border-b border-slate-800/80 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ORDERS'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Order &amp; Job Pipeline ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'INVENTORY'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>Stock Inventory ({products.length})</span>
            {lowStockProducts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px]">
                {lowStockProducts.length} Alert
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('TECHNICIANS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'TECHNICIANS'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>Staff Directory ({technicians.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('COMPLAINTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'COMPLAINTS'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Customer Complaints ({pendingComplaints.length} Active)</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & SITE SURVEYS */}
        {activeTab === 'ORDERS' && (
          <div className="mt-6 space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by Order ID or Client Name..."
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'Pending', 'Survey_Scheduled', 'Installed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      orderFilter === st
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
                    <tr>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Client Details</th>
                      <th className="py-3 px-4">Site &amp; City</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4 text-right">Gross Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Assigned Tech</th>
                      <th className="py-3 px-4 text-right">Technician WhatsApp &amp; Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredOrders.map((ord) => {
                      const assignedTechObj =
                        technicians.find((t) => t.name === ord.assignedTechnician?.name) || technicians[0];

                      return (
                        <tr key={ord._id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-cyan-400">{ord.orderNumber}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{ord.customer.fullName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{ord.customer.phoneNumber}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-200">{ord.customer.city}</div>
                            <div className="text-[11px] text-slate-500">{ord.customer.siteType}</div>
                          </td>
                          <td className="py-3 px-4">
                            {ord.items.length > 0 ? (
                              <div className="space-y-0.5">
                                <span className="font-semibold text-white">
                                  {ord.items.reduce((s, i) => s + i.quantity, 0)} Total Units
                                </span>
                                <p className="text-[10px] text-slate-400 truncate max-w-xs">
                                  {ord.items.map((i) => `${i.title} (${i.quantity})`).join(', ')}
                                </p>
                              </div>
                            ) : (
                              <span className="font-mono text-cyan-400">Site Survey Assessment</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-white">
                            PKR {ord.grossTotal.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                ord.status === 'Installed'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                                  : ord.status === 'Survey_Scheduled'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-700'
                                  : 'bg-amber-950 text-amber-400 border border-amber-700'
                              }`}
                            >
                              {ord.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {ord.assignedTechnician ? (
                              <div className="text-[11px]">
                                <span className="font-semibold text-white">{ord.assignedTechnician.name}</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Direct Send to Technician WhatsApp */}
                              <button
                                onClick={() => {
                                  if (assignedTechObj) {
                                    onSendJobToTechnicianWhatsApp(ord, assignedTechObj);
                                  } else {
                                    setSelectedOrderForDispatch(ord);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/80 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                title="Send Complete Job Scope & Client Location to Tech on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Send to Tech WA</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedOrderForDispatch(ord);
                                  const matching = technicians.find(
                                    (t) => t.name === ord.assignedTechnician?.name
                                  );
                                  if (matching) setSelectedTechId(matching.id);
                                }}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Wrench className="w-3 h-3" />
                                Dispatch
                              </button>

                              {ord.status !== 'Installed' && (
                                <button
                                  onClick={() =>
                                    onUpdateOrder(ord._id, {
                                      status: 'Installed',
                                      paymentStatus: 'Verified',
                                    })
                                  }
                                  className="px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/60 text-[11px] font-semibold cursor-pointer"
                                  title="Mark as Completed"
                                >
                                  Done
                                </button>
                              )}
                            </div>
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

        {/* TAB 2: INVENTORY */}
        {activeTab === 'INVENTORY' && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 mr-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-mono">Catalog Items</span>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">{products.length} Items</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-mono">Low Stock Alerts</span>
                  <div className="text-xl font-bold font-mono text-red-400 mt-0.5">{lowStockProducts.length} Items</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-mono">Total Physical Stock</span>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                    {products.reduce((acc, p) => acc + p.stockQuantity, 0)} Units
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenAddProduct}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Camera
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4">Hardware Title / SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Selling Price (PKR)</th>
                    <th className="py-3 px-4 text-center">On-Hand Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Atomic Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {products.map((prod) => {
                    const isLow = prod.stockQuantity <= prod.lowStockThreshold;

                    return (
                      <tr key={prod._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{prod.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono">SKU: {prod.sku}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{prod.category.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4 font-mono text-white">
                          PKR {(prod.discountedPrice || prod.sellingPrice).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-sm">
                          <span
                            className={
                              prod.stockQuantity === 0
                                ? 'text-red-500'
                                : isLow
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }
                          >
                            {prod.stockQuantity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">
                              Restock Required
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedProductForStock(prod)}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FIELD TECHNICIANS DIRECTORY */}
        {activeTab === 'TECHNICIANS' && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Field Engineers &amp; Installation Crews</h3>
                <p className="text-xs text-slate-400">
                  Enlist certified technicians with WhatsApp numbers, address, and sites completed.
                </p>
              </div>

              <button
                onClick={onOpenTechnicianModal}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Enroll New Technician
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicians.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                        {t.specialization.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          t.status === 'AVAILABLE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : t.status === 'ON_JOB'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{t.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 font-mono mt-1">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      {t.phone} (WA: {t.whatsappNumber})
                    </p>

                    <div className="mt-3 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Experience</span>
                        <span className="text-white font-bold">{t.experienceYears} Yrs</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Sites Done</span>
                        <span className="text-emerald-400 font-bold">{t.totalJobsCompleted} Sites</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Rating</span>
                        <span className="text-amber-400 font-bold">★ {t.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Status:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateTechStatus(t.id, 'AVAILABLE')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                          t.status === 'AVAILABLE'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        Available
                      </button>
                      <button
                        onClick={() => onUpdateTechStatus(t.id, 'ON_JOB')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                          t.status === 'ON_JOB'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        On Site
                      </button>
                      {onRemoveTechnician && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove technician ${t.name}?`)) {
                              onRemoveTechnician(t.id);
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
        )}

        {/* TAB 4: CUSTOMER COMPLAINTS & WARRANTY TICKETS */}
        {activeTab === 'COMPLAINTS' && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-red-400" />
                  Client Support Complaints &amp; Warranty Tickets
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time tickets logged by customers through the Customer Care navbar button.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
                    <tr>
                      <th className="py-3 px-4">Ticket Ref</th>
                      <th className="py-3 px-4">Client Contact</th>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Issue Description</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-400">{c.ticketNumber}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{c.customerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{c.customerPhone}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {c.orderNumber || <span className="text-slate-600">N/A</span>}
                        </td>
                        <td className="py-3 px-4 max-w-sm">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 block w-fit mb-1">
                            {c.issueType.replace(/_/g, ' ')}
                          </span>
                          <p className="text-slate-300 line-clamp-2">{c.description}</p>
                          {c.resolutionNotes && (
                            <p className="text-emerald-400 text-[11px] mt-1 font-mono italic">
                              Resolved: {c.resolutionNotes}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              c.priority === 'CRITICAL'
                                ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                                : c.priority === 'HIGH'
                                ? 'bg-orange-950 text-orange-400 border border-orange-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                              c.status === 'RESOLVED'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                                : 'bg-red-950 text-red-400 border border-red-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {c.status !== 'RESOLVED' ? (
                            <button
                              onClick={() => setResolvingTicketId(c.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Resolve Ticket
                            </button>
                          ) : (
                            <span className="text-emerald-400 text-xs flex items-center justify-end gap-1 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Closed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RESOLVE COMPLAINT TICKET */}
        {resolvingTicketId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
              <button
                onClick={() => setResolvingTicketId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-base font-bold mb-1">Resolve Support Complaint</h3>
              <p className="text-xs text-slate-400 mb-4">Enter engineering resolution notes for customer record.</p>

              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="e.g. Technician Irfan visited site, replaced RJ45 connector, and tested ColorVu feed."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResolvingTicketId(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolveSubmit(resolvingTicketId)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Confirm Resolution
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ATOMIC STOCK ADJUSTMENT */}
        {selectedProductForStock && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
              <button
                onClick={() => setSelectedProductForStock(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-base font-bold mb-1">Atomic Inventory Adjustment</h3>
              <p className="text-xs text-slate-400 font-mono mb-4">
                Target: {selectedProductForStock.title} (Current: {selectedProductForStock.stockQuantity})
              </p>

              <form onSubmit={handleStockSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Adjustment Delta (+/- Count) *
                  </label>
                  <input
                    type="number"
                    required
                    value={stockDelta}
                    onChange={(e) => setStockDelta(parseInt(e.target.value, 10) || 0)}
                    placeholder="+5 or -2"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Use positive numbers for restock additions, negative for write-offs.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mandatory Audit Reason (CEO Visible) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    placeholder="e.g. Received shipment from Hikvision distributor / Client sample damage..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProductForStock(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                  >
                    Commit Stock &amp; Audit Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DISPATCH TECHNICIAN WITH DIRECT WHATSAPP */}
        {selectedOrderForDispatch && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
              <button
                onClick={() => setSelectedOrderForDispatch(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-base font-bold mb-1">Dispatch Field Technician</h3>
              <p className="text-xs text-slate-400 font-mono mb-4">
                Job #{selectedOrderForDispatch.orderNumber} - {selectedOrderForDispatch.customer.fullName} ({selectedOrderForDispatch.customer.city})
              </p>

              <form onSubmit={(e) => handleDispatchSubmit(e, false)} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Certified Technician *
                  </label>
                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.specialization.replace(/_/g, ' ')}) - WA: {t.whatsappNumber} ({t.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Appointment Time *</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Installation Tooling Notes</label>
                  <input
                    type="text"
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder="Tools, ladders, cable length..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                  {/* Send to Technician WhatsApp Action */}
                  <button
                    type="button"
                    onClick={(e) => handleDispatchSubmit(e as any, true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Dispatch &amp; Forward Job Scope to Tech on WhatsApp
                  </button>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForDispatch(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                    >
                      Save Internal Dispatch
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
