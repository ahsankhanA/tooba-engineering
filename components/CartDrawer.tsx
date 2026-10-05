'use client';

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { CartItem, OrderItem } from '@/lib/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  businessWhatsApp?: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProcessCheckout: (data: {
    customer: OrderItem['customer'];
    paymentMethod: OrderItem['paymentMethod'];
    customerNotes?: string;
  }) => Promise<OrderItem>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  businessWhatsApp = '923001234567',
  onUpdateQuantity,
  onRemoveItem,
  onProcessCheckout,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [siteType, setSiteType] = useState<OrderItem['customer']['siteType']>('Commercial');
  const [paymentMethod, setPaymentMethod] = useState<OrderItem['paymentMethod']>('CASH_ON_DELIVERY');
  const [customerNotes, setCustomerNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderItem | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.discountedPrice || item.product.sellingPrice;
    return acc + price * item.quantity;
  }, 0);

  const shippingFee = subtotal > 50000 || subtotal === 0 ? 0 : 500;
  const grandTotal = subtotal + shippingFee;

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phoneNumber.trim() || !address.trim()) {
      setErrorMessage('Please fill in your Full Name, Mobile Phone, and Installation Address.');
      return;
    }

    // Phone validation for Pakistani mobile networks
    const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
    if (!/^((\+92)|(0092)|(92)|(0))?3\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid Pakistani mobile number (e.g. 03001234567).');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await onProcessCheckout({
        customer: {
          fullName: fullName.trim(),
          phoneNumber: cleanPhone,
          email: email.trim() || undefined,
          address: address.trim(),
          city,
          siteType,
        },
        paymentMethod,
        customerNotes,
      });

      setConfirmedOrder(order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout encountered an error.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!fullName || !phoneNumber || !address) {
      setErrorMessage('Please fill your contact details before launching WhatsApp order.');
      return;
    }

    const itemsSummary = cart
      .map(
        (i) =>
          `• ${i.product.title} (Qty: ${i.quantity}) - PKR ${(
            (i.product.discountedPrice || i.product.sellingPrice) * i.quantity
          ).toLocaleString()}`
      )
      .join('\n');

    const message = `*TOOBA ENGINEERING - NEW ORDER REQUEST*\n\n*Customer:* ${fullName}\n*Phone:* ${phoneNumber}\n*Address:* ${address}, ${city} (${siteType})\n*Payment:* ${paymentMethod.replace(
      /_/g,
      ' '
    )}\n\n*Equipment Ordered:*\n${itemsSummary}\n\n*Gross Total:* PKR ${grandTotal.toLocaleString()}\n\n*Notes:* ${
      customerNotes || 'Standard Dispatch & Installation Verification'
    }`;

    window.open(`https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-base">Your Equipment Cart &amp; Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {confirmedOrder ? (
            /* Order Confirmation View */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Order Placed Successfully!</h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm space-y-1">
                <p className="text-slate-400 text-xs">Tracking Order Reference:</p>
                <p className="text-cyan-400 font-bold text-base">{confirmedOrder.orderNumber}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Total Payable: PKR {confirmedOrder.grossTotal.toLocaleString()} ({confirmedOrder.paymentMethod.replace(/_/g, ' ')})
                </p>
              </div>

              <div className="text-xs text-slate-300 space-y-2 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <p className="font-semibold text-emerald-400">• Verification Call Scheduled:</p>
                <p className="text-slate-400">
                  Operations Lead Tayyab will contact you at <span className="text-white font-mono">{confirmedOrder.customer.phoneNumber}</span> to verify installation date and site specifics.
                </p>
                <p className="font-semibold text-cyan-400 pt-2">• 1-Year On-Site Hardware Warranty:</p>
                <p className="text-slate-400">
                  Physical warranty cards and genuine OEM serial numbers will be handed over upon installation.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      `Assalam-o-Alaikum, I just submitted Order #${confirmedOrder.orderNumber} for PKR ${confirmedOrder.grossTotal.toLocaleString()}. Please confirm dispatch.`
                    );
                    window.open(`https://wa.me/${businessWhatsApp}?text=${text}`, '_blank');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Confirm with Operations on WhatsApp
                </button>
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    onClose();
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Close &amp; Return to Catalog
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-16 space-y-3">
              <Truck className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">Your equipment cart is currently empty.</p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                Browse CCTV Products
              </button>
            </div>
          ) : (
            /* Cart Items & Checkout Form */
            <>
              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Hardware</h4>
                {cart.map((item) => {
                  const unitPrice = item.product.discountedPrice || item.product.sellingPrice;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.product._id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="w-14 h-14 object-cover rounded-lg border border-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">{item.product.title}</h5>
                        <p className="text-[11px] text-slate-400 font-mono">
                          PKR {unitPrice.toLocaleString()} each
                        </p>
                        <div className="text-xs font-extrabold text-cyan-400 font-mono mt-0.5">
                          PKR {itemTotal.toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 hover:text-white text-slate-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity}
                          className="p-1 hover:text-white text-slate-400 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product._id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Equipment Subtotal:</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery &amp; Transit Insurance:</span>
                  <span>{shippingFee === 0 ? 'FREE (Orders > 50k)' : `PKR ${shippingFee}`}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Gross Total (COD):</span>
                  <span className="text-cyan-400">PKR {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmitCheckout} className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dispatch &amp; Installation Details
                </h4>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-950/80 border border-red-700/80 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood / Apex Textiles"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Mobile Phone (03XX) *
                    </label>
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
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@domain.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Site / Installation Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Complete Street, Sector, Phase, Plaza or Factory address..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
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
                      <option value="Karachi">Karachi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Premises Type</label>
                    <select
                      value={siteType}
                      onChange={(e) => setSiteType(e.target.value as OrderItem['customer']['siteType'])}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial / Retail</option>
                      <option value="Corporate_B2B">Corporate B2B Office</option>
                      <option value="Industrial">Industrial / Factory</option>
                      <option value="Government_Education">School / University</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 ${
                        paymentMethod === 'CASH_ON_DELIVERY'
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'CASH_ON_DELIVERY'}
                        onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                        className="hidden"
                      />
                      <span>Cash on Delivery (COD)</span>
                    </label>

                    <label
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 ${
                        paymentMethod === 'MANUAL_BANK_TRANSFER'
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'MANUAL_BANK_TRANSFER'}
                        onChange={() => setPaymentMethod('MANUAL_BANK_TRANSFER')}
                        className="hidden"
                      />
                      <span>Bank Transfer (IBFT)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Special Installation Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Need high ladder for warehouse ceiling..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-3 space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/60 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying Stock & Placing Order...' : 'Confirm Order (COD)'}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-800/60 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Place via WhatsApp Deep Link
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
