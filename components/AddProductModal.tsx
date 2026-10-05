'use client';

import React, { useState } from 'react';
import { X, Plus, Video, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { ProductItem } from '@/lib/initial-data';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: Omit<ProductItem, '_id'>) => ProductItem;
  actorRole: 'CEO' | 'ADMIN';
}

const PRESET_HARDWARE_IMAGES = [
  {
    label: '4K ColorVu Bullet',
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80',
  },
  {
    label: 'Dome / Eyeball Camera',
    url: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?w=600&q=80',
  },
  {
    label: 'NVR / DVR System',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
  },
  {
    label: 'Biometric Scanner',
    url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80',
  },
  {
    label: 'Networking Cable Spool',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
  },
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  actorRole,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductItem['category']>('CCTV_CAMERA');
  const [brand, setBrand] = useState('Hikvision');
  const [sellingPrice, setSellingPrice] = useState<number>(8500);
  const [costPrice, setCostPrice] = useState<number>(6200);
  const [discountedPrice, setDiscountedPrice] = useState<number>(7900);
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [sku, setSku] = useState('HIK-8MP-COLORVU');
  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);
  const [imageUrl, setImageUrl] = useState(PRESET_HARDWARE_IMAGES[0].url);
  const [description, setDescription] = useState(
    'Professional enterprise surveillance camera with full-color night vision, audio recording mic, and weather-proof metal housing.'
  );

  // Specs
  const [resolution, setResolution] = useState('8MP 4K Ultra HD (3840x2160)');
  const [channels, setChannels] = useState<number | undefined>(undefined);
  const [storageCapacity, setStorageCapacity] = useState('');
  const [cableLength, setCableLength] = useState<number | undefined>(undefined);
  const [indoorOutdoor, setIndoorOutdoor] = useState<'BOTH' | 'INDOOR' | 'OUTDOOR'>('OUTDOOR');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sku || !sellingPrice) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    onAddProduct({
      title: title.trim(),
      slug,
      category,
      brand,
      description: description.trim(),
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      stockQuantity: Number(stockQuantity) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      sku: sku.trim().toUpperCase(),
      isFeatured: false,
      warrantyMonths: Number(warrantyMonths) || 12,
      imageUrl,
      specifications: {
        resolution: resolution || undefined,
        channels: channels ? Number(channels) : undefined,
        storageCapacity: storageCapacity || undefined,
        cableLengthMeters: cableLength ? Number(cableLength) : undefined,
        indoorOutdoor,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Add New CCTV Camera / Hardware</h3>
            <p className="text-xs text-slate-400">
              Authorized for {actorRole === 'CEO' ? 'CEO (Ashraf Sahib)' : 'Operations Lead (Tayyab)'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hardware Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hikvision 8MP 4K ColorVu AcuSense Bullet Camera"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductItem['category'])}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="CCTV_CAMERA">CCTV Camera (IP / HD)</option>
                <option value="COMPLETE_PACKAGE">Complete Turnkey Package</option>
                <option value="DVR_NVR">DVR / NVR Recorder</option>
                <option value="BIOMETRIC_ATTENDANCE">Biometric / Access Control</option>
                <option value="STORAGE_HDD">Surveillance Storage HDD</option>
                <option value="NETWORKING_CABLE">Cat6 / Fiber Networking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Hikvision / Dahua / ZKTeco"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU / Model *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="HIK-DS2CD2387"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selling Price (PKR) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Wholesale Cost Price (PKR) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-amber-300 font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">Internal margin calculation only</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Discounted Price (PKR)
              </label>
              <input
                type="number"
                min="0"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Stock Qty *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value, 10) || 5)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Warranty (Months)
              </label>
              <input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(parseInt(e.target.value, 10) || 12)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Camera / Hardware Image *
              </label>
              <span className="text-[11px] text-cyan-400 font-medium">Direct Upload or Web URL</span>
            </div>

            {/* Direct File Upload & URL Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="relative">
                <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded-lg text-xs text-slate-200 cursor-pointer transition-colors">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Choose Image File from Computer</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setImageUrl(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or enter image URL (https://...)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Image Preview & Presets */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
              <div className="w-16 h-14 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  Quick High-Res Presets:
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {PRESET_HARDWARE_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2 py-0.5 rounded text-[10px] whitespace-nowrap cursor-pointer ${
                        imageUrl === preset.url
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Resolution / Tech Spec
              </label>
              <input
                type="text"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="e.g. 5MP ColorVu / 4K UHD"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Environment
              </label>
              <select
                value={indoorOutdoor}
                onChange={(e) => setIndoorOutdoor(e.target.value as 'BOTH' | 'INDOOR' | 'OUTDOOR')}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                <option value="OUTDOOR">Outdoor Weatherproof (IP67)</option>
                <option value="INDOOR">Indoor Ceiling / Dome</option>
                <option value="BOTH">Universal (Indoor &amp; Outdoor)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical specs, nighttime range, audio mic features..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/50"
            >
              Add Product to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
