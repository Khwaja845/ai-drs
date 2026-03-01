# training/evaluate_model.py

import os
import json
import joblib
import pandas as pd

from sklearn.metrics import (
    accuracy_score,
    roc_auc_score,
    f1_score,
    classification_report
)
from sklearn.model_selection import train_test_split
from imblearn.combine import SMOTEENN

# ----------------------------
# PATHS
# ----------------------------
DATA_PATH = os.path.join("data", "binary_clean.csv")
MODEL_PATH = os.path.join("models", "lgb_final.pkl")
OUTPUT_DIR = os.path.join("evaluation")
OUTPUT_JSON = os.path.join(OUTPUT_DIR, "final_metrics.json")

TARGET_COL = "Diabetes_binary"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ----------------------------
# LOAD DATA
# ----------------------------
df = pd.read_csv(DATA_PATH)

X = df.drop(columns=[TARGET_COL])
y = df[TARGET_COL]

# ----------------------------
# TRAIN / TEST SPLIT
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# ----------------------------
# APPLY SMOTEENN (PAPER PROTOCOL)
# ----------------------------
smoteenn = SMOTEENN(random_state=42)
X_test_bal, y_test_bal = smoteenn.fit_resample(X_test, y_test)

# ----------------------------
# LOAD MODEL
# ----------------------------
pipeline = joblib.load(MODEL_PATH)

# ----------------------------
# PREDICTIONS
# ----------------------------
y_prob = pipeline.predict_proba(X_test_bal)[:, 1]
y_pred = (y_prob >= 0.5).astype(int)

# ----------------------------
# METRICS
# ----------------------------
accuracy = accuracy_score(y_test_bal, y_pred)
auc = roc_auc_score(y_test_bal, y_prob)
f1 = f1_score(y_test_bal, y_pred)

report_dict = classification_report(
    y_test_bal,
    y_pred,
    digits=4,
    output_dict=True
)

# ----------------------------
# SAVE METRICS TO JSON
# ----------------------------
results = {
    "model": "LightGBM (SMOTEENN)",
    "accuracy": round(accuracy, 6),
    "auc": round(auc, 6),
    "f1_score": round(f1, 6),
    "threshold": 0.5,
    "samples_evaluated": int(len(y_test_bal)),
    "classification_report": report_dict
}

with open(OUTPUT_JSON, "w") as f:
    json.dump(results, f, indent=4)

# ----------------------------
# PRINT RESULTS
# ----------------------------
print("\n🏆 FINAL PAPER-COMPARABLE RESULTS (SMOTEENN)")
print(f"Accuracy : {accuracy * 100:.2f}%")
print(f"AUC      : {auc * 100:.2f}%")
print(f"F1-score : {f1 * 100:.2f}%\n")

print("📄 Classification Report")
print(classification_report(y_test_bal, y_pred, digits=4))

print(f"\n✅ Metrics saved to: {OUTPUT_JSON}")
