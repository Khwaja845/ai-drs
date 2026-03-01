import shap
from backend.core.model_loader import model
from backend.core.preprocessor import prepare_input

# Extract the actual model from the pipeline if it's wrapped
if hasattr(model, 'named_steps'):
    # It's a sklearn Pipeline - extract the final estimator
    base_model = model.named_steps[list(model.named_steps.keys())[-1]]
else:
    base_model = model

explainer = shap.TreeExplainer(base_model)

def compute_shap(data):
    X = prepare_input(data)
    shap_vals = explainer.shap_values(X)
    
    # Handle both binary and multiclass SHAP output
    if isinstance(shap_vals, list):
        # Multiclass: take the positive class (class 1)
        values = shap_vals[1][0] if len(shap_vals) > 1 else shap_vals[0][0]
    else:
        # Binary: shap_vals is already the array
        values = shap_vals[0]
    
    return dict(zip(X.columns, values))
