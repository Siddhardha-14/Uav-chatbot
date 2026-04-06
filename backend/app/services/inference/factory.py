import logging

from app.core.config import Settings
from app.services.inference.base import InferenceService
from app.services.inference.mock import MockInferenceService

logger = logging.getLogger(__name__)


def build_inference_service(settings: Settings) -> InferenceService:
    if settings.model_backend == "hf" and settings.hf_model_id:
        # Lazy import: torch/transformers are heavy; mock backend should not load them.
        from app.services.inference.huggingface_bert import HuggingFaceBertInferenceService

        try:
            return HuggingFaceBertInferenceService(
                settings.hf_model_id,
                local_files_only=settings.hf_local_files_only,
            )
        except Exception:
            logger.exception(
                "HF model load failed; falling back to mock (model_id=%s)",
                settings.hf_model_id,
            )
            return MockInferenceService()
    if settings.model_backend == "hf" and not settings.hf_model_id:
        logger.warning("MODEL_BACKEND=hf but HF_MODEL_ID unset; using mock inference.")
    return MockInferenceService()
