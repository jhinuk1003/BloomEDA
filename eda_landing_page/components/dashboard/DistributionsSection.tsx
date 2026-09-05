"use client";

import React, { useState } from "react";
import { NumericalStats } from "@/types/bloomeda";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { BarChart3, SlidersHorizontal, Info } from "lucide-react";

interface DistributionsSectionProps {
  stats: Record<string, NumericalStats> | null;
}

export function DistributionsSection({ stats }: DistributionsSectionProps) {
  if (!stats || Object.keys(stats).length === 0) return null;

  const columnNames = Object.keys(stats);
  const [selectedCol, setSelectedCol] = useState(columnNames[0]);
  const currentStats = stats[selectedCol];

  if (!currentStats) return null;

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#C86D51]" />
          </div>
          <div>
            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Numerical Feature Distributions
            </h3>
            <span className="text-xs text-[#786B60]">
              Histogram frequency, quartiles &amp; shape moments
            </span>
          </div>
        </div>

        {/* Feature Dropdown Selector */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#786B60]" />
          <select
            value={selectedCol}
            onChange={(e) => setSelectedCol(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-medium text-[#3A3027] focus:outline-none focus:border-[#C86D51]/50 cursor-pointer"
          >
            {columnNames.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recharts Histogram */}
        <div className="lg:col-span-2 bg-white/90 border border-[#E7DFD5] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-[#3A3027]">
              Frequency Histogram: <span className="text-[#C86D51]">{selectedCol}</span>
            </span>
            <span className="text-[11px] text-[#786B60]">
              {currentStats.count.toLocaleString()} observations
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentStats.histogram} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4EFEB" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#786B60"
                  fontSize={10}
                  tickLine={false}
                  angle={-25}
                  textAnchor="end"
                  height={40}
                />
                <YAxis stroke="#786B60" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FAF7F2",
                    borderColor: "#E7DFD5",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#3A3027",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                  formatter={(value: any) => [`${value} items`, "Count"]}
                  labelFormatter={(label: any) => `Range: ${label}`}
                />
                <Bar dataKey="count" fill="#C86D51" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Statistical Metrics Card */}
        <div className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-serif-botanical text-lg font-bold text-[#3A3027] mb-3">
              Statistical Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Mean</span>
                <span className="font-mono font-semibold text-[#3A3027]">{currentStats.mean ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Median</span>
                <span className="font-mono font-semibold text-[#3A3027]">{currentStats.median ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Std Deviation</span>
                <span className="font-mono font-semibold text-[#3A3027]">{currentStats.std ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Min – Max</span>
                <span className="font-mono font-semibold text-[#3A3027]">
                  {currentStats.min ?? "—"} to {currentStats.max ?? "—"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Quartiles (Q1 – Q3)</span>
                <span className="font-mono font-semibold text-[#3A3027]">
                  {currentStats.q25 ?? "—"} to {currentStats.q75 ?? "—"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">IQR (Interquartile)</span>
                <span className="font-mono font-semibold text-[#C86D51]">{currentStats.iqr}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E7DFD5] flex items-center justify-between text-[11px]">
            <span className="text-[#786B60]">Skew: <strong className="text-[#3A3027]">{currentStats.skewness}</strong></span>
            <span className="text-[#786B60]">Kurtosis: <strong className="text-[#3A3027]">{currentStats.kurtosis}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
