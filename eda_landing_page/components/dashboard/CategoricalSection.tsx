"use client";

import React, { useState } from "react";
import { CategoricalStats } from "@/types/bloomeda";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Tag, SlidersHorizontal, Layers } from "lucide-react";

interface CategoricalSectionProps {
  stats: Record<string, CategoricalStats> | null;
}

export function CategoricalSection({ stats }: CategoricalSectionProps) {
  if (!stats || Object.keys(stats).length === 0) return null;

  const columnNames = Object.keys(stats);
  const [selectedCol, setSelectedCol] = useState(columnNames[0]);
  const currentStats = stats[selectedCol];

  if (!currentStats) return null;

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3EC] text-[#56735A] flex items-center justify-center">
            <Tag className="w-4 h-4 text-[#56735A]" />
          </div>
          <div>
            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Categorical Feature Breakdown
            </h3>
            <span className="text-xs text-[#786B60]">
              Frequency distributions, modal categories &amp; cardinality
            </span>
          </div>
        </div>

        {/* Feature Dropdown */}
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
        {/* Left 2 Cols: Recharts Horizontal / Vertical Bar Chart */}
        <div className="lg:col-span-2 bg-white/90 border border-[#E7DFD5] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-[#3A3027]">
              Top Categories: <span className="text-[#56735A]">{selectedCol}</span>
            </span>
            <span className="text-[11px] text-[#786B60]">
              {currentStats.unique_categories} unique categories
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentStats.top_categories}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F4EFEB" horizontal={false} />
                <XAxis type="number" stroke="#786B60" fontSize={10} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="#786B60"
                  fontSize={10}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FAF7F2",
                    borderColor: "#E7DFD5",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#3A3027",
                  }}
                  formatter={(val: any, name: any, item: any) => [
                    `${val} occurrences (${item.payload.percentage}%)`,
                    "Frequency",
                  ]}
                />
                <Bar dataKey="count" fill="#7E9A82" radius={[0, 4, 4, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Category Metrics */}
        <div className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-serif-botanical text-lg font-bold text-[#3A3027] mb-3">
              Discrete Summary
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Unique Classes</span>
                <span className="font-mono font-semibold text-[#3A3027]">
                  {currentStats.unique_categories}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Most Frequent (Mode)</span>
                <span className="font-mono font-semibold text-[#56735A] truncate max-w-[120px]">
                  {currentStats.most_frequent ?? "—"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Mode Count</span>
                <span className="font-mono font-semibold text-[#3A3027]">
                  {currentStats.most_frequent_count.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Mode Prevalence</span>
                <span className="font-mono font-semibold text-[#3A3027]">
                  {((currentStats.most_frequent_count / Math.max(currentStats.total_count, 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E7DFD5] text-[11px] text-[#786B60]">
            <span>Total valid values evaluated: </span>
            <strong className="text-[#3A3027]">{currentStats.total_count.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
