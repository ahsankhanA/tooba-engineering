'use client';

import React, { useState } from 'react';
import {
  Video,
  HardDrive,
  Cpu,
  Layers,
  Search,
  ShoppingCart,
  Check,
  AlertTriangle,
  MessageSquare,
  Shield,
  Eye,
} from 'lucide-react';
import { ProductItem } from '@/lib/initial-data';

interface ProductCatalogProps {
  products: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onOpenSurvey: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  onOpenSurvey,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Equipment' },
    { id: 'COMPLETE_PACKAGE', label: 'Turnkey Packages' },
    { id: 'CCTV_CAMERA', label: 'CCTV Cameras' },
    { id: 'DVR_NVR', label: 'DVR / NVR Recorders' },
    { id: 'BIOMETRIC_ATTENDANCE', label: 'Biometrics & Access' },
    { id: 'NETWORKING_CABLE', label: 'Networking & Cabling' },
  ];

  const brands = ['ALL', 'Hikvision', 'Dahua', 'ZKTeco', 'Schneider Electric'];

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesBrand = selectedBrand === 'ALL' || prod.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  const handleAdd = (product: ProductItem) => {
    onAddToCart(product);
    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const handleWhatsAppProduct = (product: ProductItem) => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum, I am inquiring about "${product.title}" (SKU: ${product.sku}) listed at PKR ${
        product.discountedPrice || product.sellingPrice
      }. Is this available for immediate dispatch?`
    );
    window.open(`https://wa.me/923001234567?text=${text}`, '_blank');
  };

  return (
    <section id="catalog-section" className="py-16 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5" />
            Verified Surveillance Equipment
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Surveillance Systems &amp; Hardware Catalog
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Procure genuine 4K CCTV systems, intelligent AcuSense DVRs, pure copper networking spools, and biometric access controllers.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Camera Model, DVR, Resolution, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Brand Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-slate-400 whitespace-nowrap font-medium">Brand:</span>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedBrand === b
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto mt-4 pt-4 border-t border-slate-800/80 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-8">
            <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products match your criteria</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const activePrice = prod.discountedPrice || prod.sellingPrice;
              const hasDiscount = Boolean(prod.discountedPrice && prod.discountedPrice < prod.sellingPrice);
              const isLowStock = prod.stockQuantity > 0 && prod.stockQuantity <= prod.lowStockThreshold;
              const isOutOfStock = prod.stockQuantity === 0;

              return (
                <div
                  key={prod._id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-200 overflow-hidden flex flex-col group shadow-lg"
                >
                  {/* Image & Badge Container */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden border-b border-slate-800/80">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />

                    {/* Category & Brand Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-slate-700 font-mono">
                        {prod.brand}
                      </span>
                      {prod.isFeatured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-extrabold uppercase">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Stock Alert Badge */}
                    <div className="absolute top-3 right-3">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-md bg-red-950/90 border border-red-700 text-red-300 text-[10px] font-bold">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-950/90 border border-amber-700 text-amber-300 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Only {prod.stockQuantity} Left
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-[10px] font-bold">
                          In Stock ({prod.stockQuantity})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                        <span>SKU: {prod.sku}</span>
                        <span>{prod.warrantyMonths}M Warranty</span>
                      </div>

                      <h3 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {prod.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {prod.description}
                      </p>

                      {/* Specifications Summary */}
                      <div className="mt-3 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 text-[11px] text-slate-300">
                        {prod.specifications.resolution && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Resolution:</span>
                            <span className="font-medium text-slate-200">
                              {prod.specifications.resolution}
                            </span>
                          </div>
                        )}
                        {prod.specifications.channels && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Channels:</span>
                            <span className="font-medium text-slate-200">
                              {prod.specifications.channels} Channel Input
                            </span>
                          </div>
                        )}
                        {prod.specifications.storageCapacity && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Storage:</span>
                            <span className="font-medium text-slate-200">
                              {prod.specifications.storageCapacity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-xs text-slate-400">Total Price (COD):</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg sm:text-xl font-extrabold text-white font-mono">
                              PKR {activePrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-slate-500 line-through">
                                PKR {prod.sellingPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveModalProduct(prod)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="View Specifications"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAdd(prod)}
                          disabled={isOutOfStock}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isOutOfStock
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : addedProductId === prod._id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40'
                          }`}
                        >
                          {addedProductId === prod._id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Add to Cart
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleWhatsAppProduct(prod)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          Inquire
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom B2B Quote Callout Banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 border border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Need a Multi-Channel CCTV Quote for Factory or Campus?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Tooba Engineering prepares verified Bill of Quantities (BOQ), tender specs, and conduit cabling layouts for commercial B2B projects.
            </p>
          </div>
          <button
            onClick={onOpenSurvey}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/60 whitespace-nowrap cursor-pointer"
          >
            Request Official B2B Survey
          </button>
        </div>
      </div>

      {/* Product Spec Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase">{activeModalProduct.brand}</span>
                <h3 className="text-lg font-bold text-white mt-1">{activeModalProduct.title}</h3>
                <span className="text-xs text-slate-500 font-mono">SKU: {activeModalProduct.sku}</span>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <img
              src={activeModalProduct.imageUrl}
              alt={activeModalProduct.title}
              className="w-full h-52 object-cover rounded-xl border border-slate-800"
            />

            <p className="text-xs text-slate-300 leading-relaxed">{activeModalProduct.description}</p>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <h4 className="font-bold text-slate-200">Hardware Specifications:</h4>
              <ul className="space-y-1 text-slate-400">
                {activeModalProduct.specifications.resolution && (
                  <li>• Sensor Resolution: {activeModalProduct.specifications.resolution}</li>
                )}
                {activeModalProduct.specifications.channels && (
                  <li>• Video Channels: {activeModalProduct.specifications.channels} Channel Supported</li>
                )}
                {activeModalProduct.specifications.storageCapacity && (
                  <li>• Storage Capacity: {activeModalProduct.specifications.storageCapacity}</li>
                )}
                {activeModalProduct.specifications.cableLengthMeters && (
                  <li>• Cable Included: {activeModalProduct.specifications.cableLengthMeters} Meters</li>
                )}
                <li>• Warranty: {activeModalProduct.warrantyMonths} Months Official Hardware Replacement</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Price:</span>
                <div className="text-xl font-bold font-mono text-white">
                  PKR {(activeModalProduct.discountedPrice || activeModalProduct.sellingPrice).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleAdd(activeModalProduct);
                    setActiveModalProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
