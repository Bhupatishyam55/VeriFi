"""
image_forensics.py - Deep + Classical Image Tampering Detection
Requirement: The Fraud Detective & The Duplicate Hunter
"""
import io
import numpy as np
from PIL import Image, ImageChops
from typing import Optional
import cv2
import imagehash
import piexif

try:
    from pdf2image import convert_from_bytes
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False

def get_image_phash(file_bytes: bytes) -> str:
    """Requirement: The Duplicate Hunter. Generates visual fingerprint."""
    try:
        img = Image.open(io.BytesIO(file_bytes))
        return str(imagehash.phash(img))
    except Exception: return ""

def detect_tampering(file_bytes: bytes, filename: str) -> Optional[str]:
    """
    Generalized forensic scanner. 
    Checks EXIF, Deep Info Dict, and Binary Traces for editing footprints.
    """
    name = filename.lower()
    if name.endswith(".pdf") and PDF2IMAGE_AVAILABLE:
        try:
            pages = convert_from_bytes(file_bytes, dpi=150, first_page=1, last_page=1)
            buf = io.BytesIO(); pages[0].save(buf, format="JPEG")
            file_bytes = buf.getvalue()
        except Exception: return None

    try:
        img = Image.open(io.BytesIO(file_bytes))
        
        # 1. Deep Metadata Scan: Checks hidden blocks for any editing tool signature
        # Generalized suspicious tool list 
        suspicious_list = ["canva", "photoshop", "gimp", "adobe", "illustrator", "framer"]
        for key, value in img.info.items():
            if isinstance(value, (str, bytes)):
                val_str = str(value).lower()
                if any(tool in val_str for tool in suspicious_list):
                    return f"Tampering Signature: Created/Edited with {val_str.strip()}"

        # 2. Raw Binary Signature Scan: Detects markers in the raw byte stream 
        raw_data = file_bytes.lower()
        for tool in suspicious_list:
            if tool.encode() in raw_data:
                return f"Tampering Signature: '{tool}' marker found in raw file data"

        # 3. Standard EXIF Scan
        if "exif" in img.info:
            exif = piexif.load(img.info["exif"])
            software = exif.get("0th", {}).get(piexif.ImageIFD.Software, b"").decode().lower()
            if any(tool in software for tool in suspicious_list):
                return f"Metadata Fraud: Software signature '{software.strip()}' detected"
    except Exception: pass

    # 4. Error Level Analysis (ELA) for pixel manipulation 
    return detect_ela(file_bytes)

def detect_ela(file_bytes: bytes, threshold: float = 30.0) -> Optional[str]:
    """Detects inconsistencies caused by overlays and digital pastes."""
    try:
        original = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        buf = io.BytesIO(); original.save(buf, "JPEG", quality=90)
        resaved = Image.open(io.BytesIO(buf.getvalue()))
        ela_img = ImageChops.difference(original, resaved)
        if max([e[1] for e in ela_img.getextrema()]) > threshold:
            return "Visual Tampering: Pixel-level inconsistencies detected (ELA)"
    except: pass
    return None
