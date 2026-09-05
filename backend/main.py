"""
BloomEDA FastAPI Backend
Secure API gateway providing isolated analysis orchestration, progress streaming,
preview pagination, report export, and sample artifact loading.
"""

import asyncio
import csv
import io
import json
import os
import shutil
import subprocess
import sys
import threading
import time
import uuid
from typing import Dict, Any, Optional

from fastapi import FastAPI, File, UploadFile, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, Response
from pydantic import BaseModel

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_DIR = os.path.join(BASE_DIR, "storage")
SAMPLES_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "samples"))
WORKER_SCRIPT = os.path.join(BASE_DIR, "worker.py")

os.makedirs(STORAGE_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

app = FastAPI(
    title="BloomEDA API",
    description="Bohemian Botanical Automated EDA & ML Artifact Inspection API",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job tracker
analysis_jobs: Dict[str, Dict[str, Any]] = {}

STAGES = [
    (10, "Preparing your artifact in isolated workspace..."),
    (25, "Reading structure & inspecting object type..."),
    (42, "Understanding features and data types..."),
    (58, "Checking missing values and data quality..."),
    (72, "Discovering statistical patterns and correlations..."),
    (85, "Looking for anomalies and outliers..."),
    (94, "Generating botanical automated insights..."),
    (100, "Your data garden is ready.")
]


class AnalyzeRequest(BaseModel):
    analysis_id: str


def run_worker_process(analysis_id: str):
    job = analysis_jobs.get(analysis_id)
    if not job:
        return

    input_file = job["file_path"]
    output_file = os.path.join(os.path.dirname(input_file), "analysis_result.json")
    original_filename = job["filename"]

    try:
        job["status"] = "processing"
        
        # Simulate stage updates progressively while worker executes
        for prog, msg in STAGES[:6]:
            job["progress"] = prog
            job["stage_message"] = msg
            time.sleep(0.3)

        # Execute worker in subprocess with 15s timeout
        cmd = [
            sys.executable,
            WORKER_SCRIPT,
            "--input", input_file,
            "--output", output_file,
            "--filename", original_filename
        ]

        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=18,
            cwd=BASE_DIR
        )

        job["progress"] = STAGES[6][0]
        job["stage_message"] = STAGES[6][1]
        time.sleep(0.2)

        if os.path.exists(output_file):
            with open(output_file, "r", encoding="utf-8") as f:
                output_data = json.load(f)

            if output_data.get("status") == "success":
                job["status"] = "completed"
                job["progress"] = 100
                job["stage_message"] = "Your data garden is ready."
                job["result"] = output_data.get("data")
            else:
                job["status"] = "failed"
                job["error"] = output_data.get("message", "Analysis failed")
                job["error_type"] = output_data.get("error_type", "ExecutionError")
                job["technical_details"] = output_data.get("technical_details", proc.stderr)
        else:
            job["status"] = "failed"
            job["error"] = "Isolated worker terminated without writing analysis result."
            job["technical_details"] = proc.stderr or proc.stdout

    except subprocess.TimeoutExpired:
        job["status"] = "failed"
        job["error"] = "Security guard: Artifact analysis exceeded the 15-second execution timeout."
        job["error_type"] = "TimeoutExpired"
    except Exception as e:
        job["status"] = "failed"
        job["error"] = f"Internal server error while orchestrating analysis: {str(e)}"
        job["error_type"] = type(e).__name__


@app.get("/")
def root():
    return {
        "name": "BloomEDA API",
        "description": "Bohemian Botanical Automated EDA & ML Artifact Inspector",
        "status": "online",
        "version": "1.0.0"
    }


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename or "artifact.pkl"
    ext = os.path.splitext(filename)[1].lower()

    if ext not in [".pkl", ".pickle"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. BloomEDA only accepts .pkl and .pickle artifacts."
        )

    # Read content and enforce 100MB limit
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="The uploaded pickle file is empty (0 bytes).")
    if len(content) > 100 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds maximum size limit of 100MB.")

    analysis_id = str(uuid.uuid4())
    job_dir = os.path.join(STORAGE_DIR, f"job_{analysis_id}")
    os.makedirs(job_dir, exist_ok=True)

    file_path = os.path.join(job_dir, filename)
    with open(file_path, "wb") as f:
        f.write(content)

    analysis_jobs[analysis_id] = {
        "analysis_id": analysis_id,
        "filename": filename,
        "file_path": file_path,
        "size_bytes": len(content),
        "status": "uploaded",
        "progress": 0,
        "stage_message": "Artifact uploaded safely.",
        "created_at": time.time(),
        "result": None,
        "error": None
    }

    return {
        "analysis_id": analysis_id,
        "filename": filename,
        "size_bytes": len(content),
        "status": "uploaded"
    }


