import joblib
import pandas as pd
import shap
import os

# ----------------------------
# PATHS
# ----------------------------
DATA_PATH = os.path.join("data", "binary_clean.csv")
MODEL_PATH = os.path.join("models", "lgb_final.pkl")
OUTPUT_PATH = os.path.join("explainability", "shap_local_force.html")

TARGET_COL = "Diabetes_binary"
SAMPLE_INDEX = 0  # change patient index here

# ----------------------------
# LOAD DATA
# ----------------------------
df = pd.read_csv(DATA_PATH)
X = df.drop(columns=[TARGET_COL])

# ----------------------------
# LOAD MODEL
# ----------------------------
pipeline = joblib.load(MODEL_PATH)
model = pipeline.named_steps["model"]

X_transformed = pipeline.named_steps["preprocessor"].transform(X)

# ----------------------------
# SHAP EXPLAINER
# ----------------------------
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_transformed)

# Handle binary output
if isinstance(shap_values, list):
    shap_values = shap_values[1]
    base_value = explainer.expected_value[1]
else:
    base_value = explainer.expected_value

# ----------------------------
# LOCAL FORCE PLOT (HTML)
# ----------------------------
force_plot = shap.force_plot(
    base_value,
    shap_values[SAMPLE_INDEX],
    X.iloc[SAMPLE_INDEX],
    matplotlib=False
)

shap.save_html(OUTPUT_PATH, force_plot)

print(f"✅ Local SHAP force plot saved at: {OUTPUT_PATH}")
