import React from "react";
import { BotanicalInsight } from "@/types/bloomeda";
import { FlowerIcon } from "../botanical/FloralDividers";
import { Sparkles, AlertTriangle, Droplets, Copy, GitFork, Key, Target, Layers, Box, Cpu, Info } from "lucide-react";

export function AutomatedInsights({ insights }: { insights: BotanicalInsight[] }) {
  if (!insights || insights.length === 0) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Droplets": return Droplets;
      case "Copy": return Copy;
      case "GitFork": return GitFork;
      case "AlertTriangle": return AlertTriangle;
      case "Key": return Key;
      case "Target": return Target;
      case "Layers": return Layers;
      case "Cpu": return Cpu;
      default: return Sparkles;
    }
  };

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#C86D51]" />
        </div>
        <div>
          <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
            Automated Botanical Insights
          </h3>
          <span className="text-xs text-[#786B60]">
            Derived strictly from computed statistics and artifact introspection
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins, idx) => {
          const IconComp = getIcon(ins.icon);
          const isWarning = ins.sentiment === "warning";
          const isPositive = ins.sentiment === "positive";

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                isWarning
                  ? "bg-[#FDF6F3] border-[#C86D51]/25 hover:border-[#C86D51]/40"
                  : isPositive
                  ? "bg-[#F5F9F6] border-[#7E9A82]/25 hover:border-[#7E9A82]/40"
                  : "bg-[#FAF7F2] border-[#E7DFD5] hover:border-[#786B60]/30"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isWarning
                      ? "bg-[#FCEEE9] text-[#C86D51]"
                      : isPositive
                      ? "bg-[#EBF3EC] text-[#56735A]"
                      : "bg-white text-[#786B60]"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#786B60]">
                      {ins.category}
                    </span>
                  </div>
                  <h4 className="font-serif-botanical text-base font-bold text-[#3A3027]">
                    {ins.title}
                  </h4>
                  <p className="text-xs text-[#786B60] mt-1 leading-relaxed">
                    {ins.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
