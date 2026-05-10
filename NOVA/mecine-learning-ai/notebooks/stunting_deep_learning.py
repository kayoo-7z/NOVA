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
# mixed_precision.set_global_policy('mixed_float16') # Dimatikan untuk stabilitas float32 penuh

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
# Lokasi BARU (yang benar)
DATA_PATH = pathlib.Path(r"e:/BerkasNBL/Github_Project_Plan/NOVA/NOVA/mecine-learning-ai/dataset/data_bersih.csv")
OUTPUT_DIR = pathlib.Path(r"e:/BerkasNBL/Github_Project_Plan/NOVA/NOVA/mecine-learning-ai/notebooks")
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
# Custom Layer: Residual Dense Block
# ---------------------------------------------------------------------------
class ResidualDenseBlock(tf.keras.layers.Layer):
    def __init__(self, units, dropout_rate=0.5, **kwargs):
        super(ResidualDenseBlock, self).__init__(**kwargs)
        self.dense = tf.keras.layers.Dense(units, activation="relu", kernel_regularizer=tf.keras.regularizers.l2(0.001))
        self.bn = tf.keras.layers.BatchNormalization()
        self.dropout = tf.keras.layers.Dropout(dropout_rate)
        self.units = units
        self.projection = None

    def build(self, input_shape):
        if input_shape[-1] != self.units:
            self.projection = tf.keras.layers.Dense(self.units, use_bias=False, kernel_regularizer=tf.keras.regularizers.l2(0.001))
        super(ResidualDenseBlock, self).build(input_shape)

    def call(self, inputs, training=None):
        x = self.dense(inputs)
        x = self.bn(x, training=training)
        x = self.dropout(x, training=training)
        
        # Skip connection: shortcut (inputs) + x
        shortcut = inputs
        if self.projection is not None:
            shortcut = self.projection(inputs)
            
        return x + shortcut

# ---------------------------------------------------------------------------
# Model architecture – custom residual blocks
# ---------------------------------------------------------------------------
input_dim = X_train_scaled.shape[1]
model = tf.keras.Sequential([
    tf.keras.layers.InputLayer(input_shape=(input_dim,)),
    ResidualDenseBlock(256),
    ResidualDenseBlock(128),
    ResidualDenseBlock(64),
    ResidualDenseBlock(32),
    tf.keras.layers.Dense(num_classes, activation="softmax"),
])

model.summary()

# ---------------------------------------------------------------------------
# Custom Focal Loss & Callback
# ---------------------------------------------------------------------------
def focal_loss(gamma=2., alpha=4.):
    def focal_loss_fixed(y_true, y_pred):
        y_true = tf.cast(tf.reshape(y_true, [-1]), tf.int32)
        y_pred = tf.cast(y_pred, tf.float32) # numerical stability
        y_true_one_hot = tf.one_hot(y_true, depth=tf.shape(y_pred)[-1], dtype=tf.float32)
        epsilon = tf.keras.backend.epsilon()
        y_pred = tf.clip_by_value(y_pred, epsilon, 1. - epsilon)
        pt = tf.reduce_sum(y_true_one_hot * y_pred, axis=-1)
        ce = -tf.math.log(pt + 1e-7)
        fl = alpha * tf.math.pow(1. - pt, gamma) * ce
        return tf.reduce_mean(fl)
    return focal_loss_fixed

class MyCustomCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        val_f1 = logs.get('val_f1_score')
        if val_f1 is not None and val_f1 >= 0.95:
            print("\nTarget F1-Score tercapai, menghentikan pelatihan untuk mencegah overfitting!")
            self.model.stop_training = True

# ---------------------------------------------------------------------------
# Custom Training Loop
# ---------------------------------------------------------------------------
EPOCHS = 200

optimizer = tf.keras.optimizers.Adam()
# LossScaleOptimizer dihapus karena mixed_float16 dinonaktifkan
model.optimizer = optimizer 
loss_fn = focal_loss(gamma=2.0, alpha=0.25)

train_acc_metric = tf.keras.metrics.SparseCategoricalAccuracy(name='accuracy')
train_f1_metric = F1Score(name='f1_score')
train_loss_metric = tf.keras.metrics.Mean(name='loss')

