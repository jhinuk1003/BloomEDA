"use client";

import React, { useState } from "react";
import { ModelReport } from "@/types/bloomeda";
import { Cpu, Settings, Award, Layers, Hash, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export function ModelInspector({ model }: { model: ModelReport | null }) {
  const [showAllParams, setShowAllParams] = useState(false);

  if (!model) return null;

  const paramKeys = Object.keys(model.parameters);
  const displayedParams = showAllParams ? paramKeys : paramKeys.slice(0, 8);

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center">
            <Cpu className="w-4 h-4 text-[#C86D51]" />
          </div>
          <div>
            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Machine Learning Model Introspection
            </h3>
            <span className="text-xs text-[#786B60]">
              Architecture parameters, fitted attributes &amp; metrics
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF3EC] text-[#56735A] border border-[#7E9A82]/30">
            {model.estimator_type}
          </span>
          <span className="text-xs text-[#786B60] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E7DFD5]">
            {model.library}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Hyperparameters */}
        <div className="bg-white/90 border border-[#E7DFD5] rounded-2xl p-5">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-4 h-4 text-[#786B60]" />
            <h4 className="font-serif-botanical text-lg font-bold text-[#3A3027]">
              Hyperparameter Configuration
            </h4>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {displayedParams.map((k) => (
              <div
                key={k}
                className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]/70"
              >
                <span className="text-[#786B60] truncate max-w-[180px]">{k}</span>
                <span className="text-[#3A3027] font-semibold truncate max-w-[180px]">
                  {model.parameters[k]}
                </span>
              </div>
            ))}
          </div>

          {paramKeys.length > 8 && (
            <button
              onClick={() => setShowAllParams(!showAllParams)}
              className="mt-3 text-xs text-[#C86D51] font-semibold inline-flex items-center space-x-1 hover:underline"
            >
              <span>{showAllParams ? "Show fewer parameters" : `View all ${paramKeys.length} parameters`}</span>
              {showAllParams ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Right Col: Fitted Attributes & Metrics */}
        <div className="space-y-5">
          {/* Fitted Attributes */}
          <div className="bg-white/90 border border-[#E7DFD5] rounded-2xl p-5">
            <div className="flex items-center space-x-2 mb-3">
              <Layers className="w-4 h-4 text-[#7E9A82]" />
              <h4 className="font-serif-botanical text-lg font-bold text-[#3A3027]">
                Fitted Model Schema
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E7DFD5]/60">
                <span className="text-[#786B60]">Input Features Count:</span>
                <span className="font-mono font-semibold text-[#3A3027]">
                  {model.fitted_attributes.n_features_in ?? "Unknown"}
                </span>
              </div>
              {model.fitted_attributes.classes && (
                <div className="py-1 border-b border-[#E7DFD5]/60">
                  <span className="text-[#786B60] block mb-1">Target Classes:</span>
                  <div className="flex flex-wrap gap-1">
                    {model.fitted_attributes.classes.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E7DFD5] font-mono text-[11px] text-[#3A3027]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {model.fitted_attributes.feature_names && (
                <div className="py-1">
                  <span className="text-[#786B60] block mb-1">Feature Names:</span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {model.fitted_attributes.feature_names.map((fn, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E7DFD5] font-mono text-[11px] text-[#3A3027]">
                        {fn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Evaluation Metrics */}
          <div className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-2xl p-5">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-4 h-4 text-[#C86D51]" />
              <h4 className="font-serif-botanical text-lg font-bold text-[#3A3027]">
                Evaluation Metrics
              </h4>
            </div>

            {model.evaluation_metrics ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(model.evaluation_metrics).map(([mName, mVal]) => (
                  <div key={mName} className="p-2.5 rounded-xl bg-white border border-[#E7DFD5]">
                    <span className="text-[11px] text-[#786B60] uppercase block">{mName}</span>
                    <span className="font-mono text-base font-bold text-[#C86D51]">
                      {typeof mVal === "number" ? mVal.toFixed(3) : String(mVal)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#786B60] italic">
                {model.evaluation_note || "No evaluation metrics were found in this artifact."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
