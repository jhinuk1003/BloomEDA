"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UploadZone } from "@/components/upload/UploadZone";
import { LoadingGarden } from "@/components/loading/LoadingGarden";
import { BotanicalBackground } from "@/components/botanical/BotanicalBackground";
import { BotanicalBranchDivider, FlowerIcon } from "@/components/botanical/FloralDividers";
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("job");

  const [activeJobId, setActiveJobId] = useState<string | null>(initialJobId);
  const [activeFilename, setActiveFilename] = useState<string>("artifact.pkl");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [technicalDetails, setTechnicalDetails] = useState<string | null>(null);
  const [showTechDetails, setShowTechDetails] = useState(false);

  useEffect(() => {
    if (initialJobId) {
      setActiveJobId(initialJobId);
    }
  }, [initialJobId]);

  const handleAnalysisStarted = (analysisId: string, filename: string) => {
    setErrorMessage(null);
    setTechnicalDetails(null);
    setActiveFilename(filename);
    setActiveJobId(analysisId);
  };

  const handleAnalysisCompleted = (analysisId: string) => {
    router.push(`/dashboard/${analysisId}`);
  };

  const handleAnalysisError = (errorMsg: string, techDetails?: string | null) => {
    setErrorMessage(errorMsg);
    setTechnicalDetails(techDetails || null);
    setActiveJobId(null);
  };

  const handleReset = () => {
    setActiveJobId(null);
    setErrorMessage(null);
    setTechnicalDetails(null);
    router.push("/analyze");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-12 h-12 rounded-full bg-[#FCEEE9] border border-[#C86D51]/30 flex items-center justify-center mx-auto mb-3">
          <FlowerIcon className="w-7 h-7 text-[#C86D51]" />
        </div>

        <h1 className="font-serif-botanical text-3xl sm:text-4xl font-bold text-[#3A3027]">
          {activeJobId ? "Blooms in Progress" : "Seed Your Data Garden"}
        </h1>

        <p className="mt-2 text-sm text-[#786B60]">
          {activeJobId
            ? "Your Python artifact is being carefully parsed and profiled in our sandboxed environment."
            : "Upload any .pkl or .pickle file to begin automated exploratory data analysis."}
        </p>

        <BotanicalBranchDivider className="my-5" />
      </div>

      {/* Error Boundary Display */}
      {errorMessage && (
        <div className="botanical-card p-6 sm:p-7 max-w-2xl mx-auto mb-8 bg-[#FDF6F3] border-[#C86D51]/30">
          <div className="flex items-start space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-[#C86D51]" />
            </div>

            <div className="flex-1">
              <h3 className="font-serif-botanical text-xl font-bold text-[#3A3027]">
                Artifact Examination Halted
              </h3>
              <p className="text-xs text-[#786B60] mt-1 leading-relaxed">
                {errorMessage}
              </p>

              {technicalDetails && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="text-xs text-[#C86D51] font-semibold inline-flex items-center space-x-1 hover:underline"
                  >
                    <span>{showTechDetails ? "Hide technical details" : "Show technical details"}</span>
                    {showTechDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showTechDetails && (
                    <pre className="mt-2 p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[11px] font-mono text-[#3A3027] overflow-x-auto max-h-48">
                      {technicalDetails}
                    </pre>
                  )}
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-[#E7DFD5] flex items-center space-x-3">
                <button
                  onClick={handleReset}
                  className="btn-terracotta inline-flex items-center space-x-2 px-5 py-2 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Another Artifact</span>
                </button>
                <Link
                  href="/#samples"
                  className="text-xs text-[#786B60] hover:text-[#C86D51] transition-colors"
                >
                  or try a demo sample
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* State A: Blooming Loading Garden */}
      {activeJobId ? (
        <div className="botanical-card p-4 sm:p-8">
          <LoadingGarden
            analysisId={activeJobId}
            filename={activeFilename}
            onCompleted={handleAnalysisCompleted}
            onError={handleAnalysisError}
          />
        </div>
      ) : (
        /* State B: Upload Zone */
        <UploadZone onAnalysisStarted={handleAnalysisStarted} />
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <BotanicalBackground />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Suspense fallback={<div className="text-center py-20 text-xs text-[#786B60]">Preparing garden...</div>}>
          <AnalyzeContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
