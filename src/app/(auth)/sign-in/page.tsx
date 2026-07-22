"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { ArrowRight } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-vow-bg flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-vow-paper border border-vow-border rounded-xl p-8 shadow-xl text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/vowmark-logo.svg" alt="VOWMARK Logo" className="h-10 mx-auto mb-4 object-contain" />
        <h1 className="font-bold text-xl text-vow-dark">Personal Creator Studio</h1>
        <p className="text-xs text-vow-muted font-sans mt-1">Sign in to your private design workbench</p>

        <form className="mt-6 space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="creator@vowmark.com"
              className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              defaultValue="••••••••••••"
              className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none"
            />
          </div>

          <Link
            href="/"
            className="w-full py-3 bg-vow-dark hover:bg-black text-vow-paper rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
          >
            <span>Open Creator Studio</span>
            <ArrowRight className="w-4 h-4 text-vow-champagne" />
          </Link>
        </form>
      </div>
    </div>
  );
}
