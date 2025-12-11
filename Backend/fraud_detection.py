"""
Fraud Detection Module - PII Detection and Metadata Forensics
"""

import re
from datetime import datetime
from typing import List, Optional
import io

try:
    import spacy
    SPACY_AVAILABLE = True
    # Load spacy model (en_core_web_sm)
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        # Model not found - user needs to run: python -m spacy download en_core_web_sm
        nlp = None
        print("Warning: en_core_web_sm model not found. Run: python -m spacy download en_core_web_sm")
except ImportError:
    SPACY_AVAILABLE = False
    nlp = None

try:
    from pypdf import PdfReader
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False


def detect_pii(text: str) -> List[str]:
    """
    Detect PII (Personally Identifiable Information) in text.
    
    Detects:
    - PAN cards: Format [A-Z]{5}[0-9]{4}[A-Z]{1}
    - Aadhaar numbers: 12 digits (formatted as XXXX XXXX XXXX or XXXXXXXXXXXX)
    
    Args:
        text: Input text to scan
        
    Returns:
        List of detected PII types (e.g., ["PAN_DETECTED", "AADHAAR_DETECTED"])
    """
    detected = []
    
    if not text:
        return detected
    
    # PAN Card Detection: 5 letters, 4 digits, 1 letter
    pan_pattern = r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'
    pan_matches = re.findall(pan_pattern, text.upper())
    if pan_matches:
        detected.append("PAN_DETECTED")
    
    # Aadhaar Detection: 12 digits (with or without spaces/dashes)
    # Pattern: 4 digits, optional space/dash, 4 digits, optional space/dash, 4 digits
    aadhaar_pattern = r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b'
    aadhaar_matches = re.findall(aadhaar_pattern, text)
    if aadhaar_matches:
        # Verify it's actually 12 digits (remove spaces/dashes and check)
        for match in aadhaar_matches:
            digits_only = re.sub(r'[\s-]', '', match)
            if len(digits_only) == 12:
                detected.append("AADHAAR_DETECTED")
                break
    
    return detected


def analyze_metadata(file_bytes: bytes, extracted_text: str) -> Optional[str]:
    """
    Analyze PDF metadata for inconsistencies.
    
    Extracts PDF CreationDate and compares it with dates found in the text.
    If PDF was created after the latest date mentioned in the text, flag as mismatch.
    
    Args:
        file_bytes: PDF file content as bytes
        extracted_text: Text extracted from the PDF
        
    Returns:
        "METADATA_MISMATCH" if inconsistency found, None otherwise
    """
    if not PYPDF_AVAILABLE:
        return None
    
    if not file_bytes or not extracted_text:
        return None
    
    try:
        # Extract PDF creation date
        reader = PdfReader(io.BytesIO(file_bytes))
        pdf_metadata = reader.metadata
        
        if not pdf_metadata or 'CreationDate' not in pdf_metadata:
            return None
        
        creation_date_str = pdf_metadata['CreationDate']
        
        # Parse PDF date format (usually like "D:20250101120000Z" or similar)
        # Extract year from the date string
        year_match = re.search(r'(\d{4})', creation_date_str)
        if not year_match:
            return None
        
        pdf_creation_year = int(year_match.group(1))
        
        # Find all dates in extracted text
        # Support multiple formats: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY, etc.
        date_patterns = [
            r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b',  # DD/MM/YYYY or DD-MM-YYYY
            r'\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b',  # YYYY-MM-DD or YYYY/MM/DD
            r'\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b',  # DD Month YYYY
            r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\b',  # Month DD, YYYY
        ]
        
        latest_year = None
        
        for pattern in date_patterns:
            matches = re.finditer(pattern, extracted_text, re.IGNORECASE)
            for match in matches:
                groups = match.groups()
                try:
                    # Try to extract year from different patterns
                    if len(groups) == 3:
                        # Check which group is the year (4 digits)
                        for group in groups:
                            if group and len(group) == 4 and group.isdigit():
                                year = int(group)
                                if latest_year is None or year > latest_year:
                                    latest_year = year
                except (ValueError, AttributeError):
                    continue
        
        # If we found dates in text and PDF creation year is later, flag mismatch
        if latest_year and pdf_creation_year > latest_year:
            return "METADATA_MISMATCH"
        
    except Exception as e:
        # Silently fail metadata analysis if there's an error
        print(f"Metadata analysis error: {e}")
        return None
    
    return None

