import React from "react";
import { PipelineReport } from "@/types/bloomeda";
import { GitCommit, ArrowRight, Layers, Cpu, CheckCircle } from "lucide-react";

export function PipelineFlowchart({ pipeline }: { pipeline: PipelineReport | null }) {
  if (!pipeline || pipeline.steps.length === 0) return null;

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-[#EBF3EC] text-[#56735A] flex items-center justify-center">
          <GitCommit className="w-4 h-4 text-[#56735A]" />
        </div>
        <div>
          <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
            Scikit-Learn Pipeline Architecture
          </h3>
          <span className="text-xs text-[#786B60]">
            Visual step-by-step transformation flow ({pipeline.total_steps} sequential stages)
          </span>
        </div>
      </div>

      {/* Horizontal Flowchart Nodes */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="flex items-center space-x-4 min-w-max">
          {/* 1. Raw Input Node */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] w-48 shadow-sm text-center">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#786B60] block mb-1">
              Input Stage
            </span>
            <h4 className="font-serif-botanical text-base font-bold text-[#3A3027]">
              Raw Features
            </h4>
            <span className="text-[11px] text-[#786B60]">Tabular Artifact</span>
          </div>

          <ArrowRight className="w-5 h-5 text-[#C86D51] shrink-0" />

          {/* Sequential Pipeline Steps */}
          {pipeline.steps.map((step, idx) => {
            const isLast = idx === pipeline.steps.length - 1;
            return (
              <React.Fragment key={step.step_name}>
                <div
                  className={`p-4 rounded-2xl border w-56 shadow-sm ${
                    isLast
                      ? "bg-[#FDF6F3] border-[#C86D51]/40"
                      : "bg-white border-[#E7DFD5]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#786B60] uppercase mb-1">
                    <span className="font-semibold">Step {step.step_index + 1}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono ${
                        isLast ? "bg-[#FCEEE9] text-[#C86D51]" : "bg-[#FAF7F2]"
                      }`}
                    >
                      {step.step_type}
                    </span>
                  </div>

                  <h4 className="font-serif-botanical text-base font-bold text-[#3A3027] truncate" title={step.step_name}>
                    {step.step_name}
                  </h4>
                  <span className="text-xs font-mono text-[#786B60] block mt-0.5 truncate" title={step.class_name}>
                    {step.class_name}
                  </span>

                  {/* Micro params preview */}
                  {Object.keys(step.parameters).length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#E7DFD5]/60 text-[10px] text-[#786B60] font-mono">
                      {Object.entries(step.parameters).slice(0, 2).map(([k, v]) => (
                        <div key={k} className="truncate">
                          {k}: {String(v)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!isLast && <ArrowRight className="w-5 h-5 text-[#7E9A82] shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
