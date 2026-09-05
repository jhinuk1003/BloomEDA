"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FlowerIcon, BotanicalBranchDivider, CornerFoliage } from "../botanical/FloralDividers";
import { Upload, ArrowRight, ShieldCheck, Sparkles, Database, Layers, GitCommit, Droplets, Binary } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28">
      {/* Decorative foliage in corners */}
      <CornerFoliage position="top-left" className="w-36 h-36 top-0 left-0" />
      <CornerFoliage position="top-right" className="w-36 h-36 top-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Botanical Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-[#FCEEE9] text-[#C86D51] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-[#C86D51]/25 mb-6"
          >
            <FlowerIcon className="w-4 h-4 text-[#C86D51]" />
            <span>Bohemian Botanical Automated EDA &amp; ML Inspector</span>
          </motion.div>

          {/* Large Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif-botanical text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3A3027] leading-[1.15]"
          >
            Turn Your Pickle Files Into <span className="text-[#C86D51] italic">Data Stories.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[#786B60] leading-relaxed font-normal"
          >
            Upload your Python artifact and let <strong className="text-[#3A3027] font-semibold">BloomEDA</strong> automatically
            uncover its structure, statistics, patterns, anomalies, and machine-learning insights.
          </motion.p>

          <BotanicalBranchDivider className="my-6" />

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2"
          >
            <Link
              href="/analyze"
              className="btn-terracotta w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 text-base shadow-md"
            >
              <Upload className="w-5 h-5" />
              <span>Upload a .pkl file</span>
            </Link>

            <Link
              href="/#samples"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 text-base font-medium rounded-full bg-white/80 border border-[#E7DFD5] text-[#3A3027] hover:bg-[#FAF7F2] hover:border-[#C86D51]/40 transition-all shadow-sm"
            >
              <span>Explore how it works</span>
              <ArrowRight className="w-4 h-4 text-[#C86D51]" />
            </Link>
          </motion.div>

          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-[#786B60]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7E9A82]" />
            <span>Restricted sandbox environment. Deserialization never touches untrusted threads.</span>
          </div>
        </div>

        {/* Artistic Hero Visual Composition with Floating Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative mt-16 max-w-4xl mx-auto"
        >
          {/* Center Botanical Terrarium Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-white/95 to-[#FAF7F2]/90 border border-[#E7DFD5] p-6 sm:p-10 shadow-xl overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#FCEEE9]/60 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#EBF3EC]/60 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Illustration & Botanical Garden Showcase */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#C86D51]/30 flex items-center justify-center shadow-inner mb-4">
                  <FlowerIcon className="w-10 h-10 text-[#C86D51]" />
                </div>
                <h2 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
                  The Living Data Garden
                </h2>
                <p className="text-xs text-[#786B60] mt-1.5 leading-relaxed">
                  Every uploaded DataFrame, Pipeline, and Model blossoms into an interactive botanical dashboard
                  with statistical distributions, correlation heatmaps, and outlier boundaries.
                </p>

                <div className="mt-5 flex items-center space-x-2 text-xs text-[#C86D51] font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Supports Pandas, Scikit-learn, NumPy &amp; Bundles</span>
                </div>
              </div>

              {/* Floating Analytical Petal Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
                {/* 1. Dataset Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white/90 border border-[#E7DFD5] p-3 rounded-2xl shadow-sm text-left flex flex-col"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#C86D51] flex items-center justify-center mb-1.5">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#3A3027]">Dataset</span>
                  <span className="text-[10px] text-[#786B60]">1,012 × 11 cols</span>
                  <span className="text-[9px] text-[#7E9A82] font-semibold mt-1">423 KB in RAM</span>
                </motion.div>

                {/* 2. Features Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white/90 border border-[#E7DFD5] p-3 rounded-2xl shadow-sm text-left flex flex-col"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7E9A82] flex items-center justify-center mb-1.5">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#3A3027]">Features</span>
                  <span className="text-[10px] text-[#786B60]">5 Num, 6 Cat</span>
                  <span className="text-[9px] text-[#C86D51] font-semibold mt-1">Categorical ratio</span>
                </motion.div>

                {/* 3. Missing Values Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white/90 border border-[#E7DFD5] p-3 rounded-2xl shadow-sm text-left flex flex-col"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#56735A] flex items-center justify-center mb-1.5">
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#3A3027]">Missingness</span>
                  <span className="text-[10px] text-[#786B60]">1.17% overall</span>
                  <span className="text-[9px] text-[#56735A] font-semibold mt-1">Minimal nulls</span>
                </motion.div>

                {/* 4. Correlations Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white/90 border border-[#E7DFD5] p-3 rounded-2xl shadow-sm text-left flex flex-col"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#C86D51] flex items-center justify-center mb-1.5">
                    <Binary className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#3A3027]">Correlations</span>
                  <span className="text-[10px] text-[#786B60]">r = 0.632 (tenure)</span>
                  <span className="text-[9px] text-[#C69234] font-semibold mt-1">Pearson matrix</span>
                </motion.div>

                {/* 5. Model / Pipeline Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white/90 border border-[#E7DFD5] p-3 rounded-2xl shadow-sm text-left flex flex-col"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#7E9A82] flex items-center justify-center mb-1.5">
                    <GitCommit className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#3A3027]">ML Pipeline</span>
                  <span className="text-[10px] text-[#786B60]">RandomForest</span>
                  <span className="text-[9px] text-[#7E9A82] font-semibold mt-1">Step flowchart</span>
                </motion.div>

                {/* 6. Insights Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white/90 border border-[#E7DFD5] p-3 rounded-2xl shadow-sm text-left flex flex-col"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#C69234] flex items-center justify-center mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#3A3027]">Insights</span>
                  <span className="text-[10px] text-[#786B60]">Target: &lsquo;churn&rsquo;</span>
                  <span className="text-[9px] text-[#C86D51] font-semibold mt-1">Heuristic detected</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
