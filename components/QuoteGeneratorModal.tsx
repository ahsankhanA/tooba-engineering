'use client';

import React, { useState } from 'react';
import { X, FileText, Download, Plus, Trash2, Printer, ShieldCheck } from 'lucide-react';
import { ProductItem } from '@/lib/initial-data';

interface QuoteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
}

export const QuoteGeneratorModal: React.FC<QuoteGeneratorModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const [clientName, setClientName] = useState('Engr. Mian Salman');
  const [companyName, setCompanyName] = useState('Apex Textiles Mills Ltd.');
  const [clientPhone, setClientPhone] = useState('03224419988');
  const [clientEmail, setClientEmail] = useState('salman@apextextiles.com.pk');
  const [siteAddress, setSiteAddress] = useState('Plot 42-B, Industrial Estate Sundar');
  const [city, setCity] = useState('Lahore');
  const [laborCharges, setLaborCharges] = useState<number>(35000);
  const [customDiscount, setCustomDiscount] = useState<number>(5000);
  const [notes, setNotes] = useState('Includes 1-Year Comprehensive On-Site Hardware Replacement Warranty.');

  const [equipmentList, setEquipmentList] = useState<
    Array<{
      description: string;
      brand: string;
      quantity: number;
      unitRate: number;
    }>
  >([
    {
      description: '8-Camera Enterprise 4K Ultra HD AI Security Setup',
      brand: 'Dahua',
      quantity: 2,
      unitRate: 118000,
    },
    {
      description: 'Schneider Electric Cat6 Pure Copper 305m Network Roll',
      brand: 'Schneider Electric',
      quantity: 3,
      unitRate: 29500,
    },
    {
      description: '4-Channel AcuSense 5MP DVR with 2TB Surveillance HDD',
      brand: 'Hikvision',
      quantity: 1,
      unitRate: 34000,
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setEquipmentList([
      ...equipmentList,
      {
        description: 'Hikvision 5MP ColorVu Outdoor Bullet Camera',
        brand: 'Hikvision',
        quantity: 4,
        unitRate: 6800,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: string | number) => {
    const updated = [...equipmentList];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setEquipmentList(updated);
  };

  const equipmentTotal = equipmentList.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitRate) || 0),
    0
  );

  const grandTotal = Math.max(0, equipmentTotal + Number(laborCharges || 0) - Number(customDiscount || 0));

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/quotes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          companyName,
          clientPhone,
          clientEmail,
          siteAddress,
          city,
          equipmentList,
          laborCharges,
          customDiscount,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF quotation.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tooba-Quotation-${Date.now().toString().slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error generating quotation PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Commercial B2B Quotation Generator</h3>
            <p className="text-xs text-slate-400">Generates instant PDF with Tooba Engineering OEM warranties and signatures.</p>
          </div>
        </div>

        {/* Client & Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Attention / Client Name *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Company / Organization</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Contact Phone *</label>
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Site / Premises Address *</label>
            <input
              type="text"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            />
          </div>
        </div>

        {/* Equipment Rows */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Surveillance Equipment &amp; Bill of Quantities (BOQ)
            </h4>
            <button
              onClick={handleAddItem}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Equipment Line
            </button>
          </div>

          <div className="space-y-2">
            {equipmentList.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 items-center text-xs"
              >
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Item Description"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Brand/Model"
                    value={item.brand}
                    onChange={(e) => handleUpdateItem(idx, 'brand', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white font-mono text-center"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Rate PKR"
                    value={item.unitRate}
                    onChange={(e) => handleUpdateItem(idx, 'unitRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white font-mono text-right"
                  />
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs mb-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Labor, Conduit Piping &amp; Cabling Charges (PKR)
              </label>
              <input
                type="number"
                value={laborCharges}
                onChange={(e) => setLaborCharges(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Special Corporate Discount (PKR)
              </label>
              <input
                type="number"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 font-mono flex flex-col justify-end">
            <div className="flex justify-between text-slate-400">
              <span>Hardware Subtotal:</span>
              <span>PKR {equipmentTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Labor &amp; Termination:</span>
              <span>PKR {Number(laborCharges).toLocaleString()}</span>
            </div>
            {Number(customDiscount) > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount Applied:</span>
                <span>- PKR {Number(customDiscount).toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
              <span>Net Quotation Total:</span>
              <span className="text-cyan-400">PKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/60 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Rendering Vector PDF...' : 'Download Official PDF Quotation'}
          </button>
        </div>
      </div>
    </div>
  );
};