@app.post("/api/analyze")
def start_analyze(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    job = analysis_jobs.get(req.analysis_id)
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found.")

    if job["status"] in ["processing", "completed"]:
        return {"status": job["status"], "analysis_id": req.analysis_id}

    background_tasks.add_task(run_worker_process, req.analysis_id)
    return {"status": "queued", "analysis_id": req.analysis_id}


@app.get("/api/analysis/{analysis_id}/status")
def get_analysis_status(analysis_id: str):
    job = analysis_jobs.get(analysis_id)
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found.")

    return {
        "analysis_id": analysis_id,
        "status": job["status"],
        "progress": job.get("progress", 0),
        "stage_message": job.get("stage_message", ""),
        "error": job.get("error"),
        "error_type": job.get("error_type"),
        "technical_details": job.get("technical_details")
    }


@app.get("/api/analysis/{analysis_id}")
def get_analysis_result(analysis_id: str):
    job = analysis_jobs.get(analysis_id)
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found.")

    if job["status"] != "completed":
        return JSONResponse(
            status_code=202,
            content={
                "status": job["status"],
                "progress": job.get("progress", 0),
                "stage_message": job.get("stage_message", "")
            }
        )

    return {
        "status": "success",
        "analysis_id": analysis_id,
        "data": job["result"]
    }


@app.get("/api/analysis/{analysis_id}/preview")
def get_data_preview(
    analysis_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=5, le=100),
    search: str = Query("", max_length=100),
    sort_by: Optional[str] = None,
    sort_dir: str = Query("asc", regex="^(asc|desc)$")
):
    job = analysis_jobs.get(analysis_id)
    if not job or job.get("status") != "completed":
        raise HTTPException(status_code=404, detail="Active completed dataset not found.")

    import pandas as pd
    from safe_unpickler import safe_load_pickle_from_file

    try:
        obj = safe_load_pickle_from_file(job["file_path"])
        if isinstance(obj, pd.Series):
            df = obj.to_frame()
        elif isinstance(obj, pd.DataFrame):
            df = obj
        else:
            return {"rows": [], "total": 0, "page": 1, "page_size": page_size}

        # Filtering / Search across all string representations
        if search.strip():
            s_lower = search.strip().lower()
            mask = df.astype(str).apply(lambda row: row.str.lower().str.contains(s_lower, na=False)).any(axis=1)
            df_filtered = df[mask]
        else:
            df_filtered = df

        # Sorting
        if sort_by and sort_by in df_filtered.columns:
            ascending = (sort_dir == "asc")
            df_filtered = df_filtered.sort_values(by=sort_by, ascending=ascending)

        total_matching = len(df_filtered)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        slice_df = df_filtered.iloc[start_idx:end_idx]

        # Convert to records with nan handled
        records = []
        for idx, row in slice_df.iterrows():
            row_dict = {}
            for c in slice_df.columns:
                val = row[c]
                if pd.isna(val):
                    row_dict[str(c)] = None
                elif isinstance(val, (np.floating, float)):
                    row_dict[str(c)] = round(float(val), 2)
                elif isinstance(val, (np.integer, int)):
                    row_dict[str(c)] = int(val)
                else:
                    row_dict[str(c)] = str(val)
            records.append(row_dict)

        return {
            "total": total_matching,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, math.ceil(total_matching / page_size)),
            "columns": [str(c) for c in df.columns],
            "rows": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch preview: {str(e)}")


