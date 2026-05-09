# stunting_deep_learning.py
"""Deep Learning pipeline for stunting risk classification.

- Loads and preprocesses `data_bersih.csv` using pandas & scikit‑learn.
- Builds an efficient `tf.data.Dataset` pipeline.
- Constructs a robust Keras model (≥3 dense layers, BatchNormalization, Dropout).
- Trains with Adam optimizer while tracking Accuracy and a custom F1‑Score.
- Saves learning‑curve plots (loss & accuracy) as PNG files.

All steps are clearly commented for reproducibility.
"""

import os
import pathlib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import tensorflow as tf
# Enable mixed‑precision training when a GPU is available
from tensorflow.keras import mixed_precision
mixed_precision.set_global_policy('mixed_float16')

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DATA_PATH = pathlib.Path(r"D:/CodingCamp/GithubNOVA/NOVA/mecine-learning-ai/dataset/data_bersih.csv")
OUTPUT_DIR = pathlib.Path(r"D:/CodingCamp/GithubNOVA/NOVA/mecine-learning-ai/notebooks")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Load raw data
# ---------------------------------------------------------------------------
print("Loading dataset from", DATA_PATH)
raw_df = pd.read_csv(DATA_PATH)

# Assume the target column is named 'Risk_Category' – adjust if different.
TARGET_COL = "Risk_Category"
# Separate numeric and categorical features
numeric_cols = raw_df.select_dtypes(include=["number"]).columns.tolist()
cat_cols = [c for c in raw_df.columns if c not in numeric_cols + [TARGET_COL]]
# Encode categorical columns using one‑hot encoding
if cat_cols:
    raw_df = pd.get_dummies(raw_df, columns=cat_cols, drop_first=True)
# Re‑define feature columns after encoding
FEATURE_COLS = [c for c in raw_df.columns if c != TARGET_COL]
X = raw_df[FEATURE_COLS].values.astype(np.float32)
Y = raw_df[TARGET_COL].values

# ---------------------------------------------------------------------------
# Encode target labels
# ---------------------------------------------------------------------------
label_encoder = LabelEncoder()
Y_enc = label_encoder.fit_transform(Y)  # integer encoding
num_classes = len(label_encoder.classes_)
# Compute class weights to handle potential imbalance
from sklearn.utils.class_weight import compute_class_weight
class_weights_array = compute_class_weight(class_weight='balanced', classes=np.arange(num_classes), y=Y_enc)
class_weight_dict = {i: weight for i, weight in enumerate(class_weights_array)}

# ---------------------------------------------------------------------------
# Train / validation split (stratified)
# ---------------------------------------------------------------------------
X_train, X_val, y_train, y_val = train_test_split(
    X, Y_enc, test_size=0.2, random_state=42, stratify=Y_enc
)

# ---------------------------------------------------------------------------
# Feature scaling (StandardScaler)
# ---------------------------------------------------------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled = scaler.transform(X_val)

# Convert to TensorFlow tensors
train_ds = tf.data.Dataset.from_tensor_slices((X_train_scaled, y_train))
val_ds = tf.data.Dataset.from_tensor_slices((X_val_scaled, y_val))

BATCH_SIZE = 32
AUTOTUNE = tf.data.AUTOTUNE

train_ds = (
    train_ds
    .shuffle(buffer_size=len(X_train_scaled))
    .batch(BATCH_SIZE)
    .prefetch(AUTOTUNE)
)
val_ds = val_ds.batch(BATCH_SIZE).prefetch(AUTOTUNE)

# ---------------------------------------------------------------------------
# Custom F1‑Score metric (handles imbalanced multi‑class data)
# ---------------------------------------------------------------------------
class F1Score(tf.keras.metrics.Metric):
    def __init__(self, name="f1_score", **kwargs):
        super().__init__(name=name, **kwargs)
        self.tp = self.add_weight(name="tp", initializer="zeros")
        self.fp = self.add_weight(name="fp", initializer="zeros")
        self.fn = self.add_weight(name="fn", initializer="zeros")

    def update_state(self, y_true, y_pred, sample_weight=None):
        # Convert predictions to integer class labels
        y_pred = tf.argmax(y_pred, axis=-1)
        y_true = tf.cast(y_true, tf.int64)

        tp = tf.reduce_sum(tf.cast(tf.logical_and(tf.equal(y_true, y_pred), tf.equal(y_true, 1)), self.dtype))
        fp = tf.reduce_sum(tf.cast(tf.logical_and(tf.not_equal(y_true, y_pred), tf.equal(y_pred, 1)), self.dtype))
        fn = tf.reduce_sum(tf.cast(tf.logical_and(tf.not_equal(y_true, y_pred), tf.equal(y_true, 1)), self.dtype))

        self.tp.assign_add(tp)
        self.fp.assign_add(fp)
        self.fn.assign_add(fn)

    def result(self):
        precision = self.tp / (self.tp + self.fp + tf.keras.backend.epsilon())
        recall = self.tp / (self.tp + self.fn + tf.keras.backend.epsilon())
        return 2 * precision * recall / (precision + recall + tf.keras.backend.epsilon())

    def reset_states(self):
        for var in self.variables:
            var.assign(0)

