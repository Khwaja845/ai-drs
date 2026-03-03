import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay, RocCurveDisplay
from sklearn.model_selection import train_test_split
from imblearn.combine import SMOTEENN

# ----------------------------
# SETTINGS (Matching your existing structure)
# ----------------------------
DATA_PATH = os.path.join("data", "binary_clean.csv")
MODEL_PATH = os.path.join("models", "lgb_final.pkl")
OUTPUT_DIR = os.path.join("evaluation", "plots")
TARGET_COL = "Diabetes_binary"

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("🔄 Loading data and model...")
df = pd.read_csv(DATA_PATH)
pipeline = joblib.load(MODEL_PATH)

# ----------------------------
# REPRODUCE TEST SET (Same as your training script)
# ----------------------------
X = df.drop(columns=[TARGET_COL])
y = df[TARGET_COL]

_, X_test, _, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

print("⚖️ Applying SMOTEENN to test set...")
smoteenn = SMOTEENN(random_state=42)
X_test_bal, y_test_bal = smoteenn.fit_resample(X_test, y_test)

# ----------------------------
# GENERATE PREDICTIONS
# ----------------------------
print("🔮 Generating predictions...")
y_prob = pipeline.predict_proba(X_test_bal)[:, 1]
y_pred = (y_prob >= 0.5).astype(int)

# ----------------------------
# PLOT 1: CONFUSION MATRIX
# ----------------------------
print("📊 Saving Confusion Matrix...")
fig, ax = plt.subplots(figsize=(8, 6))
ConfusionMatrixDisplay.from_predictions(
    y_test_bal, y_pred, 
    display_labels=["No Diabetes", "Diabetes"],
    cmap='Blues', 
    ax=ax
)
ax.set_title("Confusion Matrix (Final Model)")
plt.savefig(os.path.join(OUTPUT_DIR, "confusion_matrix.png"), dpi=300)
plt.close()

# ----------------------------
# PLOT 2: ROC CURVE
# ----------------------------
print("📈 Saving ROC Curve...")
fig, ax = plt.subplots(figsize=(8, 6))
RocCurveDisplay.from_predictions(y_test_bal, y_prob, ax=ax)
ax.set_title("ROC Curve (Final Model)")
plt.plot([0, 1], [0, 1], 'k--') # Add diagonal baseline
plt.savefig(os.path.join(OUTPUT_DIR, "roc_curve.png"), dpi=300)
plt.close()

print(f"\n✨ Success! Your plots are in the '{OUTPUT_DIR}' folder.")
