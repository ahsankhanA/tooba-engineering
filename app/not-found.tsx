import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 mb-6">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm">
        The requested security portal resource does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-sm transition-colors shadow-lg shadow-cyan-900/40"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Operational Portal
      </Link>
    </div>
  );
}
