from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime

def generate_pdf_report(data: dict) -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 800, "Diabetes Risk Prediction Report")

    c.setFont("Helvetica", 11)
    c.drawString(50, 770, f"Generated on: {datetime.now().strftime('%d-%m-%Y %H:%M')}")

    # Add Name and Mobile fields if present
    y = 750
    name = data.get("name", "")
    mobile = data.get("mobile", "")
    if name:
        c.drawString(50, y, f"Name: {name}")
        y -= 15
    if mobile:
        c.drawString(50, y, f"Mobile: {mobile} ")  # Add space after mobile number
        y -= 60  # Big space before Prediction Summary

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Prediction Summary")
    y -= 20

    c.setFont("Helvetica", 11)
    c.drawString(50, y, f"Risk Level: {data.get('risk_level', 'N/A')}")
    y -= 15
    c.drawString(50, y, f"Risk Score: {data.get('risk_score', 'N/A')}")

    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Model Explainability (Top Factors)")
    y -= 20

    shap_values = data.get("shap_values", {})
    for feature, value in list(shap_values.items())[:6]:
        c.setFont("Helvetica", 10)
        c.drawString(60, y, f"{feature}: {round(value, 4)}")
        y -= 14

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer.read()
