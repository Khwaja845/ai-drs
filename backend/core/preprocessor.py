import pandas as pd
from backend.core.model_loader import FEATURE_NAMES

def prepare_input(data: dict):
    df = pd.DataFrame([data])
    return df[FEATURE_NAMES]
