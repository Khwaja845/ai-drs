import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_val_score
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.combine import SMOTEENN

# ----------------------------
# SETTINGS
# ----------------------------
DATA_PATH = os.path.join("data", "binary_clean.csv")
MODEL_PATH = os.path.join("models", "lgb_final.pkl")
TARGET_COL = "Diabetes_binary"

print("🔄 Loading data and model components...")
df = pd.read_csv(DATA_PATH)
X = df.drop(columns=[TARGET_COL])
y = df[TARGET_COL]

# Load your existing pipeline to get your tuned hyperparameters
final_pipeline = joblib.load(MODEL_PATH)
lgbm_model = final_pipeline.named_steps['model']

# ----------------------------
# DEFINE CV STRATEGY (Paper Protocol)
# ----------------------------
# We use an Imbalance-aware Pipeline to ensure SMOTEENN 
# is ONLY applied to the training folds, not the validation folds.
cv_pipeline = ImbPipeline(steps=[
    ('smoteenn', SMOTEENN(random_state=42)),
    ('model', lgbm_model)
])

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

print(f"🧪 Running 5-Fold Cross-Validation...")
# Use 'accuracy' or 'roc_auc' depending on what the reviewers asked for
cv_results = cross_val_score(cv_pipeline, X, y, cv=skf, scoring='accuracy', n_jobs=-1)

# ----------------------------
# RESULTS
# ----------------------------
mean_acc = cv_results.mean()
std_acc = cv_results.std()

print("\n📊 CROSS-VALIDATION FINAL REPORT")
print("-" * 30)
print(f"Individual Fold Accuracies: {np.round(cv_results, 4)}")
print(f"Mean Accuracy: {mean_acc * 100:.2f}%")
print(f"Standard Deviation: {std_acc * 100:.2f}%")
print(f"\n✅ Final Result for Paper: {mean_acc * 100:.2f}% ± {std_acc * 100:.2f}%")
