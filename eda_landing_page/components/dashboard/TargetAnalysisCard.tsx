"use client";

import React, { useState } from "react";
import { TargetAnalysis, ColumnProfile } from "@/types/bloomeda";
import { Target, CheckCircle, HelpCircle, ChevronDown } from "lucide-react";

interface TargetAnalysisCardProps {
  target: TargetAnalysis | null;
  columns: ColumnProfile[];
}

export function TargetAnalysisCard({ target, columns }: TargetAnalysisCardProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(
    target?.detected ? target.column : columns.length > 0 ? columns[columns.length - 1].name : null
  );

  if (!target && columns.length === 0) return null;

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#C86D51] flex items-center justify-center border border-[#E7DFD5]">
            <Target className="w-4 h-4 text-[#C86D51]" />
          </div>
          <div>
            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Target Feature Detection
            </h3>
            <span className="text-xs text-[#786B60]">
              Automated classification / regression target heuristic
            </span>
          </div>
        </div>

        {/* Manual Target Override Selector */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs text-[#786B60]">Active Target:</span>
          <select
            value={selectedTarget || ""}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-[#3A3027] focus:outline-none focus:border-[#C86D51]/50 cursor-pointer"
          >
            {columns.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.simple_type})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7DFD5] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C86D51] bg-[#FCEEE9] px-2.5 py-0.5 rounded-md border border-[#C86D51]/20">
              {target?.label_disclaimer || "Target Column"}
            </span>
            {target?.confidence && (
              <span className="text-xs font-medium text-[#56735A] bg-[#EBF3EC] px-2 py-0.5 rounded-md">
                Confidence: {target.confidence}
              </span>
            )}
          </div>

          <h4 className="font-serif-botanical text-xl font-bold text-[#3A3027]">
            Designated Target: <span className="text-[#C86D51]">{selectedTarget}</span>
          </h4>

          {target?.reasons && target.reasons.length > 0 && selectedTarget === target.column ? (
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-[#786B60] block mb-1">
                Heuristic Inference Clues:
              </span>
              <ul className="space-y-1 text-xs text-[#786B60]">
                {target.reasons.map((r, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#7E9A82] shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-[#786B60] mt-2">
              User override selected for downstream target modeling.
            </p>
          )}
        </div>

        {/* Disclaimer Note */}
        <div className="max-w-xs p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[11px] text-[#786B60] flex items-start space-x-2">
          <HelpCircle className="w-4 h-4 text-[#A29488] shrink-0 mt-0.5" />
          <span>
            Target detection uses safe heuristics based on column naming conventions, binary cardinality, and terminal placement. Always confirm the target matches your modeling objective.
          </span>
        </div>
      </div>
    </div>
  );
}
