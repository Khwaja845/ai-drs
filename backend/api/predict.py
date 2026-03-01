from fastapi import APIRouter
from backend.schemas.patient import PatientInput
from backend.services.predictor import predict_risk
from backend.core.lab_to_model_mapper import map_lab_to_model

router = APIRouter()

@router.post("")
def predict(payload: dict):
    """
    Accepts:
    1) Manual form input (model features)
    2) Lab report input (converted via mapper)
    """


    if "systolic_bp" in payload:
        model_input = map_lab_to_model(payload)
    else:
        model_input = PatientInput(**payload).dict()

    # LOGGING: Print input and prediction
    print("[PREDICT] Model input:", model_input)

    probability, risk_level = predict_risk(model_input)
    print(f"[PREDICT] Probability: {probability:.4f}, Risk Level: {risk_level}")

    # Compute SHAP values
    from backend.core.shap_utils import compute_shap
    shap_dict = compute_shap(model_input)
    features = list(shap_dict.keys())
    shap_values = list(shap_dict.values())

    return {
        "probability": round(probability, 4),
        "risk_level": risk_level,
        "shap_values": shap_values,
        "features": features,
        "input": model_input
    }
