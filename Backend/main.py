# main.py - FINAL CUMULATIVE VERSION WITH OCR FALLBACK
import io
import uuid
import re
from datetime import datetime
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
from pypdf import PdfReader

# Internal imports
from vector_store import search_duplicate, add_to_index
from fraud_detection import detect_pii, analyze_metadata
from image_forensics import detect_tampering, get_image_phash
from pydantic import BaseModel, Field

app = FastAPI(title="AP FraudShield Final")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

db = {}

# ----- Helper Functions ----- #

class AlertRequest(BaseModel):
    message: str


class AlertResponse(BaseModel):
    status: str


def clean_text(text: str) -> str:
    """Clean and normalize extracted text."""
    cleaned = re.sub(r"[^\w\s.,:/-]", " ", text)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()

def extract_text_from_file(content: bytes, filename: str) -> str:
    """
    Universal text extraction with guaranteed OCR fallback for image-based PDFs.
    """
    name = filename.lower()

    # 1. Handle Direct Images (JPG, PNG)
    if name.endswith((".jpg", ".jpeg", ".png")):
        try:
            image = Image.open(io.BytesIO(content)).convert("L")
            text = pytesseract.image_to_string(image)
            return clean_text(text)
        except Exception as e:
            print(f"Image OCR error: {e}")
            return ""

    # 2. Handle PDF Files with Guaranteed OCR Fallback
    if name.endswith(".pdf"):
        fast_text = ""
        try:
            # Attempt Native Text Extraction first
            reader = PdfReader(io.BytesIO(content))
            pages_text = []
            for i, page in enumerate(reader.pages):
                if i >= 5: break  # Limit to first 5 pages for speed
                pages_text.append(page.extract_text() or "")
            
            fast_text = clean_text(" ".join(pages_text))
            
            # If native extraction found substantial text (over 50 chars), use it
            if len(fast_text.strip()) > 50:
                print(f"[PDF-TEXT] Extracted {len(fast_text)} chars natively.")
                return fast_text
                
        except Exception as e:
            print(f"PDF native extraction failed: {e}")

        # --- THE FIX: OCR FALLBACK ---
        # If fast_text is empty or too short, it's likely a scanned/image PDF
        print(f"[PDF-OCR] Native text insufficient. Triggering OCR fallback...")
        try:
            # Convert PDF pages to images for Tesseract
            # pdf2image is used to render the page visually so OCR can read it
            images = convert_from_bytes(content, dpi=150, first_page=1, last_page=3)
            ocr_parts = []
            for img in images:
                # Process in grayscale for better accuracy
                ocr_parts.append(pytesseract.image_to_string(img.convert("L")))
            
            ocr_text = clean_text(" ".join(ocr_parts))
            print(f"[PDF-OCR] OCR successful. Extracted {len(ocr_text)} characters.")
            return ocr_text if ocr_text.strip() else fast_text
            
        except Exception as e:
            print(f"Critical OCR Fallback Error: {e}")
            return fast_text

    return ""

# ----- Main Scan Route ----- #

@app.post("/api/v1/scan/upload")
async def upload_scan(file: UploadFile = File(...)):
    """
    Evaluates every possible fraud layer before reaching a final conclusion.
    Goal: Prioritize forensic evidence over content markers and fix image-PDF OCR issue.
    """
    start_time = datetime.now()
    content = await file.read()
    filename = file.filename
    task_id = str(uuid.uuid4())

    # 1. UPDATED: OCR & Table Extraction (The Reader Goals)
    # Using the new extract_text_from_file helper to ensure OCR fallback 
    text = extract_text_from_file(content, filename)
    
    tables = []
    if filename.lower().endswith(".pdf"):
        try:
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                tables = [p.extract_table() for p in pdf.pages if p.extract_table()]
        except Exception as e:
            print(f"[TABLES] Extraction error: {e}")

    # 2. RUN ALL CHECKS SIMULTANEOUSLY (Cumulative Logic)
    img_hash = get_image_phash(content)
    is_dup, _ = search_duplicate(text, img_hash)
    tamper_msg = detect_tampering(content, filename)
    meta_issue = analyze_metadata(content, text)
    pii_found = detect_pii(text)

    # 3. CUMULATIVE SCORING
    # Ensures forensic evidence overrides "safe" text results.
    fraud_score = 0
    anomalies = []

    # Physical Forensic Evidence (Highest Priority)
    if tamper_msg:
        fraud_score = max(fraud_score, 90) # Force High Score
        anomalies.append({"type": "Forensic Tampering", "description": tamper_msg})
    
    # Metadata Evidence
    if meta_issue:
        fraud_score = max(fraud_score, 85) # Force High Score
        anomalies.append({"type": "Metadata Fraud", "description": meta_issue})
    
    # Similarity Evidence (Duplicate Hunter)
    if is_dup:
        fraud_score = 100
        anomalies.append({"type": "Duplicate Discovery", "description": "Visual or text match found."})
    
    # Content Evidence (PII Detection)
    if pii_found:
        anomalies.append({"type": "PII Detected", "description": f"Contains: {pii_found}"})
        # Only add score if not already at critical levels 
        if fraud_score < 30: fraud_score += 20

    # 4. FINAL VERDICT
    severity = "CRITICAL" if fraud_score >= 70 else "WARNING" if fraud_score >= 30 else "SAFE"
    if not is_dup: add_to_index(text, img_hash)

    result = {
        "file_id": task_id,
        "filename": filename,
        "fraud_score": min(100, fraud_score),
        "severity": severity,
        "anomalies": anomalies,
        "text_content": text,  # Return extracted text for verification
        "extracted_tables": tables,
        "processing_time": int((datetime.now() - start_time).total_seconds() * 1000)
    }
    db[task_id] = result
    return {"task_id": task_id, "message": "Unified fraud analysis concluded."}

@app.get("/api/v1/scan/result/{task_id}")
async def get_result(task_id: str):
    return db.get(task_id, {"error": "Verdict not found"})


@app.get("/api/v1/dashboard/stats")
def get_dashboard_stats():
    return {
        "summary": {
            "total_scanned": 14205,
            "fraud_detected": 45,
            "savings_in_crores": 1.2,
        },
        "weekly_activity": [
            {"day": "Mon", "uploads": 120, "fraud": 2},
            {"day": "Tue", "uploads": 150, "fraud": 5},
            {"day": "Wed", "uploads": 180, "fraud": 1},
            {"day": "Thu", "uploads": 90, "fraud": 0},
            {"day": "Fri", "uploads": 200, "fraud": 8},
            {"day": "Sat", "uploads": 50, "fraud": 0},
            {"day": "Sun", "uploads": 30, "fraud": 0},
        ],
        "recent_scans": [
            {"id": "1", "filename": "invoice_992.pdf", "status": "safe", "timestamp": "2 mins ago"},
            {"id": "2", "filename": "contract_v2.docx", "status": "warning", "timestamp": "5 mins ago"},
        ],
    }

@app.get("/health")
@app.get("/api/v1/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "AP FraudShield API"
    }

@app.post("/api/v1/admin/trigger-alert", response_model=AlertResponse)
def trigger_alert(payload: AlertRequest):
    # In real-world, push to message bus/notification service.
    return {"status": "sent"}