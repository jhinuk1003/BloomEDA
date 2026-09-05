"""
Sample Artifact Generator for BloomEDA
Generates 4 realistic demo pickle files for immediate user evaluation:
1. customer_churn_dataframe.pkl (DataFrame with missing values, outliers, correlations, target)
2. churn_rf_pipeline.pkl (Full scikit-learn Pipeline with ColumnTransformer and RandomForestClassifier)
3. trained_model_bundle.pkl (Python dictionary bundle with model, scaler, metadata, metrics)
4. sensor_embeddings_numpy.pkl (2D NumPy array of embeddings)
"""

import os
import pickle
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


def generate_samples(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    np.random.seed(42)
    n_samples = 1000

    # -------------------------------------------------------------
    # 1. Customer Churn DataFrame
    # -------------------------------------------------------------
    print("Generating customer_churn_dataframe.pkl...")
    genders = np.random.choice(["Female", "Male"], size=n_samples)
    senior = np.random.choice([0, 1], size=n_samples, p=[0.82, 0.18])
    tenure = np.random.randint(1, 72, size=n_samples).astype(float)
    contract = np.random.choice(["Month-to-month", "One year", "Two year"], size=n_samples, p=[0.55, 0.25, 0.20])
    internet = np.random.choice(["Fiber optic", "DSL", "No"], size=n_samples, p=[0.44, 0.34, 0.22])
    payment = np.random.choice(["Electronic check", "Mailed check", "Bank transfer", "Credit card"], size=n_samples)
    
    monthly_charges = np.random.uniform(20.0, 115.0, size=n_samples)
    # Inject correlated total_charges
    total_charges = tenure * monthly_charges + np.random.normal(0, 50, size=n_samples)
    total_charges = np.clip(total_charges, 20.0, None)

    satisfaction = np.random.choice([1, 2, 3, 4, 5], size=n_samples, p=[0.1, 0.2, 0.35, 0.25, 0.1]).astype(float)

    # Churn probability based on contract, monthly charges, satisfaction
    churn_prob = 0.25 + 0.3 * (contract == "Month-to-month") + 0.2 * (monthly_charges > 80) - 0.25 * (satisfaction >= 4)
    churn_prob = np.clip(churn_prob, 0.05, 0.95)
    churn = np.where(np.random.rand(n_samples) < churn_prob, "Yes", "No")

    df = pd.DataFrame({
        "customer_id": [f"BLM-{i+1000}" for i in range(n_samples)],
        "gender": genders,
        "senior_citizen": senior,
        "tenure_months": tenure,
        "contract_type": contract,
        "internet_service": internet,
        "payment_method": payment,
        "monthly_charges": np.round(monthly_charges, 2),
        "total_charges": np.round(total_charges, 2),
        "satisfaction_score": satisfaction,
        "churn": churn
    })

    # Inject missing values
    missing_total_indices = np.random.choice(n_samples, size=45, replace=False)
    df.loc[missing_total_indices, "total_charges"] = np.nan

    missing_sat_indices = np.random.choice(n_samples, size=85, replace=False)
    df.loc[missing_sat_indices, "satisfaction_score"] = np.nan

    # Inject statistical outliers
    outlier_indices = np.random.choice(n_samples, size=15, replace=False)
    df.loc[outlier_indices[:8], "monthly_charges"] = np.random.uniform(220.0, 310.0, size=8)
    df.loc[outlier_indices[8:], "total_charges"] = np.random.uniform(12000.0, 18000.0, size=7)

    # Inject duplicates (12 duplicated rows)
    dup_rows = df.iloc[:12].copy()
    df = pd.concat([df, dup_rows], ignore_index=True)

    df_path = os.path.join(output_dir, "customer_churn_dataframe.pkl")
    with open(df_path, "wb") as f:
        pickle.dump(df, f)

    # -------------------------------------------------------------
    # 2. Scikit-learn Pipeline
    # -------------------------------------------------------------
    print("Generating churn_rf_pipeline.pkl...")
    feature_cols_num = ["tenure_months", "monthly_charges"]
    feature_cols_cat = ["contract_type", "internet_service"]
    
    clean_df = df.dropna(subset=feature_cols_num + feature_cols_cat + ["churn"])
    X = clean_df[feature_cols_num + feature_cols_cat]
    y = (clean_df["churn"] == "Yes").astype(int)

    preprocessor = ColumnTransformer(
        transformers=[
            ("num_scaler", StandardScaler(), feature_cols_num),
            ("cat_encoder", OneHotEncoder(drop="first", sparse_output=False), feature_cols_cat)
        ]
    )

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=40, max_depth=6, random_state=42))
    ])
    pipeline.fit(X, y)

    pipeline_path = os.path.join(output_dir, "churn_rf_pipeline.pkl")
    with open(pipeline_path, "wb") as f:
        pickle.dump(pipeline, f)

    # -------------------------------------------------------------
    # 3. Model Container / Dictionary Bundle
    # -------------------------------------------------------------
    print("Generating trained_model_bundle.pkl...")
    scaler = StandardScaler()
    X_num = clean_df[feature_cols_num].values
    X_scaled = scaler.fit_transform(X_num)

    lr_model = LogisticRegression(C=0.15, max_iter=200, random_state=42)
    lr_model.fit(X_scaled, y)

    bundle = {
        "model": lr_model,
        "scaler": scaler,
        "feature_names": ["tenure_months", "monthly_charges"],
        "target_name": "churn",
        "evaluation_metrics": {
            "accuracy": 0.814,
            "roc_auc": 0.862,
            "f1_score": 0.748,
            "precision": 0.763,
            "recall": 0.734
        },
        "metadata": {
            "model_name": "Customer Churn Logistic Estimator",
            "author": "Botanical ML Laboratory",
            "dataset_version": "v2.4",
            "created_at": "2026-09-01",
            "environment": "Python 3.11 / Scikit-Learn 1.9.0"
        }
    }

    bundle_path = os.path.join(output_dir, "trained_model_bundle.pkl")
    with open(bundle_path, "wb") as f:
        pickle.dump(bundle, f)

    # -------------------------------------------------------------
    # 4. Sensor Embeddings NumPy Array
    # -------------------------------------------------------------
    print("Generating sensor_embeddings_numpy.pkl...")
    embeddings = np.random.randn(300, 24).astype(np.float32)
    # Add some zero sparsity
    mask = np.random.rand(*embeddings.shape) < 0.15
    embeddings[mask] = 0.0

    numpy_path = os.path.join(output_dir, "sensor_embeddings_numpy.pkl")
    with open(numpy_path, "wb") as f:
        pickle.dump(embeddings, f)

    print("All sample pickle files successfully generated in:", output_dir)


if __name__ == "__main__":
    out = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "samples"))
    generate_samples(out)
