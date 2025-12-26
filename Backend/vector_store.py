"""
vector_store.py - FAISS Text Search + Visual Hashing Storage
"""
import os
import faiss
import numpy as np
import json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
INDEX_FILE = "docs.index"
HASH_DB = "hashes.json"

if os.path.exists(INDEX_FILE):
    index = faiss.read_index(INDEX_FILE)
else:
    index = faiss.IndexFlatIP(model.get_sentence_embedding_dimension())

def load_hashes():
    if os.path.exists(HASH_DB):
        with open(HASH_DB, "r") as f: return json.load(f)
    return []

def search_duplicate(text: str, img_hash: str = None):
    """Checks for visual duplicates OR text similarity."""
    if img_hash and img_hash in load_hashes(): return True, 1.0
    if index.ntotal == 0 or not text.strip(): return False, 0.0
    emb = model.encode([text], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(emb)
    scores, _ = index.search(emb, k=1)
    return float(scores[0][0]) >= 0.9, float(scores[0][0])

def add_to_index(text: str, img_hash: str = None):
    if text.strip():
        emb = model.encode([text], convert_to_numpy=True).astype("float32")
        faiss.normalize_L2(emb)
        index.add(emb)
        faiss.write_index(index, INDEX_FILE)
    if img_hash:
        hashes = load_hashes()
        if img_hash not in hashes:
            hashes.append(img_hash)
            with open(HASH_DB, "w") as f: json.dump(hashes, f)
