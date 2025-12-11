import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from typing import Tuple

# Initialize model and FAISS index (inner product on normalized vectors)
model = SentenceTransformer('all-MiniLM-L6-v2')
embedding_dim = model.get_sentence_embedding_dimension()
index = faiss.IndexFlatIP(embedding_dim)


def get_embedding(text: str) -> np.ndarray:
    """Convert text to a normalized float32 vector."""
    emb = model.encode([text], convert_to_numpy=True)[0].astype('float32')
    # Normalize for cosine similarity via inner product
    norm = np.linalg.norm(emb)
    if norm > 0:
        emb = emb / norm
    return emb


def search_duplicate(text: str, threshold: float = 0.9) -> Tuple[bool, float]:
    """Search FAISS for a similar vector. Returns (is_duplicate, score)."""
    if index.ntotal == 0:
        return False, 0.0

    emb = get_embedding(text).reshape(1, -1)
    scores, _ = index.search(emb, k=1)
    score = float(scores[0][0]) if scores.size > 0 else 0.0

    # Inner product on normalized vectors is cosine similarity
    if score >= threshold:
        return True, score
    return False, score


def add_to_index(text: str) -> None:
    """Add text embedding to the FAISS index."""
    emb = get_embedding(text).reshape(1, -1)
    index.add(emb)

