from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.health import router as health_router
from backend.api.predict import router as predict_router
from backend.api.explain import router as explain_router
from backend.api.report import router as report_router
from backend.api.upload import router as upload_router

app = FastAPI(
    title="AI Diabetes Risk System",
    description="ML-powered Diabetes Risk Prediction (Backend-only API)",
    version="1.0.0"
)

# ✅ CORS (React → FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "Backend running",
        "health": "/health",
        "predict": "/predict",
        "explain": "/explain",
        "report": "/report",
        "upload": "/upload"
    }

app.include_router(health_router, prefix="/health")
app.include_router(predict_router, prefix="/predict")
app.include_router(explain_router, prefix="/explain")
app.include_router(report_router, prefix="/report")
app.include_router(upload_router, prefix="/upload")
