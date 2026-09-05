import { BloomAnalysisResult, SampleArtifact } from "@/types/bloomeda";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function uploadArtifact(file: File): Promise<{ analysis_id: string; filename: string; size_bytes: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to upload pickle artifact.");
  }

  return res.json();
}

export async function startAnalysis(analysisId: string): Promise<{ status: string; analysis_id: string }> {
  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis_id: analysisId }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to trigger analysis.");
  }

  return res.json();
}

export interface StatusResponse {
  analysis_id: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  stage_message: string;
  error?: string | null;
  error_type?: string | null;
  technical_details?: string | null;
}

export async function getAnalysisStatus(analysisId: string): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE_URL}/api/analysis/${analysisId}/status`);
  if (!res.ok) {
    throw new Error("Could not check analysis status.");
  }
  return res.json();
}

export async function getAnalysisResult(analysisId: string): Promise<BloomAnalysisResult> {
  const res = await fetch(`${API_BASE_URL}/api/analysis/${analysisId}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Could not retrieve analysis result.");
  }
  const data = await res.json();
  return data.data;
}

export interface PreviewResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  columns: string[];
  rows: Record<string, unknown>[];
}

export async function getDataPreview(
  analysisId: string,
  page: number = 1,
  pageSize: number = 15,
  search: string = "",
  sortBy?: string,
  sortDir: string = "asc"
): Promise<PreviewResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    search: search,
    sort_dir: sortDir,
  });
  if (sortBy) params.append("sort_by", sortBy);

  const res = await fetch(`${API_BASE_URL}/api/analysis/${analysisId}/preview?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data preview.");
  }
  return res.json();
}

export async function getSamples(): Promise<SampleArtifact[]> {
  const res = await fetch(`${API_BASE_URL}/api/samples`);
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.samples || [];
}

export async function loadSample(sampleId: string): Promise<{ analysis_id: string; filename: string }> {
  const res = await fetch(`${API_BASE_URL}/api/samples/load/${sampleId}`, {
    method: "POST",
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to load sample artifact.");
  }

  return res.json();
}

export function getExportUrl(analysisId: string, format: "json" | "csv"): string {
  return `${API_BASE_URL}/api/analysis/${analysisId}/export/${format}`;
}

export function getSampleDownloadUrl(sampleId: string): string {
  return `${API_BASE_URL}/api/samples/download/${sampleId}`;
}
