import React from "react";
import { BloomAnalysisResult } from "@/types/bloomeda";
import { Database, Layers, Droplets, Copy, Hash, Tag, Cpu, HardDrive } from "lucide-react";

export function SummaryCards({ data }: { data: BloomAnalysisResult }) {
  const ds = data.dataset;

  if (!ds) {
    // Fallback for non-dataset artifacts (Models, Bundles, NumPy)
    if (data.model) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="botanical-card p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCEEE9] text-[#C86D51] flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#786B60] block font-medium">Model Class</span>
              <span className="font-serif-botanical text-base font-bold text-[#3A3027] truncate block max-w-[130px]">
                {data.model.model_class}
              </span>
            </div>
          </div>

          <div className="botanical-card p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3EC] text-[#56735A] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#786B60] block font-medium">Estimator Type</span>
              <span className="font-serif-botanical text-base font-bold text-[#3A3027]">
                {data.model.estimator_type}
              </span>
            </div>
          </div>

          <div className="botanical-card p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C69234] flex items-center justify-center shrink-0">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#786B60] block font-medium">Hyperparameters</span>
              <span className="font-serif-botanical text-lg font-bold text-[#3A3027]">
                {Object.keys(data.model.parameters).length}
              </span>
            </div>
          </div>

          <div className="botanical-card p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#786B60] flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#786B60] block font-medium">Artifact Size</span>
              <span className="font-serif-botanical text-lg font-bold text-[#3A3027]">
                {data.artifact.size_formatted}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (data.numpy_info) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="botanical-card p-4">
            <span className="text-[11px] text-[#786B60] block font-medium">Dimensions</span>
            <span className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              {data.numpy_info.dimensions}D Array
            </span>
          </div>
          <div className="botanical-card p-4">
            <span className="text-[11px] text-[#786B60] block font-medium">Shape</span>
            <span className="font-serif-botanical text-2xl font-bold text-[#C86D51]">
              {data.numpy_info.shape.join(" × ")}
            </span>
          </div>
          <div className="botanical-card p-4">
            <span className="text-[11px] text-[#786B60] block font-medium">Total Elements</span>
            <span className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              {data.numpy_info.size.toLocaleString()}
            </span>
          </div>
          <div className="botanical-card p-4">
            <span className="text-[11px] text-[#786B60] block font-medium">Data Type</span>
            <span className="font-serif-botanical text-2xl font-bold text-[#7E9A82]">
              {data.numpy_info.dtype}
            </span>
          </div>
        </div>
      );
    }

    return null;
  }

  // Calculate missing cell count
  const totalMissing = data.columns.reduce((acc, c) => acc + c.missing_values, 0);
  const totalCells = Math.max(ds.rows * ds.columns, 1);
  const totalMissingPct = ((totalMissing / totalCells) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
      {/* 1. Rows */}
      <div className="botanical-card p-4">
        <div className="flex items-center justify-between text-[#C86D51] mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#786B60]">Rows</span>
          <Database className="w-4 h-4 text-[#C86D51]/70" />
        </div>
        <div className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
          {ds.rows.toLocaleString()}
        </div>
        <span className="text-[10px] text-[#786B60] block mt-0.5">Records inspected</span>
      </div>

      {/* 2. Columns */}
      <div className="botanical-card p-4">
        <div className="flex items-center justify-between text-[#7E9A82] mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#786B60]">Columns</span>
          <Layers className="w-4 h-4 text-[#7E9A82]" />
        </div>
        <div className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
          {ds.columns}
        </div>
        <span className="text-[10px] text-[#786B60] block mt-0.5">{ds.memory_usage_formatted} RAM</span>
      </div>

      {/* 3. Numerical Features */}
      <div className="botanical-card p-4">
        <div className="flex items-center justify-between text-[#C69234] mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#786B60]">Numeric</span>
          <Hash className="w-4 h-4 text-[#C69234]" />
        </div>
        <div className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
          {ds.numerical_columns_count}
        </div>
        <span className="text-[10px] text-[#786B60] block mt-0.5">Continuous features</span>
      </div>

      {/* 4. Categorical Features */}
      <div className="botanical-card p-4">
        <div className="flex items-center justify-between text-[#C98474] mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#786B60]">Categorical</span>
          <Tag className="w-4 h-4 text-[#C98474]" />
        </div>
        <div className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
          {ds.categorical_columns_count}
        </div>
        <span className="text-[10px] text-[#786B60] block mt-0.5">Discrete factors</span>
      </div>

      {/* 5. Missing Values */}
      <div className="botanical-card p-4">
        <div className="flex items-center justify-between text-[#56735A] mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#786B60]">Missing</span>
          <Droplets className="w-4 h-4 text-[#56735A]" />
        </div>
        <div className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
          {totalMissingPct}%
        </div>
        <span className="text-[10px] text-[#786B60] block mt-0.5">{totalMissing} missing cells</span>
      </div>

      {/* 6. Duplicate Rows */}
      <div className="botanical-card p-4">
        <div className="flex items-center justify-between text-[#C86D51] mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#786B60]">Duplicates</span>
          <Copy className="w-4 h-4 text-[#C86D51]/70" />
        </div>
        <div className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
          {ds.duplicate_rows}
        </div>
        <span className="text-[10px] text-[#786B60] block mt-0.5">{ds.duplicate_percentage}% duplicate</span>
      </div>
    </div>
  );
}
