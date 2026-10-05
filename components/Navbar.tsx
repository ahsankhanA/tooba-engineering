'use client';

import React from 'react';
import {
  Shield,
  Phone,
  MessageSquare,
  ShoppingCart,
  Search,
  Lock,
  UserCheck,
  Building,
  Award,
  Headphones,
  Wrench,
  LogOut,
} from 'lucide-react';
import { CartItem, AuthUser } from '@/lib/store';

interface NavbarProps {
  cart: CartItem[];
  currentUser: AuthUser | null;
  isMounted?: boolean;
  businessWhatsApp?: string;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenSurvey: () => void;
  onOpenTrack: () => void;
  onOpenComplaint: () => void;
  onSelectRole: (role: 'CUSTOMER' | 'ADMIN' | 'CEO') => void;
  activeView: 'MARKETPLACE' | 'ADMIN' | 'CEO';
  setActiveView: (view: 'MARKETPLACE' | 'ADMIN' | 'CEO') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  currentUser,
  isMounted = false,
  businessWhatsApp = '923001234567',
  onOpenCart,
  onOpenLogin,
  onOpenSurvey,
  onOpenTrack,
  onOpenComplaint,
  onSelectRole,
  activeView,
  setActiveView,
}) => {
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      'Assalam-o-Alaikum Tooba Engineering team, I require consultation for enterprise CCTV installation & IT networking for my premises.'
    );
    window.open(`https://wa.me/${businessWhatsApp}?text=${text}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    setActiveView('MARKETPLACE');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Security & Hotline Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PEC Registered Electrical &amp; Security Contractor
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              17+ Years of Surveillance Excellence (Est. 2007)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenTrack}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Track Order / Warranty
            </button>
            <span className="text-slate-600">|</span>
            <a
              href={`tel:+${businessWhatsApp}`}
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors text-slate-200 font-mono"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              +{businessWhatsApp}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('MARKETPLACE')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-400">
                TOOBA ENGINEERING
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Enterprise CCTV &amp; IT Security Solutions
            </p>
          </div>
        </div>

        {/* Navigation Tabs - STRICTLY ROLE-RESTRICTED */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
          {/* Public links when NOT logged in */}
          {(!currentUser || currentUser.role === 'CUSTOMER') && (
            <>
              <button
                onClick={() => setActiveView('MARKETPLACE')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeView === 'MARKETPLACE'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CCTV Catalog
              </button>
              <button
                onClick={() => scrollToSection('technicians-section')}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                Verified Technicians
              </button>
              <button
                onClick={onOpenComplaint}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-red-400 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Headphones className="w-3.5 h-3.5 text-red-400" />
                Customer Care &amp; Support
              </button>
            </>
          )}

          {/* Authenticated CEO Tabs */}
          {currentUser?.role === 'CEO' && (
            <>
              <button
                onClick={() => setActiveView('CEO')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'CEO'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                CEO Executive Governance (Ashraf Sahib)
              </button>
              <button
                onClick={() => setActiveView('MARKETPLACE')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeView === 'MARKETPLACE'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Marketplace View
              </button>
            </>
          )}

          {/* Authenticated Admin Tabs */}
          {currentUser?.role === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveView('ADMIN')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'ADMIN'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Operations Command (Tayyab)
              </button>
              <button
                onClick={() => setActiveView('MARKETPLACE')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeView === 'MARKETPLACE'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Marketplace View
              </button>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Free Site Survey CTA */}
          <button
            onClick={onOpenSurvey}
            className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-cyan-900/30 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            Book Survey
          </button>

          {/* WhatsApp Direct Link (Dynamic from Settings) */}
          <button
            onClick={handleWhatsAppContact}
            className="inline-flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all cursor-pointer"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Management / Staff Login Button */}
          <button
            onClick={onOpenLogin}
            suppressHydrationWarning
            className={`p-2 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isMounted && currentUser
                ? currentUser.role === 'CEO'
                  ? 'bg-purple-950/80 border-purple-500/70 text-purple-200 shadow-md shadow-purple-950'
                  : 'bg-amber-950/80 border-amber-500/70 text-amber-200 shadow-md shadow-amber-950'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span suppressHydrationWarning>
              {isMounted && currentUser
                ? `${currentUser.fullName} (${currentUser.role})`
                : 'Login'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile View Navigation (Only show CEO/Admin if Authenticated) */}
      <div className="lg:hidden flex border-t border-slate-800 bg-slate-900/90 px-4 py-2 text-xs justify-around">
        <button
          onClick={() => setActiveView('MARKETPLACE')}
          className={`py-1 px-2.5 rounded ${
            activeView === 'MARKETPLACE' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          Marketplace
        </button>

        <button
          onClick={onOpenComplaint}
          className="py-1 px-2.5 rounded text-slate-400 hover:text-red-400 flex items-center gap-1"
        >
          <Headphones className="w-3.5 h-3.5 text-red-400" />
          Customer Care
        </button>

        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={() => {
              onSelectRole('ADMIN');
              setActiveView('ADMIN');
            }}
            className={`py-1 px-2.5 rounded ${
              activeView === 'ADMIN' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400'
            }`}
          >
            Admin Panel
          </button>
        )}

        {currentUser?.role === 'CEO' && (
          <button
            onClick={() => {
              onSelectRole('CEO');
              setActiveView('CEO');
            }}
            className={`py-1 px-2.5 rounded ${
              activeView === 'CEO' ? 'bg-purple-600 text-white font-bold' : 'text-purple-400'
            }`}
          >
            CEO Panel
          </button>
        )}
      </div>
    </header>
  );
};
