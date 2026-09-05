"use client";

import React, { useState } from "react";
import { ContainerReport } from "@/types/bloomeda";
import { FolderTree, Folder, FileCode, ChevronRight, ChevronDown, Box } from "lucide-react";

export function ContainerTreeView({ container }: { container: ContainerReport | null }) {
  if (!container) return null;

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#C86D51] flex items-center justify-center border border-[#E7DFD5]">
          <FolderTree className="w-4 h-4 text-[#C86D51]" />
        </div>
        <div>
          <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
            Artifact Container &amp; Bundle Hierarchy
          </h3>
          <span className="text-xs text-[#786B60]">
            Recursive traversal of serialized dictionary / container keys
          </span>
        </div>
      </div>

      {container.keys_summary && container.keys_summary.length > 0 ? (
        <div className="space-y-2.5">
          {container.keys_summary.map((k) => (
            <div
              key={k.key}
              className="p-3.5 rounded-2xl bg-white border border-[#E7DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <Folder className="w-4 h-4 text-[#C86D51] shrink-0" />
                <span className="font-mono font-bold text-[#3A3027]">{k.key}</span>
                <span className="font-mono text-[10px] text-[#786B60] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E7DFD5]">
                  {k.type}
                </span>
              </div>
              <span className="text-[11px] text-[#786B60] font-mono truncate max-w-sm">
                {k.preview}
              </span>
            </div>
          ))}
        </div>
      ) : container.sample_elements ? (
        <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] text-xs font-mono">
          <span className="text-[#786B60] block mb-2 font-sans font-semibold">
            Serialized Elements ({container.total_elements}):
          </span>
          <div className="space-y-1">
            {container.sample_elements.map((el, i) => (
              <div key={i} className="p-2 bg-[#FAF7F2] rounded-lg truncate text-[#3A3027]">
                [{i}] {el}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
