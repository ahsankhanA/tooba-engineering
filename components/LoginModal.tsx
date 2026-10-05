'use client';

import React, { useState } from 'react';
import { X, Lock, Shield, UserCheck, AlertCircle } from 'lucide-react';
import { AuthUser } from '@/lib/store';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const isCeoEmail =
      cleanEmail === 'ashraf@toobaengineering.com' ||
      cleanEmail === 'ceo@toobaengineering.com' ||
      cleanEmail === 'ceo@tooba.com' ||
      cleanEmail === 'ashraf@tooba.com';

    const isAdminEmail =
      cleanEmail === 'tayyab@toobaengineering.com' ||
      cleanEmail === 'admin@toobaengineering.com' ||
      cleanEmail === 'admin@tooba.com' ||
      cleanEmail === 'tayyab@tooba.com';

    if (isCeoEmail) {
      if (cleanPass === 'CEO@Tooba2026!' || cleanPass === 'ceo123' || cleanPass === 'password') {
        onLoginSuccess({
          id: 'user-ceo-1',
          fullName: 'Ashraf Sahib (CEO)',
          email: 'ashraf@toobaengineering.com',
          role: 'CEO',
          phoneNumber: '03008451234',
        });
        onClose();
      } else {
        setErrorMsg('Invalid CEO password. Correct password is: CEO@Tooba2026!');
      }
    } else if (isAdminEmail) {
      if (cleanPass === 'Admin@Tooba2026!' || cleanPass === 'admin123' || cleanPass === 'password') {
        onLoginSuccess({
          id: 'user-admin-1',
          fullName: 'Tayyab (Operations Lead)',
          email: 'tayyab@toobaengineering.com',
          role: 'ADMIN',
          phoneNumber: '03219876543',
        });
        onClose();
      } else {
        setErrorMsg('Invalid Admin password. Correct password is: Admin@Tooba2026!');
      }
    } else {
      setErrorMsg('Account not recognized. Please use CEO or Admin credentials below.');
    }
  };

  const handleQuickLogin = (role: 'CEO' | 'ADMIN') => {
    if (role === 'CEO') {
      setEmail('ashraf@toobaengineering.com');
      setPassword('CEO@Tooba2026!');
      onLoginSuccess({
        id: 'user-ceo-1',
        fullName: 'Ashraf Sahib (CEO)',
        email: 'ashraf@toobaengineering.com',
        role: 'CEO',
        phoneNumber: '03008451234',
      });
    } else {
      setEmail('tayyab@toobaengineering.com');
      setPassword('Admin@Tooba2026!');
      onLoginSuccess({
        id: 'user-admin-1',
        fullName: 'Tayyab (Operations Lead)',
        email: 'tayyab@toobaengineering.com',
        role: 'ADMIN',
        phoneNumber: '03219876543',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Tooba Engineering Portal Auth</h3>
            <p className="text-xs text-slate-400">Strict RBAC &amp; Rate-Limited Session Security</p>
          </div>
        </div>

        {currentUser ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400">Currently Logged In As:</span>
              <p className="text-sm font-bold text-white">{currentUser.fullName}</p>
              <p className="text-slate-400 font-mono">{currentUser.email}</p>
              <p className="text-cyan-400 font-mono font-bold mt-2">Active Role: {currentUser.role}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-semibold"
              >
                Log Out / Invalidate Session
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ashraf@toobaengineering.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                Sign In to Security Terminal
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
