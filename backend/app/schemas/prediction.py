from pydantic import BaseModel, Field, field_validator

from app.constants import ABSOLUTE_MAX_INPUT_CHARS


class TopPredictionItem(BaseModel):
    label: str
    score: float = Field(ge=0.0, le=1.0)


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=ABSOLUTE_MAX_INPUT_CHARS)

    @field_validator("text")
    @classmethod
    def strip_text(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("text must not be empty or whitespace-only")
        return s


class PredictResponse(BaseModel):
    input_text: str
    predicted_label: str
    predicted_domain: str
    confidence: float
    top_predictions: tuple[TopPredictionItem, TopPredictionItem, TopPredictionItem]
    recommended_action: str
    model_version: str


class HealthResponse(BaseModel):
    status: str
    version: str
    model_backend: str
    model_version: str


class LabelsResponse(BaseModel):
    labels: list[str]
    domains: list[str]
    label_to_domain: dict[str, str]
