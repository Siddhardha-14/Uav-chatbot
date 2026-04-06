from fastapi import Request

from app.services.inference.base import InferenceService


def get_inference(request: Request) -> InferenceService:
    svc: InferenceService | None = getattr(request.app.state, "inference", None)
    if svc is None:
        raise RuntimeError("Inference service not initialized")
    return svc
