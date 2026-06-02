# Stunting Risk Classification

Hybrid Label Cleaning (90%) strategy implementation for Stunting Risk classification.

## Project Structure
- `app.py`: Gradio web interface and API logic.
- `requirements.txt`: Python dependencies.
- `*.joblib`: Pre-trained model, scaler, and encoder.

## Local Execution
1. Install dependencies: `pip install -r requirements.txt`
2. Run app: `python app.py`

## API Specs (Helper for Backend)
- **Input**: Gender (Male/Female), Age (Month), Weight (kg), Height (cm).
- **BMI Calculation**: `weight / (height/100)^2` handled automatically.
- **Output**: Risk Category, Confidence Score, BMI.
