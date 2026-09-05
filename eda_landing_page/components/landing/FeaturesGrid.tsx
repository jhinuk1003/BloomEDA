import React from "react";
import { BotanicalBranchDivider, FlowerIcon } from "../botanical/FloralDividers";
import { ShieldCheck, BarChart3, GitFork, Award, BrainCircuit, FileDown, CheckCircle2 } from "lucide-react";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Deep Automated EDA",
    description: "Instant numerical distribution histograms, quartiles, IQR boundaries, skewness, kurtosis, and categorical cardinality profiling for tabular artifacts.",
    tag: "Pandas & Series"
  },
  {
    icon: Award,
    title: "Explainable Quality Scoring",
    description: "No arbitrary black-box numbers. BloomEDA calculates an explainable 0–100 score detailing transparent point deductions for missing cells, duplicates, and outliers.",
    tag: "Data Quality"
  },
  {
    icon: GitFork,
    title: "Pipeline Flowchart Visualizer",
    description: "Transforms Scikit-Learn Pipeline steps and ColumnTransformers into clean visual graph flowcharts from raw feature inputs to final estimator models.",
    tag: "ML Architecture"
  },
  {
    icon: ShieldCheck,
    title: "Zero-Trust Subprocess Isolation",
    description: "Strict AST class whitelisting via RestrictedUnpickler in an isolated worker subprocess with CPU limits, memory limits, and 15-second execution timeout.",
    tag: "Enterprise Security"
  },
  {
    icon: BrainCircuit,
    title: "Grounded Mathematical Insights",
    description: "Curated observations generated strictly from computed statistics. Detects high missingness, collinearity, ID-like cardinality, and potential target columns.",
    tag: "Zero Hallucination"
  },
  {
    icon: FileDown,
    title: "Comprehensive Report Export",
    description: "Export full structured analysis schemas as JSON for automated pipelines, or generate clean CSV statistic summaries with a single click.",
    tag: "JSON & CSV"
  }
];

export function FeaturesGrid() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="font-serif-botanical text-3xl sm:text-4xl font-bold text-[#3A3027]">
          An Elegant Botanical Laboratory for Machine Learning
        </h2>
        <p className="mt-3 text-base text-[#786B60]">
          Designed to combine the aesthetic calm of a botanical garden with the rigorous analytical depth of a modern data science lab.
        </p>
        <BotanicalBranchDivider className="my-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature, idx) => {
          const IconComp = feature.icon;
          return (
            <div
              key={idx}
              className="botanical-card p-6 sm:p-7 flex flex-col justify-between hover:border-[#C86D51]/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#786B60] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E7DFD5]">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="font-serif-botanical text-xl font-bold text-[#3A3027]">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#786B60] mt-2.5 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7DFD5]/60 flex items-center space-x-1.5 text-[11px] text-[#56735A] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Production validated</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
