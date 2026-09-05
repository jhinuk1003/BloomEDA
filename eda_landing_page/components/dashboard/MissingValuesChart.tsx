"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Droplets, CheckCircle2 } from "lucide-react";

interface MissingValuesChartProps {
  missingList?: { column: string; missing_count: number; missing_percentage: number }[];
}

export function MissingValuesChart({ missingList }: MissingValuesChartProps) {
  if (!missingList || missingList.length === 0) {
    return (
      <div className="botanical-card p-6 sm:p-7">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3EC] text-[#56735A] flex items-center justify-center">
            <Droplets className="w-4 h-4 text-[#56735A]" />
          </div>
          <div>
            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Missing Value Profile
            </h3>
            <span className="text-xs text-[#786B60]">Data completeness &amp; sparsity check</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#EBF3EC] border border-[#7E9A82]/30 text-xs text-[#56735A] flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#7E9A82] shrink-0" />
          <span>Complete Flora! No missing or null values were found across any features in this dataset.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center">
          <Droplets className="w-4 h-4 text-[#C86D51]" />
        </div>
        <div>
          <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
            Missing Value Profile
          </h3>
          <span className="text-xs text-[#786B60]">
            Ranking features by null percentage and sparsity
          </span>
        </div>
      </div>

      <div className="bg-white/90 border border-[#E7DFD5] rounded-2xl p-4 sm:p-5">
        <div className="h-60 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={missingList} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4EFEB" vertical={false} />
              <XAxis dataKey="column" stroke="#786B60" fontSize={10} tickLine={false} />
              <YAxis
                stroke="#786B60"
                fontSize={10}
                tickLine={false}
                unit="%"
                domain={[0, "auto"]}
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
                  `${val}% (${item.payload.missing_count} cells)`,
                  "Missing Ratio",
                ]}
              />
              <Bar dataKey="missing_percentage" fill="#C86D51" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
