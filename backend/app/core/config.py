from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "UAV Mission Intent Analyzer API"
    api_version: str = "1.0.0"
    model_backend: Literal["mock", "hf"] = Field(default="mock", validation_alias="MODEL_BACKEND")
    hf_model_id: str | None = Field(default=None, validation_alias="HF_MODEL_ID")
    hf_local_files_only: bool = Field(default=False, validation_alias="HF_LOCAL_FILES_ONLY")
    cors_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        validation_alias="CORS_ORIGINS",
    )
    max_input_chars: int = Field(default=2000, validation_alias="MAX_INPUT_CHARS")
    request_timeout_seconds: float = Field(default=60.0, validation_alias="REQUEST_TIMEOUT_SECONDS")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
