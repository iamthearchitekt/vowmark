"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { ArrowRight } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-vow-bg flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-vow-paper border border-vow-border rounded-xl p-8 shadow-xl text-center">
        <div className="w-10 h-10 rounded-full bg-vow-dark text-vow-champagne flex items-center justify-center font-serif font-bold text-xl mx-auto mb-4">
          V
        </div>
        <h1 className="font-serif font-bold text-2xl text-vow-dark">Create Your Studio Account</h1>
        <p className="text-xs text-vow-muted font-sans mt-1">Start generating bespoke wedding logos &amp; stationery assets</p>

        <form className="mt-6 space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Erick Vance"
              className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold text-vow-charcoal uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="designer@studio.com"
              className="w-full bg-white border border-vow-border rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-vow-dark focus:outline-none"
            />
          </div>

          <Link
            href="/dashboard"
            className="w-full py-3 bg-vow-dark hover:bg-black text-vow-paper rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 text-vow-champagne" />
          </Link>
        </form>

        <p className="text-xs text-vow-muted mt-6">
          Already registered?{" "}
          <Link href="/(auth)/sign-in" className="text-vow-dark font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
