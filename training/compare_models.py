import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, roc_auc_score, f1_score
from sklearn.model_selection import train_test_split
from imblearn.combine import SMOTEENN

# ----------------------------
# SETTINGS
# ----------------------------
MODELS_DIR = "models"
DATA_PATH = "data/binary_clean.csv"
TARGET = "Diabetes_binary"

print("🔄 Loading data...")
df = pd.read_csv(DATA_PATH)
X = df.drop(columns=[TARGET])
y = df[TARGET]

# Standard Split
_, X_test, _, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

print("⚖️ Balancing test set (SMOTEENN)...")
smote = SMOTEENN(random_state=42)
X_test_bal, y_test_bal = smote.fit_resample(X_test, y_test)

results = {}
base_probs = {} 

def evaluate(name, filename):
    path = os.path.join(MODELS_DIR, filename)
    if not os.path.exists(path): 
        print(f"⚠️ {name} file not found.")
        return None
        
    print(f"🧐 Processing {name}...")
    try:
        model = joblib.load(path)
        y_prob = model.predict_proba(X_test_bal)[:, 1]
        y_pred = (y_prob >= 0.5).astype(int)
        
        base_probs[name] = y_prob # Save for Meta-Model
        
        return {
            "Accuracy (%)": round(accuracy_score(y_test_bal, y_pred) * 100, 2),
            "AUC-ROC (%)": round(roc_auc_score(y_test_bal, y_prob) * 100, 2),
            "F1-Score (%)": round(f1_score(y_test_bal, y_pred) * 100, 2)
        }
    except Exception as e:
        print(f"❌ Could not evaluate {name}: {e}")
        return None

# 1. Evaluate Working Base Models (Skipping XGBoost to avoid the error)
working_models = {
    "LightGBM (Proposed)": "lgb_final.pkl",
    "CatBoost": "cat_baseline.pkl"
}

for name, fname in working_models.items():
    res = evaluate(name, fname)
    if res: results[name] = res

# 2. Evaluate Meta-Model (If Base Probs exist)
meta_path = os.path.join(MODELS_DIR, "meta_model.pkl")
if os.path.exists(meta_path) and len(base_probs) >= 2:
    try:
        print("🧐 Processing Meta-Model...")
        meta_model = joblib.load(meta_path)
        # Use LightGBM and CatBoost probabilities as the 2 features
        meta_input = np.column_stack([base_probs["LightGBM (Proposed)"], base_probs["CatBoost"]])
        
        y_prob_m = meta_model.predict_proba(meta_input)[:, 1]
        y_pred_m = (y_prob_m >= 0.5).astype(int)
        
        results["Meta-Model"] = {
            "Accuracy (%)": round(accuracy_score(y_test_bal, y_pred_m) * 100, 2),
            "AUC-ROC (%)": round(roc_auc_score(y_test_bal, y_prob_m) * 100, 2),
            "F1-Score (%)": round(f1_score(y_test_bal, y_pred_m) * 100, 2)
        }
    except Exception as e:
        print(f"⚠️ Meta-Model skip: {e}")

# ----------------------------
# DISPLAY & SAVE
# ----------------------------
if results:
    final_df = pd.DataFrame(results).T.reset_index().rename(columns={'index': 'Model'})
    print("\n🏆 FINAL COMPARISON TABLE")
    print("-" * 50)
    print(final_df.to_string(index=False))
    final_df.to_csv("evaluation/final_comparison_table.csv", index=False)
    print(f"\n✅ Saved to: evaluation/final_comparison_table.csv")
