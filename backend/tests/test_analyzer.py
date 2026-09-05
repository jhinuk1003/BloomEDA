import os
import sys
import pickle
import pytest
import numpy as np
import pandas as pd

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from safe_unpickler import RestrictedUnpickler, SecurityException, safe_load_pickle
from analyzer import ArtifactAnalyzer


def test_dataframe_analysis():
    df = pd.DataFrame({
        "age": [25, 30, 35, 40, 100],  # 100 is outlier
        "city": ["New York", "Paris", "Tokyo", "London", "Paris"],
        "is_active": [True, False, True, True, False],
        "target": [0, 1, 0, 1, 0]
    })
    analyzer = ArtifactAnalyzer("test.pkl", 1024)
    res = analyzer.analyze(df)

    assert res["category"] == "dataframe"
    assert res["dataset"]["rows"] == 5
    assert res["dataset"]["columns"] == 4
    assert res["target_analysis"]["detected"] is True
    assert res["target_analysis"]["column"] == "target"
    assert res["data_quality"]["score"] > 0
    assert len(res["insights"]) > 0


def test_security_blocks_malicious_pickle():
    """Verify that execution of dangerous commands (e.g. os.system) is blocked by RestrictedUnpickler."""
    class MaliciousExploit:
        def __reduce__(self):
            import os
            return (os.system, ("echo hacked",))

    malicious_bytes = pickle.dumps(MaliciousExploit())
    
    with pytest.raises(SecurityException) as exc_info:
        safe_load_pickle(malicious_bytes)

    assert "Security Alert" in str(exc_info.value)


def test_numpy_analysis():
    arr = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
    analyzer = ArtifactAnalyzer("array.pkl", 512)
    res = analyzer.analyze(arr)

    assert res["category"] == "numpy"
    assert res["numpy_info"]["shape"] == [2, 3]
    assert res["numpy_info"]["statistics"]["min"] == 1.0
    assert res["numpy_info"]["statistics"]["max"] == 6.0


def test_container_analysis():
    bundle = {
        "scaler_name": "StandardScaler",
        "scores": [0.92, 0.94, 0.91],
        "params": {"lr": 0.01, "epochs": 50}
    }
    analyzer = ArtifactAnalyzer("bundle.pkl", 256)
    res = analyzer.analyze(bundle)

    assert res["category"] == "container"
    assert res["container"]["total_keys"] == 3
