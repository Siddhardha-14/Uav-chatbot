from fastapi import APIRouter, Request

from app.core.config import get_settings
from app.schemas.prediction import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    settings = get_settings()
    inference = getattr(request.app.state, "inference", None)
    backend = inference.backend_name if inference else "unknown"
    model_version = inference.model_version if inference else "n/a"
    return HealthResponse(
        status="ok",
        version=settings.api_version,
        model_backend=backend,
        model_version=str(model_version),
    )
