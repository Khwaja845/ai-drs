# This file maps real-world lab report field names to model feature keywords.
# Add as many mappings as needed for your use case.

REAL_TO_MODEL_FIELD_MAP = {
    # Systolic Blood Pressure
    "systolic": "systolic_bp",
    "systolic_bp": "systolic_bp",
    "sbp": "systolic_bp",
    "blood pressure systolic": "systolic_bp",
    "bp systolic": "systolic_bp",
    "systolic bp": "systolic_bp",
    # Diastolic Blood Pressure
    "diastolic": "diastolic_bp",
    "diastolic_bp": "diastolic_bp",
    "dbp": "diastolic_bp",
    "blood pressure diastolic": "diastolic_bp",
    "bp diastolic": "diastolic_bp",
    "diastolic bp": "diastolic_bp",
    # Cholesterol
    "chol": "cholesterol",
    "cholesterol": "cholesterol",
    "total cholesterol": "cholesterol",
    # HDL
    "hdl": "hdl",
    "hdl cholesterol": "hdl",
    # LDL
    "ldl": "ldl",
    "ldl cholesterol": "ldl",
    # Triglycerides
    "triglycerides": "triglycerides",
    "triglyceride": "triglycerides",
    # BMI
    "bmi": "bmi",
    "body mass index": "bmi",
    # Weight
    "weight": "weight",
    "body weight": "weight",
    # Height
    "height": "height",
    "body height": "height",
    # Waist Circumference
    "waist circumference": "waist_circumference",
    "waist_circumference": "waist_circumference",
    "waist": "waist_circumference",
    # Smoking Status
    "smoking status": "smoking_status",
    "smoking_status": "smoking_status",
    "smoker": "smoking_status",
    # Alcohol Consumption
    "alcohol consumption": "alcohol_consumption",
    "alcohol_consumption": "alcohol_consumption",
    "alcohol": "alcohol_consumption",
    # Physical Activity
    "physical activity": "physical_activity",
    "physical_activity": "physical_activity",
    "activity": "physical_activity",
    "exercise": "physical_activity",
    "physactivity": "physical_activity",
    # Sex
    "sex": "sex",
    "gender": "sex",
    # Age
    "age": "age",
    "patient age": "age",
    # Glucose
    "glucose": "glucose",
    "blood glucose": "glucose",
    # Family History
    "family history": "family_history",
    "family_history": "family_history",
    # Hypertension
    "hypertension": "hypertension",
    # Diabetes
    "diabetes": "diabetes",
    # Medication
    "medication": "medication",
    # Ethnicity
    "ethnicity": "ethnicity",
}

def normalize_field_name(field_name: str) -> str:
    """Normalize field names: lowercase, replace underscores/hyphens with spaces"""
    return field_name.strip().lower().replace("_", " ").replace("-", " ")

def map_real_to_model_fields(lab_dict):
    """
    Convert a dict of real-world lab fields to model keywords using the mapping above.
    Handles underscores, spaces, and hyphens flexibly.
    """
    mapped = {}
    required_features = [
        "systolic_bp", "diastolic_bp", "cholesterol", "hdl", "ldl", "triglycerides", "bmi", "weight", "height", "waist_circumference",
        "smoking_status", "alcohol_consumption", "physical_activity", "sex", "age", "glucose", "family_history", "hypertension",
        "diabetes", "medication", "ethnicity"
    ]
    for k, v in lab_dict.items():
        normalized_key = normalize_field_name(k)
        model_key = REAL_TO_MODEL_FIELD_MAP.get(normalized_key)
        if not model_key and normalized_key.replace(" ", "_") in required_features:
            model_key = normalized_key.replace(" ", "_")
        if model_key:
            mapped[model_key] = v
    return mapped
