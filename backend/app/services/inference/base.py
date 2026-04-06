from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class TopPrediction:
    label: str
    score: float


@dataclass(frozen=True)
class PredictionResult:
    predicted_label: str
    confidence: float
    top_predictions: tuple[TopPrediction, TopPrediction, TopPrediction]
    model_version: str


class InferenceService(ABC):
    @abstractmethod
    def predict(self, text: str) -> PredictionResult:
        raise NotImplementedError

    @property
    @abstractmethod
    def backend_name(self) -> str:
        raise NotImplementedError

    @property
    @abstractmethod
    def model_version(self) -> str:
        raise NotImplementedError
