export interface ArtifactMetadata {
  filename: string;
  type: string;
  size_bytes: number;
  size_formatted: string;
  python_type: string;
  module: string;
}

export interface DatasetOverview {
  rows: number;
  columns: number;
  memory_usage_bytes: number;
  memory_usage_formatted: string;
  duplicate_rows: number;
  duplicate_percentage: number;
  numerical_columns_count: number;
  categorical_columns_count: number;
  boolean_columns_count: number;
  datetime_columns_count: number;
}

export interface ColumnProfile {
  name: string;
  raw_dtype: string;
  simple_type: "numerical" | "categorical" | "datetime" | "boolean";
  unique_values: number;
  missing_values: number;
  missing_percentage: number;
  cardinality_ratio: number;
  memory_usage_bytes: number;
  memory_usage_formatted: string;
}

export interface HistogramBin {
  bin_start: number;
  bin_end: number;
  count: number;
  label: string;
}

export interface NumericalStats {
  count: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  median: number | null;
  std: number | null;
  q25: number | null;
  q75: number | null;
  iqr: number;
  skewness: number;
  kurtosis: number;
  histogram: HistogramBin[];
}

export interface CategoryFrequency {
  category: string;
  count: number;
  percentage: number;
}

export interface CategoricalStats {
  total_count: number;
  unique_categories: number;
  most_frequent: string | null;
  most_frequent_count: number;
  top_categories: CategoryFrequency[];
}

export interface CorrelationPair {
  feature_a: string;
  feature_b: string;
  correlation: number;
  abs_correlation: number;
  relationship: "positive" | "negative";
  strength: "strong" | "moderate" | "weak";
}

export interface CorrelationReport {
  matrix: Record<string, Record<string, number | null>>;
  columns: string[];
  strongest_pairs: CorrelationPair[];
}

export interface OutlierDetail {
  iqr_outlier_count: number;
  iqr_percentage: number;
  lower_bound: number | null;
  upper_bound: number | null;
  zscore_outlier_count: number;
  zscore_percentage: number;
  sample_outliers: (number | null)[];
}

export interface OutlierReport {
  total_outlier_count: number;
  columns_affected_count: number;
  details: Record<string, OutlierDetail>;
}

export interface TargetCandidate {
  column: string;
  score: number;
  reasons: string[];
  unique_values: number;
  dtype: string;
}

export interface TargetAnalysis {
  detected: boolean;
  column: string | null;
  score?: number;
  confidence?: "High" | "Moderate" | "Low";
  label_disclaimer: string;
  reasons?: string[];
  all_candidates: TargetCandidate[];
}

export interface QualityDeduction {
  rule: string;
  deduction: number;
  severity: "low" | "medium" | "high";
  detail: string;
}

export interface DataQualityReport {
  score: number;
  badge: string;
  formula_description: string;
  deductions: QualityDeduction[];
}

export interface BotanicalInsight {
  category: string;
  icon: string;
  title: string;
  content: string;
  sentiment: "positive" | "warning" | "info" | "neutral";
}

export interface ModelReport {
  model_class: string;
  library: string;
  module: string;
  estimator_type: string;
  parameters: Record<string, string>;
  fitted_attributes: {
    n_features_in?: number;
    feature_names?: string[];
    classes?: string[];
    n_outputs?: number;
    n_iterations?: number | string;
    n_estimators?: number;
  };
  evaluation_metrics?: Record<string, number | string> | null;
  evaluation_note?: string;
}

export interface PipelineStep {
  step_index: number;
  step_name: string;
  class_name: string;
  module: string;
  step_type: string;
  parameters: Record<string, string>;
}

export interface PipelineFlowchart {
  nodes: {
    id: string;
    name: string;
    class_name?: string;
    type: string;
    description: string;
  }[];
  edges: {
    from: string;
    to: string;
  }[];
}

export interface PipelineReport {
  total_steps: number;
  steps: PipelineStep[];
  final_estimator: string | null;
  flowchart: PipelineFlowchart;
}

export interface ContainerKeySummary {
  key: string;
  type: string;
  preview: string;
}

export interface ContainerReport {
  container_type: string;
  total_keys?: number;
  total_elements?: number;
  keys_summary?: ContainerKeySummary[];
  tree?: Record<string, unknown>;
  sample_elements?: string[];
}

export interface NumPyReport {
  dimensions: number;
  shape: number[];
  dtype: string;
  size: number;
  statistics?: {
    min: number | null;
    max: number | null;
    mean: number | null;
    std: number | null;
    sparsity_zero_count: number;
    sparsity_percentage: number;
  };
}

export interface BloomAnalysisResult {
  artifact: ArtifactMetadata;
  category: "dataframe" | "model" | "pipeline" | "container" | "numpy" | "generic" | "unknown";
  dataset: DatasetOverview | null;
  columns: ColumnProfile[];
  data_quality: DataQualityReport | null;
  statistics: {
    numerical: Record<string, NumericalStats>;
    categorical: Record<string, CategoricalStats>;
  } | null;
  correlations: CorrelationReport | null;
  outliers: OutlierReport | null;
  visualizations: {
    missing_values?: { column: string; missing_count: number; missing_percentage: number }[];
    correlation_matrix?: Record<string, Record<string, number | null>>;
    top_correlations?: CorrelationPair[];
  };
  target_analysis: TargetAnalysis | null;
  model: ModelReport | null;
  pipeline: PipelineReport | null;
  container: ContainerReport | null;
  numpy_info: NumPyReport | null;
  insights: BotanicalInsight[];
  errors: { message: string; traceback: string }[];
}

export interface SampleArtifact {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  size: string;
}
