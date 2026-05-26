from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env relative to the project root (parent of this file's package dir),
# regardless of the working directory uvicorn is launched from.
_PROJECT_ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Recall"
    app_env: Literal["development", "staging", "production"] = "development"
    log_level: str = "INFO"

    api_host: str = "0.0.0.0"
    api_port: int = 8000

    database_url: str  # required — set DATABASE_URL in .env
    redis_url: str = "redis://localhost:6379/0"
    uploads_dir: str = str(_PROJECT_ROOT / "uploads")

    llm_provider: Literal["anthropic", "openai"] = "anthropic"
    embedding_provider: Literal["openai", "anthropic"] = "openai"
    vector_store: Literal["pgvector", "pinecone"] = "pgvector"

    anthropic_api_key: str | None = None
    openai_api_key: str | None = None

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60


@lru_cache
def get_settings() -> Settings:
    return Settings()