# ---------------------------------------------------------------------------
# Model architecture – three dense blocks with BatchNorm & Dropout
# ---------------------------------------------------------------------------
input_dim = X_train_scaled.shape[1]
model = tf.keras.Sequential([
    tf.keras.layers.InputLayer(input_shape=(input_dim,)),
    tf.keras.layers.Dense(256, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(num_classes, activation="softmax"),
])

model.summary()

# ---------------------------------------------------------------------------
# Compile model – Adam optimizer, sparse categorical loss, metrics
# ---------------------------------------------------------------------------
model.compile(
    optimizer=tf.keras.optimizers.Adam(),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy", F1Score()],
)

# ---------------------------------------------------------------------------
# Train the model
# ---------------------------------------------------------------------------
EPOCHS = 200
# Callbacks: early stopping, LR reduction, and model checkpoint
early_stop = tf.keras.callbacks.EarlyStopping(monitor='val_accuracy', patience=15, restore_best_weights=True)
reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, verbose=1)
checkpoint = tf.keras.callbacks.ModelCheckpoint(filepath=OUTPUT_DIR / 'best_model.h5', monitor='val_accuracy', save_best_only=True, verbose=0)

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weight_dict,
    callbacks=[early_stop, reduce_lr, checkpoint],
    verbose=2,
)

# ---------------------------------------------------------------------------
# Save the trained model (optional)
# ---------------------------------------------------------------------------
model_save_path = OUTPUT_DIR / "stunting_risk_model.h5"
model.save(model_save_path)
print(f"Model saved to {model_save_path}")

# ---------------------------------------------------------------------------
# Plot learning curves (loss & accuracy) and save as PNG
# (unchanged function definition follows)

# ---------------------------------------------------------------------------
def plot_learning_curves(history, output_dir: pathlib.Path):
    fig, axs = plt.subplots(1, 2, figsize=(12, 5))

    # Loss
    axs[0].plot(history.history["loss"], label="train loss")
    axs[0].plot(history.history["val_loss"], label="val loss")
    axs[0].set_title("Learning Curve – Loss")
    axs[0].set_xlabel("Epoch")
    axs[0].set_ylabel("Loss")
    axs[0].legend()

    # Accuracy
    axs[1].plot(history.history["accuracy"], label="train acc")
    axs[1].plot(history.history["val_accuracy"], label="val acc")
    axs[1].set_title("Learning Curve – Accuracy")
    axs[1].set_xlabel("Epoch")
    axs[1].set_ylabel("Accuracy")
    axs[1].legend()

    plt.tight_layout()
    png_path = output_dir / "learning_curve.png"
    plt.savefig(png_path, dpi=300)
    plt.close()
    print(f"Learning curves saved to {png_path}")

# Execute plotting
plot_learning_curves(history, OUTPUT_DIR)

# ---------------------------------------------------------------------------
# Confusion matrix visualization
from sklearn.metrics import confusion_matrix

# Predict on validation set
val_preds = np.argmax(model.predict(X_val_scaled), axis=1)
cm = confusion_matrix(y_val, val_preds)
plt.figure(figsize=(8,6))
im = plt.imshow(cm, interpolation='nearest', cmap='Blues')
plt.title('Validation Confusion Matrix')
plt.colorbar(im)
classes = label_encoder.classes_
plt.xticks(np.arange(len(classes)), classes, rotation=45)
plt.yticks(np.arange(len(classes)), classes)
thresh = cm.max() / 2.
for i in range(cm.shape[0]):
    for j in range(cm.shape[1]):
        plt.text(j, i, format(cm[i, j], 'd'),
                 ha='center', va='center',
                 color='white' if cm[i, j] > thresh else 'black')
plt.ylabel('True')
plt.xlabel('Predicted')
cm_path = OUTPUT_DIR / 'confusion_matrix.png'
plt.tight_layout()
plt.savefig(cm_path, dpi=300)
plt.close()
print(f"Confusion matrix saved to {cm_path}")


# ---------------------------------------------------------------------------
# Helper: quick inference example (optional)
# ---------------------------------------------------------------------------
def predict_risk(sample_features):
    """Predict risk category for a single sample (raw feature array)."""
    sample_scaled = scaler.transform(sample_features.reshape(1, -1))
    probs = model.predict(sample_scaled)
    pred_idx = np.argmax(probs, axis=1)[0]
    return label_encoder.inverse_transform([pred_idx])[0]

# Example usage (uncomment to test)
# sample = X_val[0]
# print("Predicted risk:", predict_risk(sample))

# End of script
