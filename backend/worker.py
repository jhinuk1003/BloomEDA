"""
Isolated Analysis Worker
Invoked in a separate subprocess with resource guards and timeouts.
Deserializes untrusted pickle files using RestrictedUnpickler only.
"""

import argparse
import json
import os
import sys
import traceback

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from safe_unpickler import safe_load_pickle_from_file, SecurityException
from analyzer import ArtifactAnalyzer


def main():
    parser = argparse.ArgumentParser(description="Isolated BloomEDA Analysis Worker")
    parser.add_argument("--input", required=True, help="Path to input .pkl file")
    parser.add_argument("--output", required=True, help="Path to output .json file")
    parser.add_argument("--filename", default="artifact.pkl", help="Original user filename")
    args = parser.parse_args()

    input_path = os.path.abspath(args.input)
    output_path = os.path.abspath(args.output)
    original_filename = args.filename

    if not os.path.exists(input_path):
        err_payload = {
            "status": "error",
            "error_type": "FileNotFoundError",
            "message": f"Artifact file '{original_filename}' was not found in isolated workspace.",
            "technical_details": f"File does not exist: {input_path}"
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(err_payload, f, indent=2)
        sys.exit(1)

    file_size = os.path.getsize(input_path)

    # 1. Safe Unpickling
    try:
        loaded_obj = safe_load_pickle_from_file(input_path)
    except SecurityException as sec_err:
        err_payload = {
            "status": "security_violation",
            "error_type": "SecurityException",
            "message": "Security policy prevented deserialization of this artifact.",
            "technical_details": str(sec_err)
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(err_payload, f, indent=2)
        sys.exit(2)
    except Exception as unpickle_err:
        err_payload = {
            "status": "deserialization_error",
            "error_type": type(unpickle_err).__name__,
            "message": f"Could not read the pickle artifact: {str(unpickle_err)}",
            "technical_details": traceback.format_exc()
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(err_payload, f, indent=2)
        sys.exit(3)

    # 2. Analyze Artifact
    try:
        analyzer = ArtifactAnalyzer(filename=original_filename, file_size=file_size)
        analysis_result = analyzer.analyze(loaded_obj)
        output_payload = {
            "status": "success",
            "data": analysis_result
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2)
        sys.exit(0)
    except Exception as ana_err:
        err_payload = {
            "status": "analysis_error",
            "error_type": type(ana_err).__name__,
            "message": f"Analysis encountered an unexpected failure: {str(ana_err)}",
            "technical_details": traceback.format_exc()
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(err_payload, f, indent=2)
        sys.exit(4)


if __name__ == "__main__":
    main()
