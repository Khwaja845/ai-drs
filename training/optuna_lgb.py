import os
import optuna
import joblib
from lightgbm import LGBMClassifier
from sklearn.model_selection import cross_val_score
from preprocessing import preprocess_data

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

X, y = preprocess_data()

def objective(trial):
    params = {
        "n_estimators": trial.suggest_int("n_estimators", 800, 2000),
        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.05),
        "max_depth": trial.suggest_int("max_depth", 4, 10),
        "num_leaves": trial.suggest_int("num_leaves", 20, 100),
        "class_weight": "balanced",
        "random_state": 42
    }
    model = LGBMClassifier(**params)
    return cross_val_score(model, X, y, cv=5, scoring="roc_auc").mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=40)

best_model = LGBMClassifier(**study.best_params, class_weight="balanced")
best_model.fit(X, y)

joblib.dump(best_model, os.path.join(MODELS_DIR, "lgb_best.pkl"))