val_acc_metric = tf.keras.metrics.SparseCategoricalAccuracy(name='val_accuracy')
val_f1_metric = F1Score(name='val_f1_score')
val_loss_metric = tf.keras.metrics.Mean(name='val_loss')

@tf.function
def train_step(x, y):
    with tf.GradientTape() as tape:
        logits = model(x, training=True)
        loss_value = loss_fn(y, logits) # Perhitungan loss menggunakan fungsi focal_loss
    
    grads = tape.gradient(loss_value, model.trainable_weights) # Perhitungan gradien standar
    
    optimizer.apply_gradients(zip(grads, model.trainable_weights)) # Penerapan optimizer (Adam)
    
    # Update metrik akurasi dan F1-Score
    train_acc_metric.update_state(y, logits)
    train_f1_metric.update_state(y, logits)
    train_loss_metric.update_state(loss_value)
    
    return loss_value

@tf.function
def test_step(x, y):
    logits = model(x, training=False)
    loss_value = loss_fn(y, logits)
    
    val_acc_metric.update_state(y, logits)
    val_f1_metric.update_state(y, logits)
    val_loss_metric.update_state(loss_value)

# Setup Callbacks
early_stop = tf.keras.callbacks.EarlyStopping(
    monitor='val_accuracy', 
    mode='max', 
    patience=15, 
    restore_best_weights=True
)
reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', mode='min', factor=0.5, patience=5, verbose=1)
checkpoint = tf.keras.callbacks.ModelCheckpoint(filepath=OUTPUT_DIR / 'best_model.h5', monitor='val_accuracy', mode='max', save_best_only=True, verbose=0)
my_custom_cb = MyCustomCallback()

callbacks = tf.keras.callbacks.CallbackList(
    [early_stop, reduce_lr, checkpoint, my_custom_cb], 
    add_history=True, 
    model=model
)

history_dict = {"loss": [], "accuracy": [], "val_loss": [], "val_accuracy": []}

print("Memulai Custom Training Loop...")
model.stop_training = False 
callbacks.on_train_begin()

for epoch in range(EPOCHS):
    callbacks.on_epoch_begin(epoch)
    
    train_loss_metric.reset_state()
    train_acc_metric.reset_state()
    train_f1_metric.reset_state()
    
    val_loss_metric.reset_state()
    val_acc_metric.reset_state()
    val_f1_metric.reset_state()
    
    for x_batch_train, y_batch_train in train_ds:
        train_step(x_batch_train, y_batch_train)
        
    for x_batch_val, y_batch_val in val_ds:
        test_step(x_batch_val, y_batch_val)
        
    train_loss = float(train_loss_metric.result())
    train_acc = float(train_acc_metric.result())
    train_f1 = float(train_f1_metric.result())
    
    val_loss = float(val_loss_metric.result())
    val_acc = float(val_acc_metric.result())
    val_f1 = float(val_f1_metric.result())
    
    # Progress Tracking : Cetak nilai Loss, Accuracy, dan F1-Score
    print(f"Epoch {epoch+1}/{EPOCHS}")
    print(f" - loss: {train_loss:.4f} - accuracy: {train_acc:.4f} - f1_score: {train_f1:.4f} "
          f"- val_loss: {val_loss:.4f} - val_accuracy: {val_acc:.4f} - val_f1_score: {val_f1:.4f}")
    
    history_dict["loss"].append(train_loss)
    history_dict["accuracy"].append(train_acc)
    history_dict["val_loss"].append(val_loss)
    history_dict["val_accuracy"].append(val_acc)
    
    logs = {
        'loss': train_loss, 'accuracy': train_acc, 'f1_score': train_f1,
        'val_loss': val_loss, 'val_accuracy': val_acc, 'val_f1_score': val_f1
    }
    callbacks.on_epoch_end(epoch, logs)
    
    if getattr(model, 'stop_training', False):
        break

callbacks.on_train_end()

class MockHistory:
    def __init__(self, history_dict):
        self.history = history_dict
history = MockHistory(history_dict)

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