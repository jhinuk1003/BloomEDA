import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BotanicalBackground } from "@/components/botanical/BotanicalBackground";
import { BotanicalBranchDivider, FlowerIcon } from "@/components/botanical/FloralDividers";
import { ShieldCheck, ShieldAlert, Cpu, Database, GitCommit, Layers, Lock, Clock, HardDrive, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAF7F2]">
      <BotanicalBackground />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#FCEEE9] border border-[#C86D51]/30 flex items-center justify-center mx-auto mb-3">
            <FlowerIcon className="w-7 h-7 text-[#C86D51]" />
          </div>
          <h1 className="font-serif-botanical text-4xl sm:text-5xl font-bold text-[#3A3027]">
            About BloomEDA
          </h1>
          <p className="mt-3 text-base text-[#786B60]">
            An elegant botanical laboratory for safely inspecting, analyzing, and understanding serialized machine-learning artifacts.
          </p>
          <BotanicalBranchDivider className="my-6" />
        </div>

        {/* 1. Philosophy */}
        <div className="botanical-card p-6 sm:p-8">
          <h2 className="font-serif-botanical text-2xl font-bold text-[#3A3027] mb-3">
            The Botanical Laboratory Philosophy
          </h2>
          <p className="text-sm text-[#786B60] leading-relaxed mb-4">
            Modern machine-learning workflows frequently produce serialized binary artifacts (Python <code className="text-[#C86D51] font-mono text-xs bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E7DFD5]">.pkl</code> files). Yet exploring what lies within them has traditionally required either opening a Jupyter notebook or trusting generic, clinical SaaS interfaces.
          </p>
          <p className="text-sm text-[#786B60] leading-relaxed">
            BloomEDA reimagines data exploration through a <strong className="text-[#3A3027]">Bohemian Botanical aesthetic</strong>. Data points become flora, statistical health becomes a blooming data garden, and complex preprocessing pipelines become organic visual trees—while retaining strict mathematical precision.
          </p>
        </div>

        {/* 2. Security Architecture */}
        <div className="botanical-card p-6 sm:p-8 border-[#C86D51]/30 bg-[#FDF6F3]/50">
          <div className="flex items-center space-x-2.5 mb-4 text-[#C86D51]">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Zero-Trust Subprocess Isolation
            </h2>
          </div>

          <p className="text-sm text-[#786B60] leading-relaxed mb-6">
            Python&rsquo;s <code className="text-[#C86D51] font-mono text-xs bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E7DFD5]">pickle</code> protocol is inherently insecure when deserializing untrusted files. BloomEDA enforces rigorous architectural boundaries to protect the application and host:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-1">
              <div className="flex items-center space-x-2 text-[#C86D51] font-bold">
                <Lock className="w-4 h-4" />
                <span>RestrictedUnpickler AST</span>
              </div>
              <p className="text-[#786B60] leading-snug">
                Overrides Python&rsquo;s class loader to whitelist only standard scientific libraries (NumPy, Pandas, Scikit-learn, SciPy). All OS commands, subprocesses, and eval functions are actively rejected.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-1">
              <div className="flex items-center space-x-2 text-[#7E9A82] font-bold">
                <Cpu className="w-4 h-4" />
                <span>Subprocess Sandboxing</span>
              </div>
              <p className="text-[#786B60] leading-snug">
                Analysis executes in an isolated worker process outside the main FastAPI thread and completely separated from the Next.js presentation server.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-1">
              <div className="flex items-center space-x-2 text-[#C69234] font-bold">
                <Clock className="w-4 h-4" />
                <span>15-Second Execution Timeout</span>
              </div>
              <p className="text-[#786B60] leading-snug">
                Hard timeouts prevent infinite loops, recursion bombs, or resource starvation attacks from consuming system CPU.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-1">
              <div className="flex items-center space-x-2 text-[#56735A] font-bold">
                <HardDrive className="w-4 h-4" />
                <span>Ephemeral File Lifecycle</span>
              </div>
              <p className="text-[#786B60] leading-snug">
                Uploaded artifacts reside in ephemeral job directories and can be scrubbed on-demand or upon job expiration.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Supported Objects */}
        <div className="botanical-card p-6 sm:p-8">
          <h2 className="font-serif-botanical text-2xl font-bold text-[#3A3027] mb-4">
            Supported Artifact Flora
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
              <Database className="w-5 h-5 text-[#C86D51] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#3A3027] block text-sm">Pandas DataFrames &amp; Series</strong>
                <span className="text-[#786B60]">
                  Comprehensive EDA with missingness rankings, duplicate counts, continuous histogram distributions, Tukey IQR outlier boundaries, and correlation matrices.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
              <GitCommit className="w-5 h-5 text-[#7E9A82] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#3A3027] block text-sm">Scikit-Learn ML Pipelines</strong>
                <span className="text-[#786B60]">
                  Graph flowcharts decomposing ColumnTransformers, Scalers, One-Hot Encoders, and terminal Estimators into sequential visual nodes.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
              <Cpu className="w-5 h-5 text-[#C69234] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#3A3027] block text-sm">Trained Machine Learning Models</strong>
                <span className="text-[#786B60]">
                  Introspects hyperparameter values, fitted target classes, feature input counts, tree depth, and embedded evaluation metrics.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5]">
              <Layers className="w-5 h-5 text-[#56735A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#3A3027] block text-sm">Containers, Bundles &amp; NumPy Arrays</strong>
                <span className="text-[#786B60]">
                  Recursively traverses dictionary bundles containing multiple models, scalers, and metadata schemas up to configurable depth limits.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link href="/analyze" className="btn-terracotta inline-flex items-center space-x-2 px-8 py-3.5 text-sm shadow-md">
            <span>Plant Your First Artifact</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
