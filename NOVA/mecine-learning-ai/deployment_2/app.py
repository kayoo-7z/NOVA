
import gradio as gr
import joblib
import pandas as pd
import numpy as np
import os

# --- Constants ---
MODEL_PATH = 'model_stunting_hybrid_90.joblib'
SCALER_PATH = 'scaler_hybrid.joblib'
ENCODER_PATH = 'label_encoder_hybrid.joblib'

# --- Load Artifacts with Error Handling ---
def load_artifacts():
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        encoder = joblib.load(ENCODER_PATH)
        return model, scaler, encoder
    except Exception as e:
        return None, None, str(e)

model, scaler, encoder = load_artifacts()

# --- Core Prediction Logic (Helper for API/Backend) ---
def get_prediction(gender, age, weight, height):
    # 1. Validation
    if age < 0: return None, "Age cannot be negative."
    if weight <= 0: return None, "Weight must be greater than 0."
    if height <= 0: return None, "Height must be greater than 0."

    # 2. Feature Engineering (BMI)
    bmi = weight / ((height / 100) ** 2)

    # 3. Preprocessing
    # Map Gender: Male -> 1, Female -> 0 (based on training data convention)
    gender_val = 1 if gender.lower() == 'male' else 0
    
    # Prepare DataFrame to match training feature order
    input_df = pd.DataFrame([[gender_val, age, weight, height, bmi]], 
                          columns=['Gender', 'Age (Month)', 'Weight', 'Height', 'BMI'])
    
    # Apply Scaler
    input_scaled = scaler.transform(input_df)

    # 4. Predict
    pred_idx = model.predict(input_scaled)[0]
    pred_label = encoder.inverse_transform([pred_idx])[0]
    
    # Probabilities
    probs = model.predict_proba(input_scaled)[0]
    confidence = np.max(probs) * 100

    return {
        "risk_category": pred_label,
        "confidence_score": f"{confidence:.2f}%",
        "bmi": round(bmi, 2)
    }, None

# --- Gradio UI Wrapper ---
def gradio_interface(gender, age, weight, height):
    if isinstance(model, str): # Error in loading artifacts
        return f"Error loading model: {model}", "N/A", "N/A"
    
    result, error = get_prediction(gender, age, weight, height)
    if error: return error, "N/A", "N/A"
    
    return result['risk_category'], result['confidence_score'], result['bmi']

# --- Launch App ---
iface = gr.Interface(
    fn=gradio_interface,
    inputs=[
        gr.Dropdown(['Male', 'Female'], label="Gender", value="Male"),
        gr.Number(label="Age (Month)", value=24),
        gr.Number(label="Weight (kg)", value=12.0),
        gr.Number(label="Height (cm)", value=85.0)
    ],
    outputs=[
        gr.Textbox(label="Predicted Risk Category"),
        gr.Textbox(label="Confidence Score"),
        gr.Number(label="Calculated BMI")
    ],
    title="Stunting Risk Classification v1.0",
    description="Deployment of Hybrid 90% XGBoost Model. Fill in the child's data to check stunting risk.",
    theme="soft"
)

if __name__ == '__main__':
    iface.launch()
