from backend.core.model_loader import model
from backend.core.preprocessor import prepare_input

def predict_risk(data: dict):
    X = prepare_input(data)
    prob = model.predict_proba(X)[0][1]

    if prob < 0.33:
        level = "Low"
    elif prob < 0.66:
        level = "Medium"
    else:
        level = "High"

    return prob, level
