"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loadSample, getSampleDownloadUrl } from "@/lib/api";
import { FlowerIcon } from "../botanical/FloralDividers";
import { Database, GitCommit, FolderTree, Grid, Download, Play, Loader2, Sparkles } from "lucide-react";

interface SampleItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  size: string;
  icon: typeof Database;
  description: string;
  tags: string[];
}

const SAMPLE_DATA: SampleItem[] = [
  {
    id: "customer_churn_dataframe.pkl",
    title: "Customer Churn DataFrame",
    category: "Pandas DataFrame",
    badge: "Comprehensive EDA",
    size: "103 KB",
    icon: Database,
    description: "1,012 realistic customer rows with numerical tenure, monthly charges, outliers, missing values, and churn target.",
    tags: ["Pandas", "Outliers", "Correlation Matrix", "Target Heuristic"]
  },
  {
    id: "churn_rf_pipeline.pkl",
    title: "Scikit-Learn ML Pipeline",
    category: "Machine Learning Pipeline",
    badge: "Flowchart Visualizer",
    size: "98 KB",
    icon: GitCommit,
    description: "Trained Scikit-Learn Pipeline combining ColumnTransformer (StandardScaler, OneHotEncoder) with a fitted RandomForestClassifier.",
    tags: ["Pipeline", "ColumnTransformer", "RandomForest", "Graph Nodes"]
  },
  {
    id: "trained_model_bundle.pkl",
    title: "Model Artifact Bundle",
    category: "Container / Dictionary",
    badge: "Multi-Object Bundle",
    size: "12 KB",
    icon: FolderTree,
    description: "Nested Python dictionary container containing fitted LogisticRegression model, scaler, feature list, and evaluation metrics.",
    tags: ["Dictionary", "Model Introspection", "Metrics", "Recursive Tree"]
  },
  {
    id: "sensor_embeddings_numpy.pkl",
    title: "Sensor Embeddings Matrix",
    category: "NumPy ndarray",
    badge: "NumPy Analysis",
    size: "28 KB",
    icon: Grid,
    description: "High-dimensional 2D NumPy array simulating sensor signals with sparsity statistics, min/max quantiles, and distribution profiling.",
    tags: ["NumPy", "2D Array", "Sparsity", "Quantiles"]
  }
];

export function SampleArtifacts() {
  const router = useRouter();
  const [loadingSample, setLoadingSample] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInspectSample = async (sampleId: string) => {
    try {
      setLoadingSample(sampleId);
      setErrorMessage(null);
      const res = await loadSample(sampleId);
      router.push(`/analyze?job=${res.analysis_id}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load sample artifact.");
      setLoadingSample(null);
    }
  };

  return (
    <section id="samples" className="py-20 bg-[#F4EFEB]/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#786B60] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
            <span>Interactive Demonstration Artifacts</span>
          </div>
          <h2 className="font-serif-botanical text-3xl sm:text-4xl font-bold text-[#3A3027]">
            Don&rsquo;t Have a .pkl File Handy?
          </h2>
          <p className="mt-3 text-base text-[#786B60]">
            Explore BloomEDA instantly with pre-curated Python artifacts. Click any sample below to experience
            the botanical loading garden and deep exploratory inspection.
          </p>
        </div>

        {errorMessage && (
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-[#FCEEE9] border border-[#C86D51]/30 text-xs text-[#C86D51] text-center">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_DATA.map((sample) => {
            const IconComponent = sample.icon;
            const isLoading = loadingSample === sample.id;

            return (
              <div
                key={sample.id}
                className="botanical-card p-6 sm:p-7 flex flex-col justify-between group hover:border-[#C86D51]/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center text-[#C86D51] group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF3EC] text-[#56735A] border border-[#7E9A82]/30">
                        {sample.badge}
                      </span>
                      <span className="text-[11px] text-[#786B60] mt-1">{sample.size}</span>
                    </div>
                  </div>

                  <h3 className="font-serif-botanical text-xl font-bold text-[#3A3027] group-hover:text-[#C86D51] transition-colors">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-[#786B60] mt-2 leading-relaxed">
                    {sample.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {sample.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E7DFD5] text-[#786B60]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7 pt-5 border-t border-[#E7DFD5]/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleInspectSample(sample.id)}
                    disabled={isLoading || loadingSample !== null}
                    className="btn-terracotta flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 text-xs disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Opening Garden...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Inspect Instantly</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getSampleDownloadUrl(sample.id)}
                    download
                    className="p-2.5 rounded-full bg-white border border-[#E7DFD5] text-[#786B60] hover:text-[#C86D51] hover:border-[#C86D51]/30 transition-colors shadow-sm"
                    title="Download .pkl file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
