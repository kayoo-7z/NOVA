import gradio as gr
import joblib
import pandas as pd
import numpy as np
from pygrowup import Calculator

# 1. Load semua artifact
model = joblib.load('stunting_xgb_model.joblib')
scaler = joblib.load('stunting_scaler.joblib')
encoder = joblib.load('stunting_encoder.joblib')

# Inisialisasi Calculator WHO
# Kami menggunakan standar WHO untuk pertumbuhan anak
calculator = Calculator(adjust_height_data=True, adjust_weight_scores=True)

# 2. Fungsi Helper untuk Z-Score
def get_zscore_category(gender_val, age_months, weight_kg, height_cm):
    """
    Menghitung Z-score menggunakan pygrowup dan mengonversinya ke kategori ordinal (0, 1, 2, 3).
    Gender: 0 untuk Perempuan, 1 untuk Laki-laki
    """
    sex = 'f' if gender_val == 0 else 'm'
    
    # Hitung nilai exact Z-Score
    waz = calculator.zscore_for_measurement('wfa', weight_kg, age_months, sex)
    haz = calculator.zscore_for_measurement('hfa', height_cm, age_months, sex)
    whz = calculator.zscore_for_measurement('wfh', weight_kg, age_months, sex, height_cm)

    def map_to_ordinal(score):
        # Logika pemetaan threshold (Sesuaikan dengan encoding dataset asli Anda)
        if score < -3.0:
            return 0 # Misal: Sangat Kurang / Sangat Pendek
        elif -3.0 <= score < -2.0:
            return 1 # Misal: Kurang / Pendek
        elif -2.0 <= score <= 2.0:
            return 2 # Misal: Normal
        else:
            return 3 # Misal: Risiko Berat Lebih / Tinggi

    return map_to_ordinal(waz), map_to_ordinal(haz), map_to_ordinal(whz)

# 3. Definisikan urutan fitur
FEATURE_NAMES = [
    'Gender', 'Age (Month)', 'Weight', 'Height',
    'Weight for Age', 'Height for Age', 'Weight for Height',
    'BMI', 'Double_Burden'
]

def predict_stunting(gender, age, weight, height, bmi, db):
    try:
        # Hitung Z-score kategori secara otomatis di background
        wfa_cat, hfa_cat, wfh_cat = get_zscore_category(gender, age, weight, height)
        
        # Susun input sesuai urutan fitur model (9 fitur)
        raw_features = [gender, age, weight, height, wfa_cat, hfa_cat, wfh_cat, bmi, db]
        input_data = pd.DataFrame([raw_features], columns=FEATURE_NAMES)

        # Preprocessing & Prediksi
        input_scaled = scaler.transform(input_data)
        prediction_idx = model.predict(input_scaled)
        result = encoder.inverse_transform(prediction_idx)[0]

        return f"Kategori Risiko: {result} (WAZ-Cat: {wfa_cat}, HAZ-Cat: {hfa_cat}, WHZ-Cat: {wfh_cat})"
    
    except Exception as e:
        return f"Error: {str(e)}"

# 4. Bangun Interface Gradio (Tanpa Slider Z-Score)
iface = gr.Interface(
    fn=predict_stunting,
    inputs=[
        gr.Dropdown(choices=[("Perempuan", 0), ("Laki-laki", 1)], label="Gender"),
        gr.Number(label="Age (Month)", value=12),
        gr.Number(label="Weight (kg)", value=8.5),
        gr.Number(label="Height (cm)", value=75.0),
        gr.Number(label="BMI", value=15.1),
        gr.Radio(choices=[("No", 0), ("Yes", 1)], label="Double Burden Status")
    ],
    outputs=gr.Textbox(label="Predicted Risk Category"),
    title="Stunting Risk Classification (Auto Z-Score)",
    description="Input data fisik dasar. Sistem akan menghitung kategori Z-score secara otomatis menggunakan standar WHO."
)

if __name__ == "__main__":
    iface.launch()
