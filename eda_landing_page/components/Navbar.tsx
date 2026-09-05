"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FlowerIcon } from "./botanical/FloralDividers";
import { ShieldCheck, Upload, Menu, X } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E7DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-full bg-[#FCEEE9] border border-[#C86D51]/30 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            <FlowerIcon className="w-7 h-7 text-[#C86D51] group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-botanical text-2xl font-bold tracking-tight text-[#3A3027] group-hover:text-[#C86D51] transition-colors">
              BloomEDA
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#786B60] font-medium -mt-1">
              Botanical Artifact Lab
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#786B60]">
          <Link href="/analyze" className="hover:text-[#C86D51] transition-colors">
            Upload &amp; Analyze
          </Link>
          <Link href="/#samples" className="hover:text-[#C86D51] transition-colors">
            Demo Samples
          </Link>
          <Link href="/about" className="hover:text-[#C86D51] transition-colors">
            Architecture &amp; Security
          </Link>
        </nav>

        {/* Desktop Right Action & Security Badge */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-[#56735A] bg-[#EBF3EC] px-3 py-1.5 rounded-full border border-[#7E9A82]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#56735A]" />
            <span className="font-medium">Sandbox Worker Active</span>
          </div>

          <Link
            href="/analyze"
            className="btn-terracotta inline-flex items-center space-x-2 px-4 py-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload .pkl</span>
          </Link>
        </div>

        {/* Mobile & Tablet Hamburger Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <Link
            href="/analyze"
            className="btn-terracotta inline-flex items-center space-x-1 px-3 py-1.5 text-xs sm:hidden"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border border-[#E7DFD5] bg-white text-[#3A3027] hover:bg-[#FAF7F2] hover:text-[#C86D51] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#C86D51]" />
            ) : (
              <Menu className="w-6 h-6 text-[#3A3027]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7DFD5] bg-[#FAF7F2]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 pt-2">
            <Link
              href="/analyze"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E7DFD5] text-sm font-semibold text-[#3A3027] hover:border-[#C86D51]/40 hover:text-[#C86D51] transition-all flex items-center justify-between"
            >
              <span>Upload &amp; Analyze</span>
              <span className="text-xs text-[#C86D51]">.pkl / .pickle →</span>
            </Link>

            <Link
              href="/#samples"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E7DFD5] text-sm font-semibold text-[#3A3027] hover:border-[#C86D51]/40 hover:text-[#C86D51] transition-all flex items-center justify-between"
            >
              <span>Demo Samples</span>
              <span className="text-xs text-[#7E9A82]">Instant Test →</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E7DFD5] text-sm font-semibold text-[#3A3027] hover:border-[#C86D51]/40 hover:text-[#C86D51] transition-all flex items-center justify-between"
            >
              <span>Architecture &amp; Security</span>
              <span className="text-xs text-[#786B60]">Zero-Trust Sandbox →</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-[#E7DFD5]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-[#56735A] bg-[#EBF3EC] px-3.5 py-1.5 rounded-full border border-[#7E9A82]/30 w-full sm:w-auto justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#56735A]" />
              <span className="font-medium">Sandbox Worker Active</span>
            </div>

            <Link
              href="/analyze"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-terracotta w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 text-xs shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Python Artifact</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
