"use client";

import React, { useState, useRef } from "react";
import { uploadArtifact, startAnalysis } from "@/lib/api";
import { FlowerIcon, CornerFoliage } from "../botanical/FloralDividers";
import { UploadCloud, FileCheck, X, AlertCircle, ShieldCheck, Loader2, Sparkles, ArrowRight } from "lucide-react";

interface UploadZoneProps {
  onAnalysisStarted: (analysisId: string, filename: string) => void;
}

export function UploadZone({ onAnalysisStarted }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectFile = (file: File) => {
    setErrorMessage(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    
    if (ext !== "pkl" && ext !== "pickle") {
      setErrorMessage("That doesn't look like a valid pickle file. BloomEDA only accepts .pkl and .pickle artifacts.");
      return;
    }

    if (file.size === 0) {
      setErrorMessage("The selected file is empty (0 bytes). Please select a populated artifact.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage("File exceeds the 100MB maximum upload limit.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // 1. Upload
      const uploadRes = await uploadArtifact(selectedFile);
      // 2. Start analyze
      await startAnalysis(uploadRes.analysis_id);

      // 3. Callback
      onAnalysisStarted(uploadRes.analysis_id, uploadRes.filename);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate analysis. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pkl,.pickle"
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed transition-all p-8 sm:p-12 text-center cursor-pointer ${
          dragOver
            ? "border-[#C86D51] bg-[#FCEEE9]/60 scale-[1.01]"
            : "border-[#DCD1C4] hover:border-[#C86D51]/50 bg-white/70 hover:bg-white/90"
        } shadow-sm backdrop-blur-sm`}
      >
        <CornerFoliage position="top-left" className="w-16 h-16 top-2 left-2" />
        <CornerFoliage position="bottom-right" className="w-16 h-16 bottom-2 right-2" />

        {!selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8 text-[#C86D51]" />
            </div>

            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Drag &amp; Drop Your Python Artifact
            </h3>
            <p className="text-sm text-[#786B60] mt-1.5 max-w-md">
              or <span className="text-[#C86D51] font-semibold underline underline-offset-4">browse your computer</span> for a .pkl or .pickle file
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-[#786B60]">
              <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5]">.pkl</span>
              <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5]">.pickle</span>
              <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5]">Up to 100 MB</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-[#EBF3EC] text-[#56735A] flex items-center justify-center mb-4">
              <FileCheck className="w-8 h-8 text-[#56735A]" />
            </div>

            <h4 className="font-serif-botanical text-xl font-bold text-[#3A3027] truncate max-w-sm">
              {selectedFile.name}
            </h4>
            <span className="text-xs text-[#786B60] mt-1">
              File size: {formatSize(selectedFile.size)}
            </span>

            <div className="mt-6 flex items-center space-x-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-terracotta inline-flex items-center space-x-2 px-6 py-2.5 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Sandbox...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Bloom Analysis</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={isSubmitting}
                className="px-3 py-2.5 rounded-full border border-[#E7DFD5] bg-white text-[#786B60] hover:text-[#C86D51] hover:border-[#C86D51]/40 text-xs inline-flex items-center space-x-1"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-2xl bg-[#FCEEE9] border border-[#C86D51]/30 text-xs text-[#C86D51] flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Invalid Artifact Notice</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Security Message */}
      <div className="mt-6 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center space-x-2 text-xs text-[#56735A]">
        <ShieldCheck className="w-4 h-4 text-[#7E9A82] shrink-0" />
        <span className="font-medium">
          Your file is analyzed inside an isolated environment with restricted execution.
        </span>
      </div>
    </div>
  );
}
