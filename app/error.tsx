'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Operational System Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 mb-6">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">System Error Encountered</h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm">
        An unexpected error occurred in the security ERP interface. Please retry or contact technical operations.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm transition-colors border border-slate-700"
      >
        <RefreshCw className="w-4 h-4" />
        Reload ERP Interface
      </button>
    </div>
  );
}
