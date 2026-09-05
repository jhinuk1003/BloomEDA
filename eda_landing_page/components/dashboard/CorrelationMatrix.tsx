"use client";

import React from "react";
import { CorrelationReport } from "@/types/bloomeda";
import { Binary, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

export function CorrelationMatrix({ correlations }: { correlations: CorrelationReport | null }) {
  if (!correlations || correlations.columns.length < 2) return null;

  const { matrix, columns, strongest_pairs } = correlations;

  // Helper function to pick color for correlation cell (-1 to +1)
  const getCellBg = (val: number | null) => {
    if (val === null) return "#FAF7F2";
    if (val === 1.0) return "#FAF7F2"; // diagonal
    if (val > 0) {
      // Positive: terracotta gradient
      const alpha = Math.min(Math.abs(val) * 0.75 + 0.1, 0.85);
      return `rgba(200, 109, 81, ${alpha.toFixed(2)})`;
    } else {
      // Negative: dusty rose / sage gradient
      const alpha = Math.min(Math.abs(val) * 0.75 + 0.1, 0.85);
      return `rgba(126, 154, 130, ${alpha.toFixed(2)})`;
    }
  };

  const getTextColor = (val: number | null) => {
    if (val === null || val === 1.0) return "#786B60";
    if (Math.abs(val) > 0.45) return "#FFFFFF";
    return "#3A3027";
  };

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#C69234] flex items-center justify-center border border-[#E7DFD5]">
          <Binary className="w-4 h-4 text-[#C69234]" />
        </div>
        <div>
          <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
            Feature Correlation Matrix
          </h3>
          <span className="text-xs text-[#786B60]">
            Pearson linear correlation coefficients &amp; relational pairings
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Heatmap Grid */}
        <div className="lg:col-span-2 overflow-x-auto bg-white/90 border border-[#E7DFD5] rounded-2xl p-4">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-[10px] text-[#A29488] font-mono"></th>
                {columns.map((c) => (
                  <th key={c} className="p-2 text-[10px] font-medium text-[#786B60] max-w-[70px] truncate" title={c}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {columns.map((r) => (
                <tr key={r}>
                  <td className="p-2 text-[10px] font-medium text-[#786B60] text-left max-w-[80px] truncate" title={r}>
                    {r}
                  </td>
                  {columns.map((c) => {
                    const val = matrix[r]?.[c] ?? null;
                    const isDiagonal = r === c;
                    return (
                      <td
                        key={c}
                        className="p-2 font-mono text-[10px] font-semibold rounded transition-colors"
                        style={{
                          backgroundColor: isDiagonal ? "#F4EFEB" : getCellBg(val),
                          color: isDiagonal ? "#A29488" : getTextColor(val),
                        }}
                        title={`${r} & ${c}: ${val ?? "N/A"}`}
                      >
                        {val !== null ? val.toFixed(2) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Color Legend */}
          <div className="mt-4 pt-3 border-t border-[#E7DFD5] flex items-center justify-between text-[10px] text-[#786B60]">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[rgba(126,154,130,0.7)]" />
              <span>Negative (-1.0)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[#FAF7F2] border border-[#E7DFD5]" />
              <span>Neutral (0.0)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-[rgba(200,109,81,0.7)]" />
              <span>Positive (+1.0)</span>
            </div>
          </div>
        </div>

        {/* Right Col: Strongest Relationships */}
        <div className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-serif-botanical text-lg font-bold text-[#3A3027] mb-3">
              Strongest Relationships
            </h4>

            {strongest_pairs.length === 0 ? (
              <p className="text-xs text-[#786B60]">No correlated numeric pairs detected.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {strongest_pairs.slice(0, 5).map((p, idx) => {
                  const isPos = p.relationship === "positive";
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-[#E7DFD5] flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1 text-[11px] font-semibold text-[#3A3027]">
                          <span className="truncate max-w-[80px]">{p.feature_a}</span>
                          <span className="text-[#A29488]">&amp;</span>
                          <span className="truncate max-w-[80px]">{p.feature_b}</span>
                        </div>
                        <span className="text-[10px] text-[#786B60] capitalize">{p.strength} {p.relationship}</span>
                      </div>

                      <div
                        className={`flex items-center space-x-1 font-mono font-bold text-xs px-2 py-0.5 rounded-md shrink-0 ${
                          isPos ? "bg-[#FCEEE9] text-[#C86D51]" : "bg-[#EBF3EC] text-[#56735A]"
                        }`}
                      >
                        {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{p.correlation.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E7DFD5] text-[10px] text-[#786B60] flex items-start space-x-1.5">
            <Info className="w-3.5 h-3.5 text-[#A29488] shrink-0 mt-0.5" />
            <span>Note: Statistical correlation demonstrates linear association, not causality.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
