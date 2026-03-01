# training/train_final_model.py

import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from imblearn.combine import SMOTEENN
from lightgbm import LGBMClassifier

# ----------------------------
# PATHS
# ----------------------------
DATA_PATH = os.path.join("data", "binary_clean.csv")
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "lgb_final.pkl")

TARGET_COL = "Diabetes_binary"

# ----------------------------
# LOAD DATA
# ----------------------------
df = pd.read_csv(DATA_PATH)

X = df.drop(columns=[TARGET_COL])
y = df[TARGET_COL]

# ----------------------------
# TRAIN / TEST SPLIT (FIRST!)
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# ----------------------------
# SMOTEENN ON TRAIN ONLY
# ----------------------------
smoteenn = SMOTEENN(random_state=42)
X_train_bal, y_train_bal = smoteenn.fit_resample(X_train, y_train)

# ----------------------------
# PREPROCESSING
# ----------------------------
numeric_features = X.columns.tolist()

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numeric_features)
    ]
)

# ----------------------------
# LOAD OPTUNA-TUNED MODEL
# ----------------------------
lgb_best: LGBMClassifier = joblib.load(
    os.path.join(MODEL_DIR, "lgb_best.pkl")
)

lgb_best.set_params(
    objective="binary",
    n_jobs=-1,
    random_state=42
)

# ----------------------------
# PIPELINE
# ----------------------------
pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", lgb_best)
    ]
)

# ----------------------------
# TRAIN FINAL MODEL
# ----------------------------
pipeline.fit(X_train_bal, y_train_bal)

# ----------------------------
# SAVE FINAL MODEL
# ----------------------------
joblib.dump(pipeline, MODEL_PATH)

print("✅ Final LightGBM model trained using SMOTEENN")
print(f"📦 Model saved to: {MODEL_PATH}")
