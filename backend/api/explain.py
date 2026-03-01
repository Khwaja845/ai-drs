from fastapi import APIRouter
from backend.core.shap_utils import compute_shap
from backend.core.lab_to_model_mapper import map_lab_to_model
from backend.schemas.patient import PatientInput

router = APIRouter()

@router.post("")
def explain(payload: dict):
    """
    Returns feature-wise SHAP contributions
    """

    if "systolic_bp" in payload:
        model_input = map_lab_to_model(payload)
    else:
        model_input = PatientInput(**payload).dict()

    shap_values = compute_shap(model_input)

    return {
        "shap_values": shap_values
    }
