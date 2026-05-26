from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes import api_router
from app.config import get_settings
from app.core.logging import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    configure_logging(settings.log_level)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="A self-hostable cited Q&A API over your own documents.",
        lifespan=lifespan,
    )
    app.include_router(api_router, prefix="/api/v1")
    return app


app = create_app()
