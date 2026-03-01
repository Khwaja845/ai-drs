from pydantic import BaseModel

class PatientInput(BaseModel):
    HighBP: int = 0
    HighChol: int = 0
    CholCheck: int = 0
    BMI: float = 0
    Smoker: int = 0
    Stroke: int = 0
    HeartDiseaseorAttack: int = 0
    PhysActivity: int = 0
    Fruits: int = 0
    Veggies: int = 0
    HvyAlcoholConsump: int = 0
    AnyHealthcare: int = 0
    NoDocbcCost: int = 0
    GenHlth: int = 0
    MentHlth: int = 0
    PhysHlth: int = 0
    DiffWalk: int = 0
    Sex: int = 0
    Age: int = 0
    Education: int = 0
    Income: int = 0
