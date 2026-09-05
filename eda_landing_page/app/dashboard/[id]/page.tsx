"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnalysisResult } from "@/lib/api";
import { BloomAnalysisResult } from "@/types/bloomeda";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BotanicalBackground } from "@/components/botanical/BotanicalBackground";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DataQualityCard } from "@/components/dashboard/DataQualityCard";
import { AutomatedInsights } from "@/components/dashboard/AutomatedInsights";
import { DataPreviewTable } from "@/components/dashboard/DataPreviewTable";
import { DistributionsSection } from "@/components/dashboard/DistributionsSection";
import { CategoricalSection } from "@/components/dashboard/CategoricalSection";
import { MissingValuesChart } from "@/components/dashboard/MissingValuesChart";
import { CorrelationMatrix } from "@/components/dashboard/CorrelationMatrix";
import { OutlierSection } from "@/components/dashboard/OutlierSection";
import { TargetAnalysisCard } from "@/components/dashboard/TargetAnalysisCard";
import { ModelInspector } from "@/components/dashboard/ModelInspector";
import { PipelineFlowchart } from "@/components/dashboard/PipelineFlowchart";
import { ContainerTreeView } from "@/components/dashboard/ContainerTreeView";
import { FlowerIcon, BotanicalBranchDivider } from "@/components/botanical/FloralDividers";
import {
  LayoutDashboard,
  Table,
  BarChart3,
  Tag,
  Binary,
  AlertTriangle,
  Cpu,
  GitCommit,
  FolderTree,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.id as string;

  const [data, setData] = useState<BloomAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAnalysisResult(analysisId);
        if (!isCancelled) {
          setData(res);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "Failed to load analysis result.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    if (analysisId) {
      loadData();
    }

    return () => {
      isCancelled = true;
    };
  }, [analysisId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <FlowerIcon className="w-12 h-12 text-[#C86D51] animate-spin mb-4" />
          <h2 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
            Opening Your Data Garden...
          </h2>
          <span className="text-xs text-[#786B60] mt-1">
            Formatting exploratory statistics &amp; floral visualizations
          </span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
            Data Garden Unavailable
          </h2>
          <p className="text-xs text-[#786B60] mt-2 mb-6">
            {error || "The requested analysis report could not be found or has expired from temporary storage."}
          </p>
          <Link href="/analyze" className="btn-terracotta inline-flex items-center space-x-2 px-6 py-2.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Upload New Artifact</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isDataFrame = data.category === "dataframe";
  const hasModel = Boolean(data.model);
  const hasPipeline = Boolean(data.pipeline);
  const hasContainer = Boolean(data.container);
  const hasStats = Boolean(data.statistics);

  // Available tabs
  const tabs = [
    { id: "overview", label: "Overview & Quality", icon: LayoutDashboard },
    ...(isDataFrame ? [{ id: "table", label: "Data Preview", icon: Table }] : []),
    ...(isDataFrame && hasStats ? [{ id: "distributions", label: "Distributions", icon: BarChart3 }] : []),
    ...(isDataFrame && hasStats ? [{ id: "categorical", label: "Categorical", icon: Tag }] : []),
    ...(isDataFrame && data.correlations ? [{ id: "correlations", label: "Correlations", icon: Binary }] : []),
    ...(isDataFrame ? [{ id: "outliers", label: "Outliers & Target", icon: AlertTriangle }] : []),
    ...(hasPipeline ? [{ id: "pipeline", label: "Pipeline Flowchart", icon: GitCommit }] : []),
    ...(hasModel ? [{ id: "model", label: "ML Model Schema", icon: Cpu }] : []),
    ...(hasContainer ? [{ id: "container", label: "Container Tree", icon: FolderTree }] : []),
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAF7F2]">
      <BotanicalBackground />
      <Navbar />

      {/* Sticky Header with filename & export buttons */}
      <DashboardHeader analysisId={analysisId} data={data} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Navigation Tabs - Mobile Scrollable & Desktop Grid */}
        <div className="relative">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2.5 pt-1 border-b border-[#E7DFD5] scrollbar-thin">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? "bg-[#C86D51] text-white shadow-xs"
                      : "bg-white/90 text-[#786B60] hover:bg-[#FAF7F2] hover:text-[#3A3027] border border-[#E7DFD5]"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Overview & Quality */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <SummaryCards data={data} />
            {data.data_quality && <DataQualityCard quality={data.data_quality} />}
            <AutomatedInsights insights={data.insights} />
            {isDataFrame && <MissingValuesChart missingList={data.visualizations?.missing_values} />}
            {hasPipeline && <PipelineFlowchart pipeline={data.pipeline} />}
            {hasModel && <ModelInspector model={data.model} />}
            {hasContainer && <ContainerTreeView container={data.container} />}
          </div>
        )}

        {/* Tab 2: Data Table */}
        {activeTab === "table" && isDataFrame && (
          <div className="space-y-8">
            <DataPreviewTable analysisId={analysisId} />
          </div>
        )}

        {/* Tab 3: Distributions */}
        {activeTab === "distributions" && isDataFrame && data.statistics && (
          <div className="space-y-8">
            <DistributionsSection stats={data.statistics.numerical} />
          </div>
        )}

        {/* Tab 4: Categorical */}
        {activeTab === "categorical" && isDataFrame && data.statistics && (
          <div className="space-y-8">
            <CategoricalSection stats={data.statistics.categorical} />
          </div>
        )}

        {/* Tab 5: Correlations */}
        {activeTab === "correlations" && isDataFrame && data.correlations && (
          <div className="space-y-8">
            <CorrelationMatrix correlations={data.correlations} />
          </div>
        )}

        {/* Tab 6: Outliers & Target */}
        {activeTab === "outliers" && isDataFrame && (
          <div className="space-y-8">
            <TargetAnalysisCard target={data.target_analysis} columns={data.columns} />
            <OutlierSection outliers={data.outliers} />
          </div>
        )}

        {/* Tab 7: Pipeline */}
        {activeTab === "pipeline" && hasPipeline && (
          <div className="space-y-8">
            <PipelineFlowchart pipeline={data.pipeline} />
          </div>
        )}

        {/* Tab 8: Model */}
        {activeTab === "model" && hasModel && (
          <div className="space-y-8">
            <ModelInspector model={data.model} />
          </div>
        )}

        {/* Tab 9: Container */}
        {activeTab === "container" && hasContainer && (
          <div className="space-y-8">
            <ContainerTreeView container={data.container} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
