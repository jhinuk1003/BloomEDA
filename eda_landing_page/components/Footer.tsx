import React from "react";
import Link from "next/link";
import { FlowerIcon, BotanicalBranchDivider } from "./botanical/FloralDividers";
import { ShieldAlert, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E7DFD5] bg-[#F4EFEB]/70 pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <FlowerIcon className="w-8 h-8 text-[#C86D51]" />
          <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027] mt-3">
            BloomEDA
          </h3>
          <p className="font-serif-botanical italic text-base text-[#786B60] max-w-md mt-1">
            &ldquo;Every dataset has a garden waiting to bloom.&rdquo;
          </p>

          <BotanicalBranchDivider className="my-5" />

          {/* Security Guarantee Box */}
          <div className="max-w-2xl bg-[#FAF7F2] border border-[#E7DFD5] rounded-2xl p-4 text-xs text-[#786B60] flex items-start space-x-3 text-left">
            <ShieldAlert className="w-5 h-5 text-[#C86D51] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#3A3027] block mb-0.5">Isolated Security Guarantee</span>
              All pickle artifacts undergo AST module whitelisting via RestrictedUnpickler in a sandboxed execution subprocess with restricted network, CPU limits, 15-second execution timeout, and immediate filesystem cleanup.
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#786B60] mt-8">
            <Link href="/" className="hover:text-[#C86D51] transition-colors">Home</Link>
            <Link href="/analyze" className="hover:text-[#C86D51] transition-colors">Upload Artifact</Link>
            <Link href="/#samples" className="hover:text-[#C86D51] transition-colors">Demo Samples</Link>
            <Link href="/about" className="hover:text-[#C86D51] transition-colors">Security &amp; Architecture</Link>
          </div>

          {/* Author Credits & Social Links */}
          <div className="mt-8 pt-6 border-t border-[#E7DFD5]/80 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-[#786B60]">
            <div className="flex items-center space-x-1.5">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#C86D51] fill-[#C86D51] animate-pulse" />
              <span>by</span>
              <strong className="text-[#3A3027] font-semibold">Jhinuk Roy</strong>
            </div>

            <div className="flex items-center space-x-3">
              {/* GitHub */}
              <a
                href="https://github.com/jhinuk1003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-[#E7DFD5] text-[#3A3027] hover:text-[#C86D51] hover:border-[#C86D51]/40 transition-colors shadow-xs"
                title="Jhinuk Roy on GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="font-medium">GitHub</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/jhinuk-roy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-[#E7DFD5] text-[#3A3027] hover:text-[#C86D51] hover:border-[#C86D51]/40 transition-colors shadow-xs"
                title="Jhinuk Roy on LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="font-medium">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="text-[11px] text-[#A29488] mt-3">
            <span>Built with Next.js 16, FastAPI, Scikit-Learn &amp; Recharts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
