from pydantic import BaseModel
from typing import Dict

class PredictionResponse(BaseModel):
    risk_score: float
    risk_level: str
    shap_values: Dict[str, float]
