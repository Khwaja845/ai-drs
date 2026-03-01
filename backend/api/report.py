from fastapi import APIRouter, Response
from backend.services.pdf_service import generate_pdf_report

router = APIRouter()

@router.post("")
def generate_report(payload: dict):
    pdf_bytes = generate_pdf_report(payload)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=diabetes_report.pdf"
        }
    )
