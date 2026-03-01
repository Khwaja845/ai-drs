def extract_lab_values_from_excel(excel_bytes: bytes) -> dict:
    """Extract lab values from Excel (.xlsx, .xls)"""
    try:
        import pandas as pd
        import io
        import numpy as np
        df = pd.read_excel(io.BytesIO(excel_bytes))
        logger.info(f"Excel columns found: {df.columns.tolist()}")

        # Assume first row is the data
        row = df.iloc[0].to_dict()
        logger.info(f"Raw Excel row: {row}")

        # Normalize keys: lowercase, strip, replace spaces/dashes with underscores
        def normalize_key(k):
            return str(k).strip().lower().replace(" ", "_").replace("-", "_")

        # Define all 21 features (customize as needed)
        required_features = [
            "systolic_bp", "diastolic_bp", "cholesterol", "hdl", "ldl", "triglycerides", "bmi", "weight", "height", "waist_circumference",
            "smoking_status", "alcohol_consumption", "physical_activity", "sex", "age", "glucose", "family_history", "hypertension",
            "diabetes", "medication", "ethnicity"
        ]

        # Lowercase, normalize, and remove NaN values
        result = {}
        for k, v in row.items():
            key = normalize_key(k)
            if pd.isna(v):
                continue
            result[key] = v

        # Detect missing features
        missing = [feature for feature in required_features if feature not in result or result[feature] is None]
        logger.info(f"Processed Excel row (normalized): {result}")
        logger.info(f"Missing features: {missing}")
        return result, missing
    except Exception as e:
        error_detail = f"Failed to extract from Excel: {str(e)}"
        logger.error(error_detail)
        raise HTTPException(status_code=400, detail=error_detail)
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.core.lab_to_model_mapper import map_lab_to_model
from backend.core.lab_field_mapper import map_real_to_model_fields
from backend.services.predictor import predict_risk
import pytesseract
from PIL import Image
import io
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def extract_lab_values_from_image(image_bytes: bytes) -> dict:
    """Extract lab values from image using OCR"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        
        # Parse lab values from text
        lab_values = parse_lab_text(text)
        return lab_values
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract from image: {str(e)}")

def extract_lab_values_from_pdf(pdf_bytes: bytes) -> dict:
    """Extract lab values from PDF"""
    try:
        import PyPDF2
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        
        lab_values = parse_lab_text(text)
        return lab_values
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract from PDF: {str(e)}")

def extract_lab_values_from_docx(docx_bytes: bytes) -> dict:
    """Extract lab values from DOCX"""
    try:
        from docx import Document
        doc = Document(io.BytesIO(docx_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        
        lab_values = parse_lab_text(text)
        return lab_values
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract from DOCX: {str(e)}")

def parse_lab_text(text: str) -> dict:
    """Parse lab values from extracted text"""
    # Basic parsing - look for common lab value patterns
    # This is a simplified version - enhance based on your actual lab report format
    
    lab_values = {
        "systolic_bp": 120,  # Default values
        "cholesterol": 180,
        "bmi": 25,
        "physical_activity": "Yes",
        "sex": "Male",
        "age": 50,
    }
    
    # Enhanced parsing (you can customize this based on actual lab report format)
    text_lower = text.lower()
    
    # Extract systolic BP
    if "systolic" in text_lower or "sbp" in text_lower:
        import re
        matches = re.findall(r'systolic[:\s]*(\d+)', text_lower)
        if matches:
            lab_values["systolic_bp"] = int(matches[0])
    
    # Extract cholesterol
    if "cholesterol" in text_lower:
        import re
        matches = re.findall(r'cholesterol[:\s]*(\d+)', text_lower)
        if matches:
            lab_values["cholesterol"] = int(matches[0])
    
    # Extract BMI
    if "bmi" in text_lower:
        import re
        matches = re.findall(r'bmi[:\s]*(\d+\.?\d*)', text_lower)
        if matches:
            lab_values["bmi"] = float(matches[0])
    
    return lab_values

@router.post("")
async def upload_lab_report(file: UploadFile = File(...)):
    """
    Upload and process lab report file
    Supports: PNG, JPEG, PDF, DOCX, Excel
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Read file content
    content = await file.read()
    file_ext = file.filename.split(".")[-1].lower()

    # Extract lab values based on file type
    if file_ext in ["png", "jpg", "jpeg"]:
        lab_values = extract_lab_values_from_image(content)
    elif file_ext == "pdf":
        lab_values = extract_lab_values_from_pdf(content)
    elif file_ext == "docx":
        lab_values = extract_lab_values_from_docx(content)
    elif file_ext in ["xlsx", "xls"]:
        lab_values, _ = extract_lab_values_from_excel(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # Log extracted values for debugging
    logger.info(f"Extracted lab_values (raw): {lab_values}")

    # Map real-world fields to model keywords
    mapped_lab_values = map_real_to_model_fields(lab_values)
    logger.info(f"Mapped lab_values: {mapped_lab_values}")

    # Validation: required fields (all 21 features)
    required_fields = [
        "systolic_bp", "diastolic_bp", "cholesterol", "hdl", "ldl", "triglycerides", "bmi", "weight", "height", "waist_circumference",
        "smoking_status", "alcohol_consumption", "physical_activity", "sex", "age", "glucose", "family_history", "hypertension",
        "diabetes", "medication", "ethnicity"
    ]
    missing = [f for f in required_fields if f not in mapped_lab_values or mapped_lab_values[f] is None]
    logger.info(f"Missing features after mapping: {missing}")

    # If any required features are missing, return them to the frontend
    if missing:
        return {
            "missing_fields": missing,
            "lab_values": mapped_lab_values,
            "message": f"Please provide values for the missing fields: {', '.join(missing)}"
        }

    # Map lab values to model input
    model_input = map_lab_to_model(mapped_lab_values)

    # Get prediction
    probability, risk_level = predict_risk(model_input)

    return {
        "risk_score": round(probability, 4),
        "risk_level": risk_level,
        "input": model_input,
        "lab_values": mapped_lab_values,
    }