@app.get("/api/analysis/{analysis_id}/export/{export_format}")
def export_analysis(analysis_id: str, export_format: str):
    job = analysis_jobs.get(analysis_id)
    if not job or job.get("status") != "completed":
        raise HTTPException(status_code=404, detail="Completed analysis not found.")

    res = job["result"]
    base_name = os.path.splitext(job["filename"])[0]

    if export_format.lower() == "json":
        json_str = json.dumps(res, indent=2)
        return Response(
            content=json_str,
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{base_name}_bloomeda_report.json"'}
        )
    elif export_format.lower() == "csv":
        # Create CSV summary of columns & statistics
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["BloomEDA Botanical Analysis Summary"])
        writer.writerow(["Artifact Name", res["artifact"]["filename"]])
        writer.writerow(["Artifact Type", res["artifact"]["type"]])
        writer.writerow(["File Size", res["artifact"]["size_formatted"]])
        if res.get("data_quality"):
            writer.writerow(["Data Quality Score", f"{res['data_quality']['score']}/100 ({res['data_quality']['badge']})"])
        writer.writerow([])

        # Columns table
        if res.get("columns"):
            writer.writerow(["Column Name", "Type", "Unique Values", "Missing Values", "Missing %", "Memory"])
            for c in res["columns"]:
                writer.writerow([
                    c["name"], c["simple_type"], c["unique_values"],
                    c["missing_values"], f"{c['missing_percentage']}%", c["memory_usage_formatted"]
                ])
            writer.writerow([])

        # Automated insights
        if res.get("insights"):
            writer.writerow(["Automated Insights"])
            for ins in res["insights"]:
                writer.writerow([ins["category"], ins["title"], ins["content"]])

        csv_content = output.getvalue()
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{base_name}_bloomeda_summary.csv"'}
        )
    else:
        raise HTTPException(status_code=400, detail="Supported export formats are 'json' and 'csv'.")


@app.delete("/api/analysis/{analysis_id}")
def delete_analysis(analysis_id: str):
    job = analysis_jobs.pop(analysis_id, None)
    if job:
        job_dir = os.path.dirname(job["file_path"])
        shutil.rmtree(job_dir, ignore_errors=True)
        return {"status": "deleted", "analysis_id": analysis_id}
    return {"status": "not_found"}


@app.get("/api/samples")
def list_samples():
    samples = [
        {
            "id": "customer_churn_dataframe.pkl",
            "title": "Customer Churn DataFrame",
            "category": "Pandas DataFrame",
            "description": "1,012 customer profiles with missing values, tenure, monthly charges, outliers, and churn target.",
            "badge": "Full EDA & Target",
            "size": "103 KB"
        },
        {
            "id": "churn_rf_pipeline.pkl",
            "title": "Sklearn RandomForest Pipeline",
            "category": "ML Pipeline",
            "description": "Complete ML Pipeline featuring ColumnTransformer, OneHotEncoder, StandardScaler, and fitted RandomForestClassifier.",
            "badge": "Pipeline Visualizer",
            "size": "98 KB"
        },
        {
            "id": "trained_model_bundle.pkl",
            "title": "Model Container Bundle",
            "category": "Container / Dict",
            "description": "Multi-component bundle containing fitted LogisticRegression model, scaler, feature list, and evaluation metrics.",
            "badge": "Model & Container",
            "size": "12 KB"
        },
        {
            "id": "sensor_embeddings_numpy.pkl",
            "title": "Sensor Embeddings Array",
            "category": "NumPy ndarray",
            "description": "2D high-dimensional matrix of sensor embeddings with zero-sparsity and normal distribution.",
            "badge": "NumPy Array",
            "size": "28 KB"
        }
    ]
    return {"samples": samples}


@app.post("/api/samples/load/{sample_id}")
def load_sample(sample_id: str, background_tasks: BackgroundTasks):
    sample_path = os.path.join(SAMPLES_DIR, sample_id)
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="Sample artifact file not found.")

    analysis_id = str(uuid.uuid4())
    job_dir = os.path.join(STORAGE_DIR, f"job_{analysis_id}")
    os.makedirs(job_dir, exist_ok=True)

    dest_file = os.path.join(job_dir, sample_id)
    shutil.copyfile(sample_path, dest_file)
    size_bytes = os.path.getsize(dest_file)

    analysis_jobs[analysis_id] = {
        "analysis_id": analysis_id,
        "filename": sample_id,
        "file_path": dest_file,
        "size_bytes": size_bytes,
        "status": "uploaded",
        "progress": 0,
        "stage_message": "Sample artifact loaded safely.",
        "created_at": time.time(),
        "result": None,
        "error": None
    }

    # Automatically trigger analysis in background
    background_tasks.add_task(run_worker_process, analysis_id)

    return {
        "analysis_id": analysis_id,
        "filename": sample_id,
        "status": "queued"
    }


@app.get("/api/samples/download/{sample_id}")
def download_sample(sample_id: str):
    sample_path = os.path.join(SAMPLES_DIR, sample_id)
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="Sample not found.")
    return FileResponse(
        sample_path,
        media_type="application/octet-stream",
        filename=sample_id
    )
