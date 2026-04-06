from fastapi import APIRouter

from app.schemas.prediction import LabelsResponse
from app.services.label_catalog import DOMAIN_BY_LABEL, LABEL_IDS, UNIQUE_DOMAINS

router = APIRouter(tags=["labels"])


@router.get("/labels", response_model=LabelsResponse)
async def labels() -> LabelsResponse:
    return LabelsResponse(
        labels=list(LABEL_IDS),
        domains=list(UNIQUE_DOMAINS),
        label_to_domain=dict(DOMAIN_BY_LABEL),
    )
