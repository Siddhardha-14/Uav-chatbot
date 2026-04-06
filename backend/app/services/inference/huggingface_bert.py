from __future__ import annotations

import logging

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from app.services.inference.base import InferenceService, PredictionResult, TopPrediction
from app.services.label_catalog import LABEL_IDS

logger = logging.getLogger(__name__)


class HuggingFaceBertInferenceService(InferenceService):
    """Loads a HF sequence-classification checkpoint; maps logits to catalog labels."""

    def __init__(self, model_id: str, local_files_only: bool = False) -> None:
        self._model_id = model_id
        self._local_files_only = local_files_only
        self._tokenizer = AutoTokenizer.from_pretrained(
            model_id,
            local_files_only=local_files_only,
        )
        self._model = AutoModelForSequenceClassification.from_pretrained(
            model_id,
            local_files_only=local_files_only,
        )
        self._model.eval()
        self._id2label = dict(self._model.config.id2label)
        self._num_labels = len(self._id2label)
        logger.info(
            "Loaded HF model %s with %s labels",
            model_id,
            self._num_labels,
        )

    @property
    def backend_name(self) -> str:
        return "hf"

    @property
    def model_version(self) -> str:
        return f"hf:{self._model_id}"

    def predict(self, text: str) -> PredictionResult:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._model.to(device)
        enc = self._tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True,
        )
        enc = {k: v.to(device) for k, v in enc.items()}
        with torch.no_grad():
            logits = self._model(**enc).logits[0]
        probs = torch.softmax(logits, dim=-1).tolist()

        label_scores: list[tuple[str, float]] = []
        for i, p in enumerate(probs):
            mapped = self._id2label.get(i, str(i))
            if mapped in LABEL_IDS:
                label_scores.append((mapped, float(p)))
            else:
                normalized = _normalize_hf_label(mapped)
                if normalized in LABEL_IDS:
                    label_scores.append((normalized, float(p)))
                else:
                    label_scores.append((mapped, float(p)))

        label_scores.sort(key=lambda x: x[1], reverse=True)
        catalog_scores = _merge_to_catalog(label_scores)

        top3_list = catalog_scores[:3]
        while len(top3_list) < 3:
            for lid in LABEL_IDS:
                if all(lab != lid for lab, _ in top3_list):
                    top3_list.append((lid, 0.0))
                if len(top3_list) >= 3:
                    break

        top3 = tuple(
            TopPrediction(label=lab, score=sc) for lab, sc in top3_list[:3]
        )
        best_label, best_conf = top3[0].label, top3[0].score

        return PredictionResult(
            predicted_label=best_label,
            confidence=best_conf,
            top_predictions=top3,
            model_version=self.model_version,
        )


def _normalize_hf_label(name: str) -> str:
    n = name.strip().lower().replace(" ", "_").replace("/", "_")
    aliases = {
        "defence": "defence_military",
        "defense": "defence_military",
        "military": "defence_military",
        "defence_military": "defence_military",
        "agriculture": "agriculture",
        "surveillance": "surveillance",
        "rescue": "rescue",
    }
    return aliases.get(n, n)


def _merge_to_catalog(label_scores: list[tuple[str, float]]) -> list[tuple[str, float]]:
    """Aggregate scores into catalog LABEL_IDS when model emits aliases or subsets."""
    acc: dict[str, float] = {lid: 0.0 for lid in LABEL_IDS}
    for lab, sc in label_scores:
        if lab in acc:
            acc[lab] = max(acc[lab], sc)
        else:
            norm = _normalize_hf_label(lab)
            if norm in acc:
                acc[norm] = max(acc[norm], sc)
    ranked = sorted(acc.items(), key=lambda x: x[1], reverse=True)
    if all(v == 0.0 for _, v in ranked):
        uniform = 1.0 / len(LABEL_IDS)
        return [(lid, uniform) for lid in LABEL_IDS]
    return ranked
