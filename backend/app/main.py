from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import health, labels, predict, samples
from app.core.config import get_settings
from app.core.logging import setup_logging
from app.services.inference.factory import build_inference_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    settings = get_settings()
    app.state.inference = build_inference_service(settings)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.api_version,
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    app.include_router(labels.router)
    app.include_router(samples.router)
    app.include_router(predict.router)

    @app.exception_handler(ValueError)
    async def value_error_handler(request, exc: ValueError):
        return JSONResponse(
            status_code=400,
            content={"error": {"code": "bad_request", "message": str(exc)}},
        )

    return app


app = create_app()
