from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Recall"
    app_env: Literal["development", "staging", "production"] = "development"
    log_level: str = "INFO"

    api_host: str = "0.0.0.0"
    api_port: int = 8000

    database_url: str = "postgresql+psycopg://recall:recall@localhost:5432/recall"
    redis_url: str = "redis://localhost:6379/0"

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
