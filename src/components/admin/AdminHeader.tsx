"use client";

import { signOut } from "next-auth/react";

export default function AdminHeader() {
  return (
    <header className="bg-zinc-900 border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <h1 className="text-white font-semibold text-sm">Admin Dashboard</h1>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </header>
  );
}
