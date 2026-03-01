# test_predict_manual.py
import pandas as pd
import joblib
import numpy as np

MODEL_PATH = "d:/AI_DRS/models/lgb_final.pkl"
PREPROCESSOR_PATH = "d:/AI_DRS/models/preprocessor.pkl"
TEST_INPUTS_PATH = "d:/AI_DRS/models/ml_test_inputs.csv"

# Load model and preprocessor
model = joblib.load(MODEL_PATH)
try:
    preprocessor = joblib.load(PREPROCESSOR_PATH)
except Exception:
    preprocessor = None


# Helper to get expected columns from model or preprocessor
def get_expected_columns():
    if hasattr(model, 'feature_names_in_'):
        return list(model.feature_names_in_)
    if hasattr(model, 'named_steps') and 'preprocessor' in model.named_steps:
        # Try to get from preprocessor in pipeline
        pre = model.named_steps['preprocessor']
        if hasattr(pre, 'feature_names_in_'):
            return list(pre.feature_names_in_)
    # Fallback: use test input columns
    return list(pd.read_csv(TEST_INPUTS_PATH, nrows=1).columns)

def predict_row(row, expected_cols):
    # row is a Series, convert to DataFrame with correct columns and order
    X = pd.DataFrame([row.values], columns=row.index)
    # Reorder and filter columns to match model expectation
    X = X.reindex(columns=expected_cols)
    # If model is a pipeline, it will handle preprocessing
    prob = model.predict_proba(X)[0,1]
    pred = int(prob >= 0.5)
    return pred, prob


def main():
    df = pd.read_csv(TEST_INPUTS_PATH, comment="#")
    expected_cols = get_expected_columns()
    print("Model expects columns:", expected_cols)
    print("Test input columns:", list(df.columns))
    print("Input, Prediction, Probability")
    for i, row in df.iterrows():
        pred, prob = predict_row(row, expected_cols)
        print(f"{row.values.tolist()} => {pred} (prob={prob:.3f})")

if __name__ == "__main__":
    main()
