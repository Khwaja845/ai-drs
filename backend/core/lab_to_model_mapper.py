def age_bucket(age):
    if age < 25: return 1
    elif age < 35: return 2
    elif age < 45: return 3
    elif age < 55: return 4
    elif age < 65: return 5
    else: return 6

def map_lab_to_model(lab):
    return {
        "HighBP": 1 if lab["systolic_bp"] >= 140 else 0,
        "HighChol": 1 if lab["cholesterol"] >= 200 else 0,
        "CholCheck": 1,
        "BMI": lab["bmi"],
        "Smoker": 0,
        "Stroke": 0,
        "HeartDiseaseorAttack": 0,
        "PhysActivity": 1 if lab["physical_activity"] == "Yes" else 0,
        "Fruits": 1,
        "Veggies": 1,
        "HvyAlcoholConsump": 0,
        "AnyHealthcare": 1,
        "NoDocbcCost": 0,
        "GenHlth": 3,
        "MentHlth": 0,
        "PhysHlth": 5,
        "DiffWalk": 0,
        "Sex": 1 if lab["sex"] == "Male" else 0,
        "Age": age_bucket(lab["age"]),
        "Education": 4,
        "Income": 6
    }
