# BloomEDA 🌸
### *Turn Your Pickle Files Into Data Stories*

**BloomEDA** is a production-quality full-stack web application designed as an **elegant botanical laboratory for exploring machine-learning artifacts**. Users upload Python `.pkl` / `.pickle` files to securely inspect and analyze their structure, statistics, anomalies, and ML pipelines, blooming into an interactive Bohemian Botanical data garden dashboard.

---

## 🌿 Core Features

1. **Automated Exploratory Data Analysis (EDA)**:
   - Deep analysis of Pandas `DataFrame` & `Series`.
   - Continuous feature distributions: mean, median, standard deviation, quartiles, Tukey 1.5×IQR boundaries, skewness, kurtosis, and interactive Recharts histograms.
   - Categorical analysis: modal class, prevalence, cardinality ratios, and discrete frequency bar charts.
   - Missing value profiles: ranked null percentages and completeness checks.
   - Pearson & Spearman correlation matrix with relational pairings and heatmap grid.
   - Tukey IQR and standard Z-score outlier detection without altering original data.
2. **Explainable Botanical Data Quality Score**:
   - Transparent 0–100 index with full deduction ledger (penalizing missingness, duplicate rows, extreme outliers, and constant features).
3. **Machine Learning Model Introspection**:
   - Introspects trained Scikit-learn models (Classifiers, Regressors, Clusterers).
   - Safe extraction of hyperparameters, fitted attributes (`n_features_in_`, `classes_`, `feature_names_in_`), and evaluation metrics.
4. **Interactive Pipeline Flowchart**:
   - Graph representation of Scikit-learn `Pipeline` steps (e.g. `ColumnTransformer` → `StandardScaler` / `OneHotEncoder` → `RandomForestClassifier`).
5. **Container & Bundle Traversal**:
   - Recursive inspection of dictionary bundles containing multiple models, scalers, metadata, and embeddings.
6. **Statistically Grounded Insights**:
   - Automated observations generated strictly from computed metrics with zero hallucination.
7. **Zero-Trust Subprocess Isolation**:
   - Pickle deserialization is strictly isolated inside a dedicated Python worker subprocess with AST module whitelisting (`RestrictedUnpickler`), 15-second execution timeout, and ephemeral file cleanup.
8. **Interactive Paginated Data Preview**:
   - Backend-paginated table supporting searching and multi-column sorting without loading gigabytes into the client.
9. **Report Exporter**:
   - Export analysis results as structured JSON, CSV statistical summaries, or printable botanical dossiers.
10. **Built-in Interactive Sample Artifacts**:
    - Pre-generated sample pickle files ready for 1-click inspection from the landing page.

---

## 🏛 Architecture & Security Isolation

```
┌────────────────────────────────────────────────────────┐
│               Next.js App (Frontend)                   │
│   (Bohemian Botanical UI, Framer Motion, Recharts)     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / Multipart
                            ▼
┌────────────────────────────────────────────────────────┐
│            FastAPI Backend Service (Port 8000)         │
│         (/api/upload, /api/analyze, /api/preview)      │
└───────────────────────────┬────────────────────────────┘
                            │ Subprocess spawn with limits
                            ▼
┌────────────────────────────────────────────────────────┐
│          Isolated Python Analysis Worker               │
│ - RestrictedUnpickler (AST Module Whitelist)           │
│ - 15-Second Hard Execution Timeout                     │
│ - Ephemeral File Workspace & Auto Cleanup              │
│ - Blocks os.system, subprocess, eval, exec, etc.       │
└───────────────────────────┬────────────────────────────┘
                            │ Structured JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│               Your Data Garden Dashboard               │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Bohemian Botanical Design System

- **Warm Cream Background**: `#FAF7F2`
- **Terracotta Primary Accent**: `#C86D51`
- **Sage Green**: `#7E9A82`
- **Dusty Rose**: `#C98474`
- **Soft Peach**: `#FCEEE9`
- **Golden Ochre**: `#D4AF37`
- **Typography**: `Cormorant Garamond` (Headings) + `Plus Jakarta Sans` (Technical Data)
- **Visuals**: Handcrafted SVG botanical illustrations, blooming floral loading screen with 8 progressive analytical stages, and floating petal particles with reduced-motion accessibility.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Generate demo sample pickle artifacts
python generate_samples.py

# Run unit & security tests
python -m pytest tests/test_analyzer.py

# Start FastAPI server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be online at `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd eda

# Install packages
npm install

# Start Next.js development server
npm run dev
```

Frontend will be running at `http://localhost:3000`.

---

## 🧪 Testing Security & Isolation

BloomEDA includes strict security tests:
```bash
python -m pytest backend/tests/test_analyzer.py
```
This tests:
- Safe DataFrame analysis and outlier profiling.
- NumPy multidimensional array introspection.
- Multi-component container traversal.
- Security enforcement: Verifies that malicious pickle payloads attempting arbitrary code execution (e.g. `os.system`) are actively intercepted and blocked with `SecurityException`.
