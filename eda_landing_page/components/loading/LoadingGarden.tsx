"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getAnalysisStatus } from "@/lib/api";
import { BotanicalBranchDivider } from "../botanical/FloralDividers";
import { AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";

interface LoadingGardenProps {
  analysisId: string;
  filename: string;
  onCompleted: (analysisId: string) => void;
  onError: (errorMsg: string, technicalDetails?: string | null) => void;
}

export function LoadingGarden({ analysisId, filename, onCompleted, onError }: LoadingGardenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(10);
  const [stageMessage, setStageMessage] = useState("Preparing your artifact in isolated workspace...");

  useEffect(() => {
    let isCancelled = false;

    const pollInterval = setInterval(async () => {
      try {
        const statusData = await getAnalysisStatus(analysisId);
        if (isCancelled) return;

        setProgress(statusData.progress || 10);
        if (statusData.stage_message) {
          setStageMessage(statusData.stage_message);
        }

        if (statusData.status === "completed") {
          clearInterval(pollInterval);
          setTimeout(() => {
            onCompleted(analysisId);
          }, 600);
        } else if (statusData.status === "failed") {
          clearInterval(pollInterval);
          onError(statusData.error || "Analysis failed.", statusData.technical_details);
        }
      } catch (err: any) {
        // Continue polling unless catastrophic
      }
    }, 500);

    return () => {
      isCancelled = true;
      clearInterval(pollInterval);
    };
  }, [analysisId, onCompleted, onError]);

  // Flower blooming scale & petal angles based on progress (10 to 100)
  const bloomFactor = Math.min(Math.max(progress / 100, 0.1), 1.0);
  const petalScale = 0.4 + bloomFactor * 0.6;
  const petalSpread = 12 + bloomFactor * 32; // degrees open

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6 flex flex-col items-center text-center">
      {/* Blooming Botanical SVG Flower */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-8">
        {/* Soft radial glow */}
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FCEEE9] via-[#FAF7F2] to-[#EBF3EC] blur-xl"
        />

        {/* Stem and Leaves below flower */}
        <svg
          className="absolute bottom-2 w-28 h-28 text-[#7E9A82] opacity-70"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Curved Stem */}
          <path d="M50 30 C50 60, 48 80, 50 100" stroke="#7E9A82" strokeWidth="3" strokeLinecap="round" />
          {/* Left Leaf */}
          <motion.ellipse
            animate={shouldReduceMotion ? {} : { rotate: [-15, -10, -15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            cx="32"
            cy="65"
            rx="16"
            ry="7"
            transform="rotate(-30 32 65)"
            fill="#7E9A82"
            fillOpacity="0.5"
          />
          {/* Right Leaf */}
          <motion.ellipse
            animate={shouldReduceMotion ? {} : { rotate: [15, 20, 15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            cx="68"
            cy="55"
            rx="16"
            ry="7"
            transform="rotate(30 68 55)"
            fill="#7E9A82"
            fillOpacity="0.5"
          />
        </svg>

        {/* Blooming Petals */}
        <motion.div
          className="relative z-10 w-32 h-32 flex items-center justify-center"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {/* 6 Radial Blooming Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
            <motion.div
              key={idx}
              className="absolute origin-bottom"
              style={{
                bottom: "50%",
                left: "calc(50% - 14px)",
                width: "28px",
                height: "50px",
                transform: `rotate(${angle}deg)`,
              }}
              animate={
                shouldReduceMotion
                  ? { scale: petalScale }
                  : {
                      scale: petalScale,
                      y: [0, -2, 0],
                    }
              }
              transition={{ duration: 3, delay: idx * 0.15, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 28 50" fill="none" className="w-full h-full drop-shadow-sm">
                <path
                  d="M14 0C24 15 28 35 14 50C0 35 4 15 14 0Z"
                  fill={idx % 2 === 0 ? "#C86D51" : "#C98474"}
                  fillOpacity={0.85}
                />
              </svg>
            </motion.div>
          ))}

          {/* Golden Center Core */}
          <motion.div
            className="absolute z-20 w-12 h-12 rounded-full border-2 border-white bg-[#D4AF37] flex items-center justify-center shadow-md"
            animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-6 rounded-full bg-[#A87922] opacity-80" />
          </motion.div>
        </motion.div>
      </div>

      {/* Artifact Title */}
      <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027] truncate max-w-sm">
        {filename}
      </h3>

      {/* Current Botanical Stage */}
      <p className="mt-2 text-sm text-[#C86D51] font-medium min-h-[1.5rem] transition-all">
        {stageMessage}
      </p>

      {/* Botanical Progress Bar */}
      <div className="w-full max-w-md mt-6 bg-[#F4EFEB] h-3 rounded-full overflow-hidden border border-[#E7DFD5] p-0.5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#C98474] via-[#C86D51] to-[#7E9A82] rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.4 }}
        />
      </div>

      <div className="flex justify-between w-full max-w-md text-[11px] text-[#786B60] mt-2 px-1">
        <span>Isolated Worker Subprocess</span>
        <span className="font-semibold text-[#3A3027]">{progress}%</span>
      </div>

      <BotanicalBranchDivider className="my-6" />

      {/* Small reassurance note */}
      <p className="text-xs text-[#786B60] max-w-sm">
        Your artifact is being inspected safely. DataFrames, Pipelines, and Model attributes are introspected
        without executing untrusted code.
      </p>
    </div>
  );
}
