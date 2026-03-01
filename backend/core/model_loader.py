import joblib
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

model = joblib.load(BASE.parent / "models" / "lgb_final.pkl")

with open(BASE.parent / "models" / "feature_names.json") as f:
    FEATURE_NAMES = json.load(f)
