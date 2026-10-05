'use client';

import React, { useState } from 'react';
import { usePortalStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TrustSection } from '@/components/TrustSection';
import { ProductCatalog } from '@/components/ProductCatalog';
import { TechniciansSection } from '@/components/TechniciansSection';
import { CartDrawer } from '@/components/CartDrawer';
import { SurveyModal } from '@/components/SurveyModal';
import { TrackOrderModal } from '@/components/TrackOrderModal';
import { QuoteGeneratorModal } from '@/components/QuoteGeneratorModal';
import { AdminPanel } from '@/components/AdminPanel';
import { CeoPanel } from '@/components/CeoPanel';
import { LoginModal } from '@/components/LoginModal';
import { AddProductModal } from '@/components/AddProductModal';
import { TechnicianModal } from '@/components/TechnicianModal';
import { ComplaintModal } from '@/components/ComplaintModal';
import {
  Shield,
  Phone,
  MessageSquare,
  Award,
  Wrench,
  Lock,
  Headphones,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const {
    isMounted,
    products,
    credentials,
    orders,
    auditLogs,
    technicians,
    complaints,
    businessWhatsApp,
    newComplaintAlert,
    cart,
    currentUser,
    setUser,
    addProduct,
    addTechnician,
    removeTechnician,
    updateTechnicianStatus,
    sendJobToTechnicianWhatsApp,
    submitComplaint,
    resolveComplaint,
    dismissComplaintAlert,
    updateBusinessWhatsApp,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    processCheckout,
    requestSiteSurvey,
    adjustProductStock,
    updateOrder,
    toggleCredentialStatus,
    addCredential,
  } = usePortalStore();

  const [activeView, setActiveView] = useState<'MARKETPLACE' | 'ADMIN' | 'CEO'>('MARKETPLACE');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  const handleRoleSelect = (role: 'CUSTOMER' | 'ADMIN' | 'CEO') => {
    if (role === 'CEO') {
      setUser({
        id: 'user-ceo-1',
        fullName: 'Ashraf Sahib (CEO)',
        email: 'ashraf@toobaengineering.com',
        role: 'CEO',
        phoneNumber: '03008451234',
      });
      setActiveView('CEO');
    } else if (role === 'ADMIN') {
      setUser({
        id: 'user-admin-1',
        fullName: 'Tayyab (Operations Lead)',
        email: 'tayyab@toobaengineering.com',
        role: 'ADMIN',
        phoneNumber: '03219876543',
      });
      setActiveView('ADMIN');
    } else {
      setUser(null);
      setActiveView('MARKETPLACE');
    }
  };

  const scrollToCatalog = () => {
    setActiveView('MARKETPLACE');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative">
      {/* Real-time Alert Popup for CEO & Admin when a Complaint is Filed */}
      {newComplaintAlert && (currentUser?.role === 'CEO' || currentUser?.role === 'ADMIN') && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full bg-red-950/95 border-2 border-red-500 rounded-2xl p-4 shadow-2xl text-white backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse shrink-0" />
              <span>ALERT: Customer Complaint Lodged</span>
            </div>
            <button
              onClick={dismissComplaintAlert}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 text-xs space-y-1 font-mono">
            <p className="text-white font-bold text-sm">
              Ticket: <span className="text-red-300 font-mono">{newComplaintAlert.ticketNumber}</span>{' '}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-sans">
                {newComplaintAlert.priority}
              </span>
            </p>
            <p className="text-slate-200">
              Customer: <span className="font-semibold text-white">{newComplaintAlert.customerName}</span> ({newComplaintAlert.customerPhone})
            </p>
            <p className="text-amber-300">
              Issue Category: {newComplaintAlert.issueType.replace(/_/g, ' ')}
            </p>
            <p className="text-slate-300 italic font-sans text-[11px] bg-slate-900/90 p-2.5 rounded-lg border border-red-900/60 mt-1 leading-relaxed">
              &quot;{newComplaintAlert.description}&quot;
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                if (currentUser.role === 'CEO') setActiveView('CEO');
                else setActiveView('ADMIN');
                dismissComplaintAlert();
              }}
              className="flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-md shadow-red-950"
            >
              Review Complaints Tab
            </button>
            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Assalam-o-Alaikum ${newComplaintAlert.customerName}, Tooba Engineering management has received your support ticket #${newComplaintAlert.ticketNumber}. Our team is attending to your issue immediately.`
                );
                window.open(
                  `https://wa.me/${newComplaintAlert.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`,
                  '_blank'
                );
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar with View Switcher */}
      <Navbar
        cart={cart}
        currentUser={currentUser}
        isMounted={isMounted}
        businessWhatsApp={businessWhatsApp}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenSurvey={() => setIsSurveyOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenComplaint={() => setIsComplaintOpen(true)}
        onSelectRole={handleRoleSelect}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'MARKETPLACE' && (
          <>
            <Hero
              onOpenSurvey={() => setIsSurveyOpen(true)}
              onExplorePackages={scrollToCatalog}
              businessWhatsApp={businessWhatsApp}
            />
            <TrustSection
              credentials={credentials}
              isCeo={currentUser?.role === 'CEO'}
              onOpenCeoPanel={() => setActiveView('CEO')}
            />
            <div id="catalog-section">
              <ProductCatalog
                products={products}
                onAddToCart={(p) => {
                  addToCart(p);
                  setIsCartOpen(true);
                }}
                onOpenSurvey={() => setIsSurveyOpen(true)}
              />
            </div>
            <div id="technicians-section">
              <TechniciansSection technicians={technicians} />
            </div>
          </>
        )}

        {activeView === 'ADMIN' && (
          <AdminPanel
            products={products}
            orders={orders}
            technicians={technicians}
            complaints={complaints}
            onAdjustStock={adjustProductStock}
            onUpdateOrder={updateOrder}
            onResolveComplaint={resolveComplaint}
            onSendJobToTechnicianWhatsApp={sendJobToTechnicianWhatsApp}
            onOpenQuoteGenerator={() => setIsQuoteOpen(true)}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            onOpenTechnicianModal={() => setIsTechModalOpen(true)}
            onUpdateTechStatus={updateTechnicianStatus}
            onRemoveTechnician={removeTechnician}
          />
        )}

        {activeView === 'CEO' && (
          <CeoPanel
            products={products}
            orders={orders}
            credentials={credentials}
            auditLogs={auditLogs}
            businessWhatsApp={businessWhatsApp}
            onUpdateWhatsApp={updateBusinessWhatsApp}
            complaints={complaints}
            onToggleCredential={toggleCredentialStatus}
            onAddCredential={addCredential}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm tracking-tight">
              <Shield className="w-5 h-5 text-cyan-400" />
              TOOBA ENGINEERING
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Established in 2007. Providing enterprise CCTV surveillance, data center cabling, biometric attendance, and security consulting across Pakistan.
            </p>
            <div className="text-[11px] font-mono text-cyan-400">
              PEC Registration: PEC-C6/ELECT-44912
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Enterprise Solutions</h4>
            <ul className="space-y-2 text-slate-400">
              <li>• 4K Ultra HD IP AcuSense Surveillance</li>
              <li>• Industrial Perimeter CCTV &amp; Night ColorVu</li>
              <li>• Facial Recognition Biometric Gate Turnstiles</li>
              <li>• Structured Cat6 &amp; Fiber Optic Backbone</li>
              <li>• Data Center Environmental Monitoring</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Customer &amp; Client Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setIsComplaintOpen(true)}
                  className="hover:text-red-400 text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Headphones className="w-3 h-3 text-red-400" />
                  • Customer Care &amp; Service Complaints
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackOpen(true)}
                  className="hover:text-cyan-400 text-left cursor-pointer"
                >
                  • Client Order &amp; Warranty Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsQuoteOpen(true)}
                  className="hover:text-cyan-400 text-left cursor-pointer"
                >
                  • Generate Commercial BOQ Quote (PDF)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSurveyOpen(true)}
                  className="hover:text-emerald-400 text-left cursor-pointer"
                >
                  • Book Free Physical Site Survey
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Lahore Headquarters</h4>
            <p className="text-slate-400">
              Main Commercial Market, Gulberg III &amp; Model Town, Lahore, Pakistan.
            </p>
            <p className="mt-2 text-slate-300 font-mono">
              Phone: +{businessWhatsApp}
            </p>
            <div className="mt-3">
              <a
                href={`https://wa.me/${businessWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold hover:bg-emerald-900 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat with Engineering Lead
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Tooba Engineering. All rights reserved. Zero-investment production architecture.
          </div>
          <div className="flex gap-4">
            <span>Cash on Delivery (COD)</span>
            <span>•</span>
            <span>Bank Transfer (IBFT)</span>
            <span>•</span>
            <span>1-Year Hardware Warranty</span>
          </div>
        </div>
      </footer>

      {/* Floating Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        businessWhatsApp={businessWhatsApp}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onProcessCheckout={processCheckout}
      />

      {/* Site Survey Modal */}
      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        onRequestSurvey={requestSiteSurvey}
      />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        orders={orders}
      />

      {/* Quote Generator Modal */}
      <QuoteGeneratorModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        products={products}
      />

      {/* Login & Role Switching Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(u) => {
          setUser(u);
          if (u.role === 'CEO') setActiveView('CEO');
          else if (u.role === 'ADMIN') setActiveView('ADMIN');
        }}
        onLogout={() => {
          setUser(null);
          setActiveView('MARKETPLACE');
        }}
      />

      {/* Add New Camera / Product Modal (Authorized for CEO & Tayyab) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={addProduct}
        actorRole={currentUser?.role === 'CEO' ? 'CEO' : 'ADMIN'}
      />

      {/* Technician Management Modal */}
      <TechnicianModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
        technicians={technicians}
        onAddTechnician={addTechnician}
        onUpdateStatus={updateTechnicianStatus}
        onRemoveTechnician={removeTechnician}
      />

      {/* Customer Care / Complaint Service Modal */}
      <ComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
        onSubmitComplaint={submitComplaint}
        businessWhatsApp={businessWhatsApp}
      />
    </div>
  );
}
