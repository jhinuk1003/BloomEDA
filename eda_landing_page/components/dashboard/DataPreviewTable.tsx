"use client";

import React, { useState, useEffect } from "react";
import { getDataPreview, PreviewResponse } from "@/lib/api";
import { Table, Search, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";

interface DataPreviewTableProps {
  analysisId: string;
}

export function DataPreviewTable({ analysisId }: DataPreviewTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    let isCancelled = false;

    async function fetchTable() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDataPreview(
          analysisId,
          page,
          pageSize,
          debouncedSearch,
          sortBy,
          sortDir
        );
        if (!isCancelled) {
          setPreviewData(data);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError("Data preview not available for this artifact type or session expired.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchTable();

    return () => {
      isCancelled = true;
    };
  }, [analysisId, page, pageSize, debouncedSearch, sortBy, sortDir]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  if (error) {
    return null; // Don't show table if not applicable (e.g. pure model/numpy artifact)
  }

  return (
    <div className="botanical-card p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#7E9A82] flex items-center justify-center border border-[#E7DFD5]">
            <Table className="w-4 h-4 text-[#7E9A82]" />
          </div>
          <div>
            <h3 className="font-serif-botanical text-2xl font-bold text-[#3A3027]">
              Interactive Data Preview
            </h3>
            <span className="text-xs text-[#786B60]">
              Backend-paginated view of artifact records
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#786B60] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-[#3A3027] placeholder-[#A29488] focus:outline-none focus:border-[#C86D51]/50 transition-colors"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="relative overflow-x-auto rounded-2xl border border-[#E7DFD5] bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#C86D51]" />
          </div>
        )}

        <table className="w-full text-left text-xs text-[#3A3027]">
          <thead className="bg-[#FAF7F2] text-[11px] font-semibold text-[#786B60] uppercase tracking-wider border-b border-[#E7DFD5]">
            <tr>
              <th className="px-4 py-3 w-12 text-[#A29488]">#</th>
              {previewData?.columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 cursor-pointer hover:text-[#C86D51] transition-colors select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span className="truncate max-w-[120px]">{col}</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A29488]" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7DFD5]/60 font-mono text-[11px]">
            {previewData && previewData.rows.length > 0 ? (
              previewData.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF7F2]/80 transition-colors">
                  <td className="px-4 py-2.5 text-[#A29488] font-sans text-[10px]">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  {previewData.columns.map((col) => {
                    const val = row[col];
                    const isNull = val === null || val === undefined;
                    return (
                      <td key={col} className="px-4 py-2.5 whitespace-nowrap">
                        {isNull ? (
                          <span className="italic text-[#C86D51]/80 text-[10px] bg-[#FCEEE9] px-1.5 py-0.5 rounded">
                            null
                          </span>
                        ) : (
                          <span className="text-[#3A3027]">{String(val)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={previewData ? previewData.columns.length + 1 : 4}
                  className="px-4 py-8 text-center text-[#786B60] font-sans"
                >
                  {isLoading ? "Fetching data records..." : "No matching records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {previewData && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#786B60]">
          <div>
            Showing <span className="font-semibold text-[#3A3027]">{(page - 1) * pageSize + 1}</span> to{" "}
            <span className="font-semibold text-[#3A3027]">
              {Math.min(page * pageSize, previewData.total)}
            </span>{" "}
            of <span className="font-semibold text-[#3A3027]">{previewData.total.toLocaleString()}</span> records
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1 || isLoading}
              className="p-1.5 rounded-lg border border-[#E7DFD5] bg-white hover:bg-[#FAF7F2] text-[#3A3027] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-[#3A3027]">
              Page {page} of {previewData.total_pages}
            </span>
            <button
              onClick={() => setPage(Math.min(page + 1, previewData.total_pages))}
              disabled={page >= previewData.total_pages || isLoading}
              className="p-1.5 rounded-lg border border-[#E7DFD5] bg-white hover:bg-[#FAF7F2] text-[#3A3027] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
