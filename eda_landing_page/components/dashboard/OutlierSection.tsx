import React from "react";
import { OutlierReport } from "@/types/bloomeda";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

export function OutlierSection({ outliers }: { outliers: OutlierReport | null }) {
  if (!outliers) return null;

  const { total_outlier_count, columns_affected_count, details } = outliers;
  const colKeys = Object.keys(details);

  if (columns_affected_count === 0 || colKeys.length === 0) {
    return (
      <div className="botanical-card p-6 sm:p-7">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3EC] text-[#56735A] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-[#56735A]" />
          </div>
          <div>
            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Statistical Outlier Boundaries
            </h3>
            <span className="text-xs text-[#786B60]">IQR &amp; Z-score extreme value inspection</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[#EBF3EC] border border-[#7E9A82]/30 text-xs text-[#56735A] flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#7E9A82] shrink-0" />
          <span>Balanced Flora! No significant statistical outliers detected beyond 1.5×IQR or 3.0σ thresholds.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-[#C86D51]" />
          </div>
          <div>
            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Statistical Outlier Boundaries
            </h3>
            <span className="text-xs text-[#786B60]">
              Identified via Tukey&rsquo;s 1.5×IQR and standard Z-score (&gt; 3.0σ) boundaries
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-[#C86D51] bg-[#FCEEE9] px-3 py-1 rounded-full border border-[#C86D51]/30">
          <span>{columns_affected_count} Features Affected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colKeys.map((col) => {
          const item = details[col];
          return (
            <div
              key={col}
              className="p-4 rounded-2xl bg-white border border-[#E7DFD5] flex flex-col justify-between hover:border-[#C86D51]/35 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-serif-botanical text-base font-bold text-[#3A3027] truncate" title={col}>
                    {col}
                  </h4>
                  <span className="font-mono text-xs font-bold text-[#C86D51] bg-[#FCEEE9] px-2 py-0.5 rounded">
                    {item.iqr_percentage}%
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#786B60]">
                  <div className="flex justify-between">
                    <span>1.5×IQR Outliers:</span>
                    <span className="font-mono font-semibold text-[#3A3027]">{item.iqr_outlier_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Z-Score (&gt; 3σ):</span>
                    <span className="font-mono font-semibold text-[#3A3027]">{item.zscore_outlier_count}</span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1">
                    <span>Valid Bounds:</span>
                    <span className="font-mono text-[#786B60]">
                      [{item.lower_bound?.toFixed(1) ?? "—"}, {item.upper_bound?.toFixed(1) ?? "—"}]
                    </span>
                  </div>
                </div>

                {item.sample_outliers && item.sample_outliers.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#E7DFD5]/60">
                    <span className="text-[10px] text-[#A29488] block mb-1">Sample Outlier Values:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.sample_outliers.map((val, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#E7DFD5] text-[#3A3027]"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
