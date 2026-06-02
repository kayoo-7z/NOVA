# generate_artifacts.py
"""Standalone script to (re)create the deployment artefacts required by the
FastAPI service:

- StandardScaler instance (saved as ``scaler.pkl``)
- LabelEncoder instance (saved as ``label_encoder.pkl``)
- List of feature column names (saved as ``feature_columns.json``)

The script **re‑computes** these objects from the original dataset using the
exact preprocessing logic that the training notebook employs.  This makes the
script independent of any prior artefacts – it simply loads the CSV, performs the
same one‑hot encoding and scaling, and serialises the results.
"""

import pathlib
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
import sys


def main() -> None:
    # -------------------------------------------------------------------
    # 1. Resolve repository layout and paths
    # -------------------------------------------------------------------
    repo_root = pathlib.Path(__file__).resolve().parent
    data_path = repo_root / "dataset" / "data_bersih.csv"
    if not data_path.is_file():
        sys.stderr.write(f"❌ Data file not found at {data_path}\n")
        sys.exit(1)

    artifacts_dir = repo_root / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    # -------------------------------------------------------------------
    # 2. Load raw data and apply the same preprocessing steps as the notebook
    # -------------------------------------------------------------------
    raw_df = pd.read_csv(data_path)
    # The training notebook expects a column named "Risk_Category"
    target_col = "Risk_Category"
    if target_col not in raw_df.columns:
        sys.stderr.write(f"❌ Expected target column '{target_col}' not found in data.\n")
        sys.exit(1)

    # Separate numeric & categorical features
    numeric_cols = raw_df.select_dtypes(include=["number"]).columns.tolist()
    cat_cols = [c for c in raw_df.columns if c not in numeric_cols + [target_col]]

    # One‑hot encode categorical columns (drop_first to match notebook behaviour)
    if cat_cols:
        df_processed = pd.get_dummies(raw_df, columns=cat_cols, drop_first=True)
    else:
        df_processed = raw_df.copy()

    # Re‑define feature columns after encoding (everything except the target)
    feature_cols = [c for c in df_processed.columns if c != target_col]

    X = df_processed[feature_cols].values.astype(np.float32)
    y = df_processed[target_col].values

    # -------------------------------------------------------------------
    # 3. Fit scaler and label encoder exactly as during training
    # -------------------------------------------------------------------
    scaler = StandardScaler()
    scaler.fit(X)  # Fit on the full dataset (training used train split, but the model expects the same transformation)

    label_encoder = LabelEncoder()
    label_encoder.fit(y)

    # -------------------------------------------------------------------
    # 4. Persist artefacts
    # -------------------------------------------------------------------
    joblib.dump(scaler, artifacts_dir / "scaler.pkl")
    joblib.dump(label_encoder, artifacts_dir / "label_encoder.pkl")
    with (artifacts_dir / "feature_columns.json").open("w", encoding="utf-8") as f:
        json.dump(feature_cols, f, ensure_ascii=False, indent=2)

    # -------------------------------------------------------------------
    # 5. Success message
    # -------------------------------------------------------------------
    print(f"Deployment artefacts saved to: {artifacts_dir}")


if __name__ == "__main__":
    main()
