import hashlib
import math
import re

from app.services.inference.base import InferenceService, PredictionResult, TopPrediction
from app.services.label_catalog import LABEL_IDS

_KEYWORD_WEIGHTS: dict[str, dict[str, float]] = {
    "agriculture": {
        "crop": 2.5,
        "field": 1.5,
        "farm": 2.0,
        "agriculture": 3.0,
        "spray": 2.0,
        "pesticide": 2.5,
        "ndvi": 2.5,
        "mapping": 1.2,
        "soil": 1.5,
        "harvest": 1.5,
        "irrigation": 1.8,
        "plant": 1.2,
    },
    "defence_military": {
        "border": 2.2,
        "military": 3.0,
        "defence": 3.0,
        "defense": 3.0,
        "reconnaissance": 2.5,
        "recon": 2.0,
        "sector": 1.0,
        "patrol": 2.0,
        "tactical": 2.0,
        "target": 1.5,
        "enemy": 2.5,
        "convoy": 1.5,
    },
    "surveillance": {
        "surveillance": 3.0,
        "monitor": 2.0,
        "perimeter": 2.0,
        "area": 0.8,
        "track": 1.8,
        "watch": 1.5,
        "loiter": 2.0,
        "security": 1.8,
        "facility": 1.2,
    },
    "rescue": {
        "rescue": 3.0,
        "survivor": 2.5,
        "search": 2.0,
        "flood": 2.0,
        "disaster": 2.2,
        "missing": 1.8,
        "emergency": 1.5,
        "river": 1.2,
        "assessment": 1.0,
    },
}


def _softmax(scores: list[float]) -> list[float]:
    m = max(scores)
    exps = [math.exp(s - m) for s in scores]
    t = sum(exps)
    return [e / t for e in exps] if t else [1.0 / len(scores)] * len(scores)


def _score_text(text: str) -> list[float]:
    lowered = text.lower()
    tokens = set(re.findall(r"[a-z0-9]+", lowered))
    scores = []
    for lid in LABEL_IDS:
        wmap = _KEYWORD_WEIGHTS.get(lid, {})
        s = 0.3
        for tok in tokens:
            s += wmap.get(tok, 0.0)
        scores.append(s)
    digest = hashlib.sha256(lowered.encode("utf-8")).digest()
    for i in range(len(scores)):
        scores[i] += (digest[i % len(digest)] / 255.0) * 0.15
    return scores


class MockInferenceService(InferenceService):
    """Deterministic, keyword-biased mock for demos when no HF model is configured."""

    MODEL_VERSION = "mock-v1"

    @property
    def model_version(self) -> str:
        return self.MODEL_VERSION

    @property
    def backend_name(self) -> str:
        return "mock"

    def predict(self, text: str) -> PredictionResult:
        raw = _score_text(text)
        probs = _softmax(raw)
        ranked = sorted(zip(LABEL_IDS, probs), key=lambda x: x[1], reverse=True)
        top3 = tuple(
            TopPrediction(label=lab, score=float(p)) for lab, p in ranked[:3]
        )
        best_label, best_conf = ranked[0]
        return PredictionResult(
            predicted_label=best_label,
            confidence=float(best_conf),
            top_predictions=top3,
            model_version=self.MODEL_VERSION,
        )
