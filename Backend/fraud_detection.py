"""
fraud_detection.py - PII Detection and Metadata Forensics
"""
import re
import io
from typing import List, Optional
from pypdf import PdfReader

def detect_pii(text: str) -> List[str]:
    """Detects PAN and Aadhaar in text."""
    detected = []
    if not text: return detected
    if re.findall(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b', text.upper()):
        detected.append("PAN_DETECTED")
    aadhaar_pattern = r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b'
    if re.findall(aadhaar_pattern, text):
        detected.append("AADHAAR_DETECTED")
    return detected

def analyze_metadata(file_bytes: bytes, extracted_text: str) -> Optional[str]:
    """Compares hidden file year with visible text year."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        meta = reader.metadata
        if not meta: return None

        creation_date = str(meta.get('/CreationDate', ''))
        year_match = re.search(r'(\d{4})', creation_date)
        if year_match:
            pdf_year = int(year_match.group(1))
            text_years = [int(y) for y in re.findall(r'\b(20\d{2})\b', extracted_text)]
            if text_years and pdf_year > max(text_years):
                return "METADATA_MISMATCH: Hidden year is later than document year"
        
        # Check Creator/Producer for Canva markers in PDF
        creator = str(meta.get('/Creator', '')).lower()
        if 'canva' in creator: return "SUSPICIOUS_CREATOR_TOOL: Canva"
    except: pass
    return None

