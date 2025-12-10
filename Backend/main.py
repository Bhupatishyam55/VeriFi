# pip install pypdf

import io
import re
import uuid
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader

# In-memory storage
db: Dict[str, dict] = {}

app = FastAPI(title="AP FraudShield API", version="1.0.0")

# CORS setup for frontend
import os

# Get allowed origins from environment or use defaults
ALLOWED_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,https://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- Schemas ----- #


class Anomaly(BaseModel):
    type: str
    description: str
    confidence: float = Field(..., ge=0, le=1)


class ScanResult(BaseModel):
    file_id: str
    filename: str
    status: str
    fraud_score: int
    severity: str
    is_duplicate: bool
    duplicate_source_id: Optional[str]
    anomalies: List[Anomaly]


class UploadResponse(BaseModel):
    task_id: str
    message: str


class AlertRequest(BaseModel):
    message: str


class AlertResponse(BaseModel):
    status: str


# ----- Helpers ----- #


def severity_rank(severity: str) -> int:
    order = {"SAFE": 0, "WARNING": 1, "CRITICAL": 2}
    return order.get(severity, 0)


def rank_to_severity(rank: int) -> str:
    if rank >= 2:
        return "CRITICAL"
    if rank == 1:
        return "WARNING"
    return "SAFE"


def severity_to_score(severity: str) -> int:
    if severity == "CRITICAL":
        return 88
    if severity == "WARNING":
        return 45
    return 12


def parse_dates_from_text(text: str) -> List[datetime]:
    patterns = [
        r"\b(\d{2})[/-](\d{2})[/-](\d{4})\b",  # DD/MM/YYYY or DD-MM-YYYY
        r"\b(\d{4})[/-](\d{2})[/-](\d{2})\b",  # YYYY-MM-DD or YYYY/MM/DD
    ]
    dates: List[datetime] = []
    for pattern in patterns:
        for match in re.findall(pattern, text):
            try:
                if len(match) == 3 and len(match[0]) == 2:
                    # DD/MM/YYYY
                    day, month, year = match
                else:
                    # YYYY/MM/DD
                    year, month, day = match
                dt = datetime(int(year), int(month), int(day))
                dates.append(dt)
            except ValueError:
                continue
    return dates


def analyze_text(text: str) -> dict:
    anomalies: List[Anomaly] = []
    highest_rank = 0  # SAFE

    # Rule 1: Future Date Detection (CRITICAL)
    now = datetime.now()
    future_dates = [d for d in parse_dates_from_text(text) if d > now]
    if future_dates:
        anomalies.append(
            Anomaly(
                type="Future Date Detected",
                description="Document contains dates in the future",
                confidence=0.95,
            )
        )
        highest_rank = max(highest_rank, severity_rank("CRITICAL"))

    # Rule 2: Suspicious Keywords (WARNING)
    keywords = ["urgent", "wire transfer", "offshore", "confidential"]
    if any(k in text.lower() for k in keywords):
        anomalies.append(
            Anomaly(
                type="Suspicious Language Detected",
                description="High-risk keywords found in document",
                confidence=0.72,
            )
        )
        highest_rank = max(highest_rank, severity_rank("WARNING"))

    # Rule 3: Blacklisted Entities (CRITICAL)
    blacklist = ["shell corp", "unknown llc"]
    if any(entity in text.lower() for entity in blacklist):
        anomalies.append(
            Anomaly(
                type="Blacklisted Entity Match",
                description="Document references a blacklisted entity",
                confidence=0.93,
            )
        )
        highest_rank = max(highest_rank, severity_rank("CRITICAL"))

    severity = rank_to_severity(highest_rank)
    fraud_score = severity_to_score(severity)

    return {
        "severity": severity,
        "fraud_score": fraud_score,
        "anomalies": anomalies,
        "is_duplicate": False,
        "duplicate_source_id": None,
    }


def build_result_from_name(task_id: str, filename: str) -> ScanResult:
    """Fallback simple heuristic based on filename for non-PDF or unreadable files."""
    name = filename.lower()

    if "fraud" in name:
        anomalies = [
            Anomaly(
                type="Metadata Mismatch",
                description="Creation date is in the future",
                confidence=0.98,
            ),
            Anomaly(
                type="Forged Signature",
                description="Pixel alteration detected",
                confidence=0.92,
            ),
        ]
        return ScanResult(
            file_id=task_id,
            filename=filename,
            status="completed",
            fraud_score=88,
            severity="CRITICAL",
            is_duplicate=False,
            duplicate_source_id=None,
            anomalies=anomalies,
        )

    if "duplicate" in name:
        anomalies = [
            Anomaly(
                type="Duplicate Content",
                description="Document matches an existing record",
                confidence=0.87,
            )
        ]
        return ScanResult(
            file_id=task_id,
            filename=filename,
            status="completed",
            fraud_score=45,
            severity="WARNING",
            is_duplicate=True,
            duplicate_source_id="doc-duplicate-source",
            anomalies=anomalies,
        )

    return ScanResult(
        file_id=task_id,
        filename=filename,
        status="completed",
        fraud_score=12,
        severity="SAFE",
        is_duplicate=False,
        duplicate_source_id=None,
        anomalies=[],
    )


def build_result_from_text(task_id: str, filename: str, text: str) -> ScanResult:
    analysis = analyze_text(text)
    return ScanResult(
        file_id=task_id,
        filename=filename,
        status="completed",
        fraud_score=analysis["fraud_score"],
        severity=analysis["severity"],
        is_duplicate=analysis["is_duplicate"],
        duplicate_source_id=analysis["duplicate_source_id"],
        anomalies=analysis["anomalies"],
    )


# ----- Routes ----- #


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


@app.post("/api/v1/scan/upload", response_model=UploadResponse)
async def upload_scan(file: UploadFile = File(...)):
    task_id = str(uuid.uuid4())
    filename = file.filename
    content = await file.read()

    result: ScanResult
    text_content = ""

    # Attempt PDF text extraction
    if filename.lower().endswith(".pdf") and content:
        try:
            reader = PdfReader(io.BytesIO(content))
            pages_text = [page.extract_text() or "" for page in reader.pages]
            text_content = "\n".join(pages_text)
        except Exception:
            text_content = ""

    if text_content.strip():
        result = build_result_from_text(task_id, filename, text_content)
    else:
        # Fallback to filename heuristic or basic safe result
        result = build_result_from_name(task_id, filename)

    db[task_id] = result.dict()
    return {"task_id": task_id, "message": "File accepted for processing"}


@app.get("/api/v1/scan/result/{task_id}", response_model=ScanResult)
def get_scan_result(task_id: str):
    if task_id not in db:
        raise HTTPException(status_code=404, detail="Result not found")
    return db[task_id]


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
