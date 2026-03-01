import os
import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from imblearn.combine import SMOTEENN

TARGET = "Diabetes_binary"

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

def preprocess_data():
    df = pd.read_csv(os.path.join(DATA_DIR, "binary_clean.csv"))

    X = df.drop(columns=[TARGET])
    y = df[TARGET]

    num_cols = X.select_dtypes(include=["int64", "float64"]).columns
    cat_cols = X.select_dtypes(include=["object", "category"]).columns

    preprocessor = ColumnTransformer([
        ("num", StandardScaler(), num_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols)
    ])

    X_processed = preprocessor.fit_transform(X)

    smote = SMOTEENN(random_state=42)
    X_res, y_res = smote.fit_resample(X_processed, y)

    joblib.dump(preprocessor, os.path.join(MODELS_DIR, "preprocessor.pkl"))
    return X_res, y_res
