"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BloomAnalysisResult } from "@/types/bloomeda";
import { getExportUrl } from "@/lib/api";
import { ArrowLeft, Download, FileJson, FileSpreadsheet, Printer } from "lucide-react";

interface DashboardHeaderProps {
  analysisId: string;
  data: BloomAnalysisResult;
}

export function DashboardHeader({ analysisId, data }: DashboardHeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="border-b border-[#E7DFD5] bg-white/80 backdrop-blur-md sticky top-20 z-30 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Back Link & Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <Link
            href="/analyze"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E7DFD5] bg-[#FAF7F2] hover:bg-white text-[#786B60] hover:text-[#C86D51] flex items-center justify-center transition-colors shrink-0 shadow-xs"
            title="Analyze another artifact"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#7E9A82] bg-[#EBF3EC] px-2 py-0.5 rounded-full border border-[#7E9A82]/30">
                {data.category.toUpperCase()}
              </span>
              <span className="text-xs text-[#786B60]">•</span>
              <span className="text-xs text-[#786B60]">{data.artifact.size_formatted}</span>
            </div>

            <h1 className="font-serif-botanical text-lg sm:text-2xl font-bold text-[#3A3027] truncate mt-0.5" title={data.artifact.filename}>
              Your Data Garden: <span className="text-[#C86D51]">{data.artifact.filename}</span>
            </h1>
          </div>
        </div>

        {/* Right: Export Dropdown */}
        <div className="flex items-center justify-end self-end sm:self-auto relative shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn-terracotta inline-flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E7DFD5] rounded-2xl shadow-xl py-2 z-50 text-xs text-[#3A3027]">
                <a
                  href={getExportUrl(analysisId, "json")}
                  download
                  onClick={() => setShowExportMenu(false)}
                  className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-[#FAF7F2] transition-colors"
                >
                  <FileJson className="w-4 h-4 text-[#C86D51]" />
                  <span>Download JSON Report</span>
                </a>
                <a
                  href={getExportUrl(analysisId, "csv")}
                  download
                  onClick={() => setShowExportMenu(false)}
                  className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-[#FAF7F2] transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#7E9A82]" />
                  <span>Download CSV Summary</span>
                </a>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    handlePrint();
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2.5 hover:bg-[#FAF7F2] transition-colors text-left"
                >
                  <Printer className="w-4 h-4 text-[#786B60]" />
                  <span>Print Botanical Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
