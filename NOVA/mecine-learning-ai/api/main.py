"""
NOVA AI service — FastAPI inference API (MVP).

Run locally:
  cd NOVA/mecine-learning-ai/api
  pip install -r requirements.txt
  uvicorn main:app --reload --host 0.0.0.0 --port 8000

Endpoints:
  GET  /health
  POST /predict/risk
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# -----------------------------------------------------------------------------
# Paths for future TensorFlow / artifact loading
# -----------------------------------------------------------------------------
API_DIR = Path(__file__).resolve().parent
ML_ROOT = API_DIR.parent
ARTIFACTS_DIR = Path(os.getenv("NOVA_ARTIFACTS_DIR", ML_ROOT / "artifacts"))

MODEL_PATH = ARTIFACTS_DIR / "stunting_risk_model.h5"
SCALER_PATH = ARTIFACTS_DIR / "scaler.pkl"
LABEL_ENCODER_PATH = ARTIFACTS_DIR / "label_encoder.pkl"
FEATURE_COLUMNS_PATH = ARTIFACTS_DIR / "feature_columns.json"

MODEL_VERSION = os.getenv("NOVA_MODEL_VERSION", "stunting_risk_model_v1_dummy")

# -----------------------------------------------------------------------------
# Model state (populated when real inference is enabled)
# -----------------------------------------------------------------------------
_keras_model: Any = None
_scaler: Any = None
_label_encoder: Any = None
_feature_columns: list[str] | None = None
_use_dummy = True


def load_model() -> None:
    """
    Load .h5 model and preprocessing artifacts at startup.

    Future steps:
      1. import tensorflow as tf
      2. import joblib
      3. import json
      4. _keras_model = tf.keras.models.load_model(MODEL_PATH)
      5. _scaler = joblib.load(SCALER_PATH)
      6. _label_encoder = joblib.load(LABEL_ENCODER_PATH)
      7. _feature_columns = json.loads(FEATURE_COLUMNS_PATH.read_text())
      8. global _use_dummy; _use_dummy = False

    Until artifacts exist under ARTIFACTS_DIR, dummy predictions are used.
    """
    global _keras_model, _scaler, _label_encoder, _feature_columns, _use_dummy

    if not MODEL_PATH.is_file():
        return

    # --- Uncomment when TensorFlow is in requirements.txt ---
    # import json
    # import joblib
    # import tensorflow as tf
    #
    # _keras_model = tf.keras.models.load_model(MODEL_PATH)
    # _scaler = joblib.load(SCALER_PATH)
    # _label_encoder = joblib.load(LABEL_ENCODER_PATH)
    # _feature_columns = json.loads(FEATURE_COLUMNS_PATH.read_text(encoding="utf-8"))
    # _use_dummy = False


def _dummy_prediction(features: dict[str, Any]) -> dict[str, Any]:
    """Temporary response until .h5 inference is connected (demo only)."""
    height = float(features.get("heightCm") or features.get("height_cm") or 0)
    weight = float(features.get("weightKg") or features.get("weight_kg") or 0)
    if height < 75 or weight < 9:
        category = "High"
        probs = {"Low": 0.1, "Medium": 0.2, "High": 0.7}
    elif height < 90 or weight < 12:
        category = "Medium"
        probs = {"Low": 0.15, "Medium": 0.65, "High": 0.2}
    else:
        category = "Low"
        probs = {"Low": 0.7, "Medium": 0.2, "High": 0.1}

    return {
        "riskCategory": category,
        "probabilities": probs,
        "modelVersion": MODEL_VERSION,
    }


def _predict_with_model(features: dict[str, Any]) -> dict[str, Any]:
    """
    Real inference when load_model() has initialized artifacts.

    Future: build vector from _feature_columns, scale, model.predict, decode labels.
    """
    if _use_dummy:
        return _dummy_prediction(features)

    raise HTTPException(
        status_code=500,
        detail="Model loaded flag set but inference not implemented",
    )


class PredictRiskRequest(BaseModel):
    features: dict[str, Any] = Field(
        ...,
        description="From Express: ageMonths, gender, heightCm, weightKg, etc.",
    )
    model_version: str | None = Field(None, alias="modelVersion")

    model_config = {"populate_by_name": True}


class PredictRiskResponse(BaseModel):
    risk_category: str = Field(..., alias="riskCategory")
    probabilities: dict[str, float]
    model_version: str = Field(..., alias="modelVersion")

    model_config = {"populate_by_name": True}


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool = Field(..., alias="modelLoaded")
    mode: str = "dummy"

    model_config = {"populate_by_name": True}


app = FastAPI(
    title="NOVA AI Service",
    description="Stunting risk inference (MVP). Express calls this service only.",
    version="0.1.0",
)


@app.on_event("startup")
def on_startup() -> None:
    load_model()


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        modelLoaded=not _use_dummy and _keras_model is not None,
        mode="dummy" if _use_dummy else "tensorflow",
    )


@app.post("/predict/risk", response_model=PredictRiskResponse)
def predict_risk(body: PredictRiskRequest) -> PredictRiskResponse:
    if not body.features:
        raise HTTPException(status_code=422, detail="features must not be empty")

    result = _predict_with_model(body.features)
    return PredictRiskResponse(
        riskCategory=result["riskCategory"],
        probabilities=result["probabilities"],
        modelVersion=body.model_version or result["modelVersion"],
    )