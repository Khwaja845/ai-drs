import joblib
import pandas as pd
import shap
import os
import matplotlib.pyplot as plt

# ----------------------------
# PATHS
# ----------------------------
DATA_PATH = os.path.join("data", "binary_clean.csv")
MODEL_PATH = os.path.join("models", "lgb_final.pkl")
OUTPUT_PATH = os.path.join("explainability", "shap_global_summary.png")

TARGET_COL = "Diabetes_binary"

# ----------------------------
# LOAD DATA
# ----------------------------
df = pd.read_csv(DATA_PATH)
X = df.drop(columns=[TARGET_COL])

# ----------------------------
# LOAD MODEL
# ----------------------------
pipeline = joblib.load(MODEL_PATH)

# Extract trained LightGBM model
model = pipeline.named_steps["model"]

# Transform features
X_transformed = pipeline.named_steps["preprocessor"].transform(X)

# ----------------------------
# SHAP EXPLAINER
# ----------------------------
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_transformed)

# For binary classification (take positive class)
if isinstance(shap_values, list):
    shap_values = shap_values[1]

# ----------------------------
# GLOBAL SUMMARY PLOT
# ----------------------------
plt.figure(figsize=(10, 6))
shap.summary_plot(
    shap_values,
    X,
    show=False
)

plt.tight_layout()
plt.savefig(OUTPUT_PATH, dpi=300)
plt.close()

print(f"✅ Global SHAP summary plot saved at: {OUTPUT_PATH}")
