import React from "react";
import { DataQualityReport } from "@/types/bloomeda";
import { BotanicalQualitySeal } from "../botanical/FloralDividers";
import { Award, ShieldAlert, CheckCircle, Info } from "lucide-react";

export function DataQualityCard({ quality }: { quality: DataQualityReport | null }) {
  if (!quality) return null;

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Botanical Seal */}
        <div className="flex flex-col items-center text-center shrink-0">
          <BotanicalQualitySeal score={quality.score} badge={quality.badge} />
          <span className="text-xs font-semibold text-[#3A3027] mt-2">
            Status: <span className="text-[#7E9A82]">{quality.badge}</span>
          </span>
          <span className="text-[11px] text-[#786B60] max-w-[140px]">
            Explainable Botanical Index
          </span>
        </div>

        {/* Right: Transparent Deduction Ledger */}
        <div className="flex-1 w-full">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-4 h-4 text-[#C86D51]" />
            <h3 className="font-serif-botanical text-xl font-bold text-[#3A3027]">
              Explainable Data Quality Ledger
            </h3>
          </div>
          <p className="text-xs text-[#786B60] leading-relaxed mb-4">
            {quality.formula_description}
          </p>

          {quality.deductions.length === 0 ? (
            <div className="p-3.5 rounded-2xl bg-[#EBF3EC] border border-[#7E9A82]/30 text-xs text-[#56735A] flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#7E9A82] shrink-0" />
              <span>Pristine flora. No deductions applied for missing values, duplicates, or extreme outliers.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {quality.deductions.map((d, i) => {
                const isSevere = d.severity === "high";
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start space-x-2">
                      <ShieldAlert
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isSevere ? "text-[#C86D51]" : "text-[#C69234]"
                        }`}
                      />
                      <div>
                        <span className="font-semibold text-[#3A3027]">{d.rule}</span>
                        <p className="text-[11px] text-[#786B60] mt-0.5 leading-snug">{d.detail}</p>
                      </div>
                    </div>
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md shrink-0 ${
                        isSevere
                          ? "bg-[#FCEEE9] text-[#C86D51]"
                          : "bg-[#FAF2E6] text-[#A67520]"
                      }`}
                    >
                      {d.deduction} pts
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
