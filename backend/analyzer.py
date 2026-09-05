"""
BloomEDA Analysis Engine
Extracts deep exploratory statistics, machine learning metadata, pipeline architectures,
data quality scoring, and automated botanical insights from arbitrary Python objects.
"""

import math
import traceback
from typing import Any, Dict, List, Optional, Tuple, Union
import numpy as np
import pandas as pd

# Safe Scikit-learn imports
try:
    import sklearn
    from sklearn.base import BaseEstimator, ClassifierMixin, RegressorMixin, ClusterMixin, TransformerMixin
    from sklearn.pipeline import Pipeline
    from sklearn.compose import ColumnTransformer
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

try:
    from scipy import stats
    HAS_SCIPY = True
except ImportError:
    HAS_SCIPY = False


def format_bytes(size_bytes: int) -> str:
    if size_bytes == 0:
        return "0 B"
    units = ["B", "KB", "MB", "GB"]
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {units[i]}"


def safe_float(val: Any) -> Optional[float]:
    """Safely cast numpy/pandas floats to python float or None if NaN/Inf."""
    if val is None:
        return None
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return None
        return round(f, 4)
    except (ValueError, TypeError):
        return None


class ArtifactAnalyzer:
    def __init__(self, filename: str = "artifact.pkl", file_size: int = 0):
        self.filename = filename
        self.file_size = file_size

    def analyze(self, obj: Any) -> Dict[str, Any]:
        """Main analysis entrypoint."""
        obj_type_str = f"{type(obj).__module__}.{type(obj).__name__}"
        
        result: Dict[str, Any] = {
            "artifact": {
                "filename": self.filename,
                "type": obj_type_str,
                "size_bytes": self.file_size,
                "size_formatted": format_bytes(self.file_size),
                "python_type": type(obj).__name__,
                "module": getattr(type(obj), "__module__", "builtins"),
            },
            "category": "unknown",
            "dataset": None,
            "columns": [],
            "data_quality": None,
            "statistics": None,
            "correlations": None,
            "outliers": None,
            "visualizations": {},
            "target_analysis": None,
            "model": None,
            "pipeline": None,
            "container": None,
            "numpy_info": None,
            "insights": [],
            "errors": []
        }

        try:
            # 1. Check if DataFrame or Series
            if isinstance(obj, pd.DataFrame):
                result["category"] = "dataframe"
                self._analyze_dataframe(obj, result)
            elif isinstance(obj, pd.Series):
                result["category"] = "dataframe"
                df = obj.to_frame()
                self._analyze_dataframe(df, result)
            # 2. Check if Pipeline
            elif HAS_SKLEARN and isinstance(obj, Pipeline):
                result["category"] = "pipeline"
                self._analyze_pipeline(obj, result)
            # 3. Check if ML Estimator
            elif HAS_SKLEARN and isinstance(obj, BaseEstimator):
                result["category"] = "model"
                self._analyze_model(obj, result)
            # 4. Check if NumPy Array
            elif isinstance(obj, np.ndarray):
                result["category"] = "numpy"
                self._analyze_numpy(obj, result)
            # 5. Check if Dictionary / Container / Bundle
            elif isinstance(obj, dict):
                result["category"] = "container"
                self._analyze_container(obj, result)
            elif isinstance(obj, (list, tuple)):
                result["category"] = "container"
                self._analyze_list(obj, result)
            else:
                # Custom or generic object
                result["category"] = "generic"
                self._analyze_generic_object(obj, result)

        except Exception as e:
            result["errors"].append({
                "message": f"Encountered non-fatal error during analysis: {str(e)}",
                "traceback": traceback.format_exc()
            })

        return result

    # -------------------------------------------------------------------------
    # DATAFRAME ANALYSIS
    # -------------------------------------------------------------------------
    def _analyze_dataframe(self, df: pd.DataFrame, result: Dict[str, Any]) -> None:
        rows, cols = df.shape
        mem_usage = int(df.memory_usage(deep=True).sum())
        duplicates_count = int(df.duplicated().sum())
        duplicate_pct = round((duplicates_count / rows * 100), 2) if rows > 0 else 0.0

        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        cat_cols = df.select_dtypes(include=['object', 'category', 'string']).columns.tolist()
        bool_cols = df.select_dtypes(include=['bool', 'boolean']).columns.tolist()
        dt_cols = df.select_dtypes(include=['datetime', 'datetimetz']).columns.tolist()

        result["dataset"] = {
            "rows": rows,
            "columns": cols,
            "memory_usage_bytes": mem_usage,
            "memory_usage_formatted": format_bytes(mem_usage),
            "duplicate_rows": duplicates_count,
            "duplicate_percentage": duplicate_pct,
            "numerical_columns_count": len(num_cols),
            "categorical_columns_count": len(cat_cols),
            "boolean_columns_count": len(bool_cols),
            "datetime_columns_count": len(dt_cols),
        }

        # Columns Profiles
        columns_info = []
        col_missing_summary = []
        total_missing_cells = 0

        for col in df.columns:
            series = df[col]
            null_count = int(series.isna().sum())
            total_missing_cells += null_count
            null_pct = round((null_count / rows * 100), 2) if rows > 0 else 0.0
            unique_count = int(series.nunique(dropna=True))
            cardinality_ratio = round(unique_count / rows, 4) if rows > 0 else 0.0
            col_mem = int(series.memory_usage(deep=True))

            # Determine simplified type
            if pd.api.types.is_numeric_dtype(series):
                col_type = "numerical"
            elif pd.api.types.is_datetime64_any_dtype(series):
                col_type = "datetime"
            elif pd.api.types.is_bool_dtype(series):
                col_type = "boolean"
            else:
                col_type = "categorical"

            c_info = {
                "name": str(col),
                "raw_dtype": str(series.dtype),
                "simple_type": col_type,
                "unique_values": unique_count,
                "missing_values": null_count,
                "missing_percentage": null_pct,
                "cardinality_ratio": cardinality_ratio,
                "memory_usage_bytes": col_mem,
                "memory_usage_formatted": format_bytes(col_mem),
            }
            columns_info.append(c_info)

            if null_count > 0:
                col_missing_summary.append({
                    "column": str(col),
                    "missing_count": null_count,
                    "missing_percentage": null_pct
                })

        result["columns"] = columns_info

        # Numerical Analysis
        numerical_stats = {}
        for col in num_cols:
            clean_s = df[col].dropna()
            if len(clean_s) == 0:
                continue
            
            c_min = safe_float(clean_s.min())
            c_max = safe_float(clean_s.max())
            c_mean = safe_float(clean_s.mean())
            c_median = safe_float(clean_s.median())
            c_std = safe_float(clean_s.std())
            c_q25 = safe_float(clean_s.quantile(0.25))
            c_q75 = safe_float(clean_s.quantile(0.75))
            
            iqr = round(c_q75 - c_q25, 4) if (c_q75 is not None and c_q25 is not None) else 0.0
            
            # Skewness and Kurtosis
            skew = safe_float(clean_s.skew()) if len(clean_s) > 2 else 0.0
            kurt = safe_float(clean_s.kurt()) if len(clean_s) > 3 else 0.0

            # Histogram Bins (10 bins for visualization)
            hist_data = []
            try:
                counts, bin_edges = np.histogram(clean_s, bins=10)
                for i in range(len(counts)):
                    hist_data.append({
                        "bin_start": round(float(bin_edges[i]), 2),
                        "bin_end": round(float(bin_edges[i+1]), 2),
                        "count": int(counts[i]),
                        "label": f"{round(float(bin_edges[i]), 1)}-{round(float(bin_edges[i+1]), 1)}"
                    })
            except Exception:
                pass

            numerical_stats[str(col)] = {
                "count": len(clean_s),
                "min": c_min,
                "max": c_max,
                "mean": c_mean,
                "median": c_median,
                "std": c_std,
                "q25": c_q25,
                "q75": c_q75,
                "iqr": iqr,
                "skewness": skew,
                "kurtosis": kurt,
                "histogram": hist_data
            }

        # Categorical Analysis
        categorical_stats = {}
        for col in cat_cols + bool_cols:
            s = df[col].dropna().astype(str)
            if len(s) == 0:
                continue
            val_counts = s.value_counts().head(10)
            top_categories = []
            for cat, count in val_counts.items():
                top_categories.append({
                    "category": str(cat),
                    "count": int(count),
                    "percentage": round(int(count) / len(s) * 100, 2)
                })

            categorical_stats[str(col)] = {
                "total_count": len(s),
                "unique_categories": int(s.nunique()),
                "most_frequent": str(val_counts.index[0]) if len(val_counts) > 0 else None,
                "most_frequent_count": int(val_counts.iloc[0]) if len(val_counts) > 0 else 0,
                "top_categories": top_categories
            }

        result["statistics"] = {
            "numerical": numerical_stats,
            "categorical": categorical_stats
        }

        # Outlier Detection (IQR and Z-score)
        outlier_report = self._calculate_outliers(df, num_cols)
        result["outliers"] = outlier_report

        # Correlation Matrix
        correlations_report = self._calculate_correlations(df, num_cols)
        result["correlations"] = correlations_report

        # Target Column Detection Heuristic
        target_heuristic = self._detect_target_column(df, num_cols, cat_cols, bool_cols)
        result["target_analysis"] = target_heuristic

        # Data Quality Score
        data_quality = self._calculate_data_quality(
            rows=rows,
            cols=cols,
            total_missing_cells=total_missing_cells,
            duplicates_count=duplicates_count,
            outliers_report=outlier_report,
            columns_info=columns_info
        )
        result["data_quality"] = data_quality

        # Visualizations package
        result["visualizations"] = {
            "missing_values": sorted(col_missing_summary, key=lambda x: x["missing_percentage"], reverse=True),
            "correlation_matrix": correlations_report.get("matrix", {}),
            "top_correlations": correlations_report.get("strongest_pairs", [])
        }

        # Generate Automated Botanical Insights
        result["insights"] = self._generate_dataframe_insights(
            df=df,
            dataset=result["dataset"],
            columns=columns_info,
            data_quality=data_quality,
            num_stats=numerical_stats,
            correlations=correlations_report,
            outliers=outlier_report,
            target=target_heuristic
        )

    def _calculate_outliers(self, df: pd.DataFrame, num_cols: List[str]) -> Dict[str, Any]:
        report = {
            "total_outlier_count": 0,
            "columns_affected_count": 0,
            "details": {}
        }
        for col in num_cols:
            s = df[col].dropna()
            if len(s) < 4:
                continue

            q25 = s.quantile(0.25)
            q75 = s.quantile(0.75)
            iqr = q75 - q25
            lower_bound = q25 - 1.5 * iqr
            upper_bound = q75 + 1.5 * iqr

            iqr_outliers = s[(s < lower_bound) | (s > upper_bound)]
            iqr_count = len(iqr_outliers)

            # Z-score method
            std = s.std()
            z_count = 0
            if std > 0:
                mean = s.mean()
                z_scores = np.abs((s - mean) / std)
                z_count = int((z_scores > 3.0).sum())

            if iqr_count > 0 or z_count > 0:
                report["columns_affected_count"] += 1
                report["total_outlier_count"] += iqr_count
                report["details"][str(col)] = {
                    "iqr_outlier_count": iqr_count,
                    "iqr_percentage": round(iqr_count / len(s) * 100, 2),
                    "lower_bound": safe_float(lower_bound),
                    "upper_bound": safe_float(upper_bound),
                    "zscore_outlier_count": z_count,
                    "zscore_percentage": round(z_count / len(s) * 100, 2),
                    "sample_outliers": [safe_float(x) for x in iqr_outliers.head(5).tolist()]
                }
        return report

    def _calculate_correlations(self, df: pd.DataFrame, num_cols: List[str]) -> Dict[str, Any]:
        if len(num_cols) < 2:
            return {"matrix": {}, "strongest_pairs": [], "columns": []}

        # Cap to top 15 numeric columns if large
        selected_cols = num_cols[:15]
        subset_df = df[selected_cols].dropna()

        if len(subset_df) < 3:
            return {"matrix": {}, "strongest_pairs": [], "columns": selected_cols}

        corr_df = subset_df.corr(method="pearson")
        matrix_dict = {}
        for c1 in selected_cols:
            matrix_dict[str(c1)] = {}
            for c2 in selected_cols:
                val = safe_float(corr_df.loc[c1, c2])
                matrix_dict[str(c1)][str(c2)] = val

        pairs = []
        for i in range(len(selected_cols)):
            for j in range(i + 1, len(selected_cols)):
                c1 = selected_cols[i]
                c2 = selected_cols[j]
                val = safe_float(corr_df.loc[c1, c2])
                if val is not None:
                    pairs.append({
                        "feature_a": str(c1),
                        "feature_b": str(c2),
                        "correlation": val,
                        "abs_correlation": abs(val),
                        "relationship": "positive" if val > 0 else "negative",
                        "strength": "strong" if abs(val) >= 0.7 else ("moderate" if abs(val) >= 0.4 else "weak")
                    })

        pairs.sort(key=lambda x: x["abs_correlation"], reverse=True)

        return {
            "matrix": matrix_dict,
            "columns": selected_cols,
            "strongest_pairs": pairs[:10]
        }

    def _detect_target_column(self, df: pd.DataFrame, num_cols: List[str], cat_cols: List[str], bool_cols: List[str]) -> Dict[str, Any]:
        heuristic_names = ["target", "label", "class", "y", "churn", "outcome", "diagnosis", "price", "sales", "status", "default", "is_", "survived", "bought"]
        
        candidates = []
        for col in df.columns:
            name_lower = str(col).lower()
            score = 0
            reason = []

            for h in heuristic_names:
                if h == name_lower:
                    score += 50
                    reason.append(f"Exact match with keyword '{h}'")
                    break
                elif len(h) > 1 and h in name_lower:
                    score += 25
                    reason.append(f"Contains keyword '{h}'")
                    break

            # If it is the last column, slight bonus
            if col == df.columns[-1]:
                score += 15
                reason.append("Located as final column in dataset")

            # If binary or low cardinality
            n_unique = df[col].nunique()
            if n_unique == 2:
                score += 20
                reason.append("Binary feature (2 unique classes)")
            elif 2 < n_unique <= 10 and col in cat_cols:
                score += 10
                reason.append(f"Categorical with {n_unique} classes")

            if score > 0:
                candidates.append({
                    "column": str(col),
                    "score": score,
                    "reasons": reason,
                    "unique_values": n_unique,
                    "dtype": str(df[col].dtype)
                })

        candidates.sort(key=lambda x: x["score"], reverse=True)

        if candidates and candidates[0]["score"] >= 25:
            top = candidates[0]
            return {
                "detected": True,
                "column": top["column"],
                "score": top["score"],
                "confidence": "High" if top["score"] >= 50 else "Moderate",
                "label_disclaimer": "Likely target — heuristic",
                "reasons": top["reasons"],
                "all_candidates": candidates[:4]
            }
        else:
            return {
                "detected": False,
                "column": None,
                "label_disclaimer": "No unambiguous target identified automatically",
                "all_candidates": candidates[:4]
            }

    def _calculate_data_quality(self, rows: int, cols: int, total_missing_cells: int, duplicates_count: int, outliers_report: Dict[str, Any], columns_info: List[Dict[str, Any]]) -> Dict[str, Any]:
        score = 100.0
        deductions = []

        total_cells = max(rows * cols, 1)
        missing_pct = (total_missing_cells / total_cells) * 100

        # Missing deduction (up to 30 points)
        if missing_pct > 0:
            d_missing = min(round(missing_pct * 1.5, 1), 30.0)
            score -= d_missing
            deductions.append({
                "rule": "Missing Values",
                "deduction": -d_missing,
                "severity": "high" if d_missing > 15 else "medium",
                "detail": f"{round(missing_pct, 2)}% of all data cells are missing ({total_missing_cells} cells)."
            })

        # Duplicate rows deduction (up to 25 points)
        if rows > 0 and duplicates_count > 0:
            dup_pct = (duplicates_count / rows) * 100
            d_dup = min(round(dup_pct * 1.2, 1), 25.0)
            score -= d_dup
            deductions.append({
                "rule": "Duplicate Records",
                "deduction": -d_dup,
                "severity": "high" if d_dup > 10 else "low",
                "detail": f"{round(dup_pct, 2)}% duplicate rows detected ({duplicates_count} rows)."
            })

        # Outlier deduction (up to 20 points)
        outlier_count = outliers_report.get("total_outlier_count", 0)
        affected_cols = outliers_report.get("columns_affected_count", 0)
        if outlier_count > 0 and rows > 0:
            outlier_pct = (outlier_count / max(rows * max(len(columns_info), 1), 1)) * 100
            d_outlier = min(round(outlier_pct * 2.0 + (affected_cols * 1.5), 1), 20.0)
            score -= d_outlier
            deductions.append({
                "rule": "Statistical Outliers",
                "deduction": -d_outlier,
                "severity": "medium",
                "detail": f"{affected_cols} numerical features exhibit IQR outliers ({outlier_count} instances)."
            })

        # Constant or single value columns (-5 per column)
        constant_cols = [c["name"] for c in columns_info if c["unique_values"] <= 1]
        if constant_cols:
            d_const = len(constant_cols) * 5.0
            score -= d_const
            deductions.append({
                "rule": "Constant Features",
                "deduction": -d_const,
                "severity": "medium",
                "detail": f"{len(constant_cols)} features contain only 1 unique value ({', '.join(constant_cols[:3])})."
            })

        final_score = max(int(round(score)), 0)

        badge = "Flourishing"
        if final_score < 50:
            badge = "Wilted (Needs Pruning)"
        elif final_score < 75:
            badge = "Budding (Moderate Quality)"
        elif final_score < 90:
            badge = "Thriving"
        else:
            badge = "Pristine Flora"

        return {
            "score": final_score,
            "badge": badge,
            "formula_description": "Starts at 100 points, penalizing missing values, duplicate rows, statistical outliers, and constant features.",
            "deductions": deductions
        }

    def _generate_dataframe_insights(self, df: pd.DataFrame, dataset: Dict[str, Any], columns: List[Dict[str, Any]], data_quality: Dict[str, Any], num_stats: Dict[str, Any], correlations: Dict[str, Any], outliers: Dict[str, Any], target: Dict[str, Any]) -> List[Dict[str, Any]]:
        insights = []

        # 1. Dataset Dimensions & Composition Insight
        insights.append({
            "category": "Structure",
            "icon": "Layers",
            "title": "Dataset Botanical Composition",
            "content": f"The artifact contains {dataset['rows']:,} rows across {dataset['columns']} features ({dataset['numerical_columns_count']} numerical, {dataset['categorical_columns_count']} categorical, {dataset['boolean_columns_count']} boolean), occupying {dataset['memory_usage_formatted']} in memory.",
            "sentiment": "neutral"
        })

        # 2. Missing Values Insight
        high_missing = [c for c in columns if c["missing_percentage"] > 10.0]
        if high_missing:
            highest = max(high_missing, key=lambda x: x["missing_percentage"])
            insights.append({
                "category": "Data Quality",
                "icon": "Droplets",
                "title": "Substantial Missingness Alert",
                "content": f"{len(high_missing)} features have over 10% missing values. Specifically, '{highest['name']}' has {highest['missing_percentage']}% missing values ({highest['missing_values']:,} missing cells). Imputation or removal may be required.",
                "sentiment": "warning"
            })
        else:
            insights.append({
                "category": "Data Quality",
                "icon": "Sparkles",
                "title": "High Data Completeness",
                "content": "Minimal to zero missing values detected across the dataset features.",
                "sentiment": "positive"
            })

        # 3. Duplicate Rows
        if dataset["duplicate_rows"] > 0:
            insights.append({
                "category": "Integrity",
                "icon": "Copy",
                "title": "Duplicate Records Present",
                "content": f"Found {dataset['duplicate_rows']:,} exact duplicate rows ({dataset['duplicate_percentage']}% of the dataset). Consider deduplicating prior to model training.",
                "sentiment": "warning"
            })

        # 4. Correlation Insights
        strong_pairs = correlations.get("strongest_pairs", [])
        if strong_pairs:
            top_pair = strong_pairs[0]
            if top_pair["abs_correlation"] >= 0.7:
                insights.append({
                    "category": "Correlation",
                    "icon": "GitFork",
                    "title": f"Strong {'Positive' if top_pair['relationship'] == 'positive' else 'Negative'} Relationship",
                    "content": f"Features '{top_pair['feature_a']}' and '{top_pair['feature_b']}' show a {top_pair['strength']} linear relationship (r = {top_pair['correlation']}). (Note: correlation indicates mathematical association, not causation).",
                    "sentiment": "info"
                })

        # 5. Outlier Insights
        if outliers.get("columns_affected_count", 0) > 0:
            outlier_details = outliers.get("details", {})
            most_outlier_col = max(outlier_details.items(), key=lambda item: item[1]["iqr_percentage"])
            insights.append({
                "category": "Outliers",
                "icon": "AlertTriangle",
                "title": "Statistical Outliers Identified",
                "content": f"Feature '{most_outlier_col[0]}' contains {most_outlier_col[1]['iqr_percentage']}% potential outliers via the 1.5×IQR boundary ({most_outlier_col[1]['iqr_outlier_count']} records).",
                "sentiment": "warning"
            })

        # 6. Cardinality Alert
        high_card_cats = [c for c in columns if c["simple_type"] == "categorical" and c["cardinality_ratio"] > 0.6 and dataset["rows"] > 30]
        if high_card_cats:
            col_name = high_card_cats[0]["name"]
            insights.append({
                "category": "Cardinality",
                "icon": "Key",
                "title": "High Cardinality Categorical Feature",
                "content": f"Column '{col_name}' has high cardinality with {high_card_cats[0]['unique_values']} unique values ({round(high_card_cats[0]['cardinality_ratio']*100, 1)}% unique ratio). It may represent an ID, uuid, or free-text column.",
                "sentiment": "info"
            })

        # 7. Target Column Heuristic
        if target.get("detected"):
            insights.append({
                "category": "Target",
                "icon": "Target",
                "title": f"Target Column Detected: '{target['column']}'",
                "content": f"Heuristic analysis suggests '{target['column']}' as a likely predictive target based on: {'; '.join(target['reasons'])}. (Status: {target['label_disclaimer']}).",
                "sentiment": "positive"
            })

        return insights

    # -------------------------------------------------------------------------
    # MACHINE LEARNING MODEL ANALYSIS
    # -------------------------------------------------------------------------
    def _analyze_model(self, model: Any, result: Dict[str, Any]) -> None:
        model_name = type(model).__name__
        module_name = getattr(type(model), "__module__", "sklearn")
        
        # Determine estimator type
        est_type = "Estimator"
        if HAS_SKLEARN:
            if isinstance(model, ClassifierMixin):
                est_type = "Classifier"
            elif isinstance(model, RegressorMixin):
                est_type = "Regressor"
            elif isinstance(model, ClusterMixin):
                est_type = "Clusterer"
            elif isinstance(model, TransformerMixin):
                est_type = "Transformer"

        # Safe parameter extraction
        params = {}
        if hasattr(model, "get_params"):
            try:
                raw_params = model.get_params(deep=False)
                for k, v in raw_params.items():
                    params[str(k)] = str(v)
            except Exception:
                pass

        # Introspect fitted attributes
        fitted_attrs = {}
        n_features = getattr(model, "n_features_in_", None)
        feature_names = getattr(model, "feature_names_in_", None)
        classes = getattr(model, "classes_", None)
        n_outputs = getattr(model, "n_outputs_", None)
        n_iter = getattr(model, "n_iter_", None)

        if n_features is not None:
            fitted_attrs["n_features_in"] = int(n_features)
        if feature_names is not None:
            fitted_attrs["feature_names"] = [str(f) for f in feature_names][:50]
        if classes is not None:
            fitted_attrs["classes"] = [str(c) for c in classes]
        if n_outputs is not None:
            fitted_attrs["n_outputs"] = int(n_outputs)
        if n_iter is not None:
            fitted_attrs["n_iterations"] = int(n_iter) if isinstance(n_iter, (int, np.integer)) else str(n_iter)

        # Tree-specific metadata
        if hasattr(model, "estimators_"):
            try:
                fitted_attrs["n_estimators"] = len(model.estimators_)
            except Exception:
                pass

        # Check for embedded evaluation metrics
        eval_metrics = getattr(model, "metrics_", getattr(model, "eval_metrics_", None))
        metrics_display = None
        if eval_metrics and isinstance(eval_metrics, dict):
            metrics_display = {str(k): safe_float(v) or str(v) for k, v in eval_metrics.items()}

        result["model"] = {
            "model_class": model_name,
            "library": module_name.split(".")[0],
            "module": module_name,
            "estimator_type": est_type,
            "parameters": params,
            "fitted_attributes": fitted_attrs,
            "evaluation_metrics": metrics_display,
            "evaluation_note": "No evaluation metrics were stored in this artifact." if not metrics_display else "Artifact contains embedded evaluation metrics."
        }

        # Insights for Model
        insights = [
            {
                "category": "Model Architecture",
                "icon": "Cpu",
                "title": f"Trained {model_name} Detected",
                "content": f"The artifact stores a trained scikit-learn {est_type} ({model_name}). It has {len(params)} configured hyperparameters.",
                "sentiment": "positive"
            }
        ]
        if fitted_attrs.get("feature_names"):
            insights.append({
                "category": "Features",
                "icon": "List",
                "title": "Embedded Feature Schema",
                "content": f"Model expects {fitted_attrs.get('n_features_in', len(fitted_attrs['feature_names']))} features. Input names: {', '.join(fitted_attrs['feature_names'][:5])}...",
                "sentiment": "info"
            })
        if fitted_attrs.get("classes"):
            insights.append({
                "category": "Classes",
                "icon": "Tag",
                "title": "Target Classification Classes",
                "content": f"Classifier was fitted on {len(fitted_attrs['classes'])} classes: {', '.join(fitted_attrs['classes'])}.",
                "sentiment": "info"
            })

        result["insights"] = insights

    # -------------------------------------------------------------------------
    # PIPELINE ANALYSIS
    # -------------------------------------------------------------------------
    def _analyze_pipeline(self, pipeline: Pipeline, result: Dict[str, Any]) -> None:
        steps_info = []
        nodes = []
        edges = []

        nodes.append({
            "id": "input_data",
            "name": "Raw Artifact Input",
            "type": "input",
            "description": "User features entering pipeline"
        })

        prev_node_id = "input_data"

        for idx, (step_name, transformer) in enumerate(pipeline.steps):
            node_id = f"step_{idx}_{step_name}"
            t_class = type(transformer).__name__
            t_module = getattr(type(transformer), "__module__", "sklearn")
            
            # Introspect transformer
            params = {}
            if hasattr(transformer, "get_params"):
                try:
                    raw_params = transformer.get_params(deep=False)
                    for k, v in list(raw_params.items())[:8]:
                        params[str(k)] = str(v)
                except Exception:
                    pass

            is_last = (idx == len(pipeline.steps) - 1)
            step_type = "estimator" if is_last else "transformer"
            if isinstance(transformer, ColumnTransformer):
                step_type = "column_transformer"

            step_data = {
                "step_index": idx,
                "step_name": str(step_name),
                "class_name": t_class,
                "module": t_module,
                "step_type": step_type,
                "parameters": params
            }
            steps_info.append(step_data)

            nodes.append({
                "id": node_id,
                "name": str(step_name),
                "class_name": t_class,
                "type": step_type,
                "description": f"{t_class} ({t_module})"
            })

            edges.append({
                "from": prev_node_id,
                "to": node_id
            })
            prev_node_id = node_id

        final_estimator = pipeline.steps[-1][1] if pipeline.steps else None
        
        result["pipeline"] = {
            "total_steps": len(pipeline.steps),
            "steps": steps_info,
            "final_estimator": type(final_estimator).__name__ if final_estimator else None,
            "flowchart": {
                "nodes": nodes,
                "edges": edges
            }
        }

        # Also populate model section for final estimator
        if final_estimator:
            self._analyze_model(final_estimator, result)
            # Re-tag category to pipeline
            result["category"] = "pipeline"

        result["insights"] = [
            {
                "category": "Pipeline",
                "icon": "GitCommit",
                "title": f"Sklearn Pipeline ({len(pipeline.steps)} stages)",
                "content": f"Pipeline chains {len(pipeline.steps) - 1} preprocessing transformers culminating in a final estimator: {type(final_estimator).__name__}.",
                "sentiment": "positive"
            }
        ]

    # -------------------------------------------------------------------------
    # CONTAINER / DICTIONARY / BUNDLE ANALYSIS
    # -------------------------------------------------------------------------
    def _analyze_container(self, d: Dict[Any, Any], result: Dict[str, Any], max_depth: int = 4) -> None:
        tree = self._traverse_dict(d, current_depth=1, max_depth=max_depth)
        
        keys_summary = []
        contained_model = None
        contained_pipeline = None

        for k, v in d.items():
            key_str = str(k)
            val_type = f"{type(v).__module__}.{type(v).__name__}"
            keys_summary.append({
                "key": key_str,
                "type": val_type,
                "preview": str(v)[:80]
            })

            if HAS_SKLEARN and isinstance(v, Pipeline) and not contained_pipeline:
                contained_pipeline = v
            elif HAS_SKLEARN and isinstance(v, BaseEstimator) and not contained_model:
                contained_model = v

        result["container"] = {
            "container_type": "dictionary_bundle",
            "total_keys": len(d),
            "keys_summary": keys_summary,
            "tree": tree
        }

        if contained_pipeline:
            self._analyze_pipeline(contained_pipeline, result)
            result["category"] = "container"
        elif contained_model:
            self._analyze_model(contained_model, result)
            result["category"] = "container"

        result["insights"].append({
            "category": "Container",
            "icon": "FolderTree",
            "title": "Machine Learning Artifact Bundle",
            "content": f"This artifact is an ML Container/Dictionary bundle with {len(d)} primary keys ({', '.join([str(k) for k in list(d.keys())[:5]])}).",
            "sentiment": "info"
        })

    def _traverse_dict(self, d: Any, current_depth: int, max_depth: int) -> Any:
        if current_depth > max_depth:
            return f"<Max depth {max_depth} reached: {type(d).__name__}>"

        if isinstance(d, dict):
            res = {}
            for k, v in list(d.items())[:20]:
                res[str(k)] = self._traverse_dict(v, current_depth + 1, max_depth)
            return res
        elif isinstance(d, (list, tuple)):
            return [
                self._traverse_dict(item, current_depth + 1, max_depth)
                for item in d[:10]
            ]
        elif isinstance(d, (int, float, str, bool)) or d is None:
            return d
        else:
            return f"<{type(d).__module__}.{type(d).__name__}>"

    def _analyze_list(self, lst: Union[List[Any], Tuple[Any, ...]], result: Dict[str, Any]) -> None:
        result["container"] = {
            "container_type": type(lst).__name__,
            "total_elements": len(lst),
            "sample_elements": [str(x)[:100] for x in lst[:10]]
        }
        result["insights"].append({
            "category": "Container",
            "icon": "List",
            "title": f"Serialized Python {type(lst).__name__}",
            "content": f"Contains {len(lst)} serialized elements.",
            "sentiment": "info"
        })

    # -------------------------------------------------------------------------
    # NUMPY ARRAY ANALYSIS
    # -------------------------------------------------------------------------
    def _analyze_numpy(self, arr: np.ndarray, result: Dict[str, Any]) -> None:
        shape = list(arr.shape)
        dtype_str = str(arr.dtype)
        total_elements = int(arr.size)
        n_dim = int(arr.ndim)

        stats_data = {}
        if np.issubdtype(arr.dtype, np.number) and total_elements > 0:
            flat = arr.flatten()
            clean_flat = flat[~np.isnan(flat)] if np.issubdtype(arr.dtype, np.floating) else flat
            if len(clean_flat) > 0:
                stats_data = {
                    "min": safe_float(np.min(clean_flat)),
                    "max": safe_float(np.max(clean_flat)),
                    "mean": safe_float(np.mean(clean_flat)),
                    "std": safe_float(np.std(clean_flat)),
                    "sparsity_zero_count": int(np.count_nonzero(arr == 0)),
                    "sparsity_percentage": round(int(np.count_nonzero(arr == 0)) / total_elements * 100, 2)
                }

        result["numpy_info"] = {
            "dimensions": n_dim,
            "shape": shape,
            "dtype": dtype_str,
            "size": total_elements,
            "statistics": stats_data
        }

        result["insights"] = [
            {
                "category": "NumPy",
                "icon": "Grid",
                "title": f"{n_dim}D NumPy Array ({' × '.join(map(str, shape))})",
                "content": f"Array contains {total_elements:,} elements of type '{dtype_str}'.",
                "sentiment": "info"
            }
        ]

    # -------------------------------------------------------------------------
    # GENERIC OBJECT INTROSPECTION
    # -------------------------------------------------------------------------
    def _analyze_generic_object(self, obj: Any, result: Dict[str, Any]) -> None:
        attrs = []
        for attr_name in dir(obj):
            if not attr_name.startswith("__"):
                try:
                    val = getattr(obj, attr_name)
                    if not callable(val):
                        attrs.append({
                            "attribute": attr_name,
                            "type": type(val).__name__,
                            "value_preview": str(val)[:60]
                        })
                except Exception:
                    pass

        result["insights"].append({
            "category": "Object",
            "icon": "Box",
            "title": f"Custom Python Object: {type(obj).__name__}",
            "content": f"Object defined in module '{type(obj).__module__}'. Safe introspection extracted {len(attrs)} public attributes.",
            "sentiment": "info"
        })
