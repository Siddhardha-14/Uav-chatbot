from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_inference
from app.core.config import get_settings
from app.schemas.prediction import PredictRequest, PredictResponse, TopPredictionItem
from app.services.inference.base import InferenceService
from app.services.label_catalog import label_to_domain
from app.services.recommendations import recommendation_for_label

router = APIRouter(tags=["predict"])


@router.post("/predict", response_model=PredictResponse)
async def predict(
    body: PredictRequest,
    inference: InferenceService = Depends(get_inference),
) -> PredictResponse:
    settings = get_settings()
    if len(body.text) > settings.max_input_chars:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "input_too_long",
                    "message": f"text exceeds {settings.max_input_chars} characters",
                },
            },
        )

    result = inference.predict(body.text)
    try:
        domain = label_to_domain(result.predicted_label)
    except KeyError:
        domain = result.predicted_label.replace("_", " ").title()

    top = tuple(TopPredictionItem(label=t.label, score=t.score) for t in result.top_predictions)
    action = recommendation_for_label(result.predicted_label)

    return PredictResponse(
        input_text=body.text,
        predicted_label=result.predicted_label,
        predicted_domain=domain,
        confidence=result.confidence,
        top_predictions=top,
        recommended_action=action,
        model_version=result.model_version,
    )
