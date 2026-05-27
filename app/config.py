from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_PROJECT_ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str
    app_env: Literal["development", "staging", "production"]
    log_level: str

    api_host: str
    api_port: int

    database_url: str
    redis_url: str
    uploads_dir: str

    @field_validator("uploads_dir")
    @classmethod
    def resolve_uploads_dir(cls, v: str) -> str:
        p = Path(v)
        return str(p if p.is_absolute() else _PROJECT_ROOT / p)

    ai_provider: Literal["lmstudio", "openrouter"]
    vector_store: Literal["pgvector", "pinecone"]

    lmstudio_base_url: str
    lmstudio_api_key: str
    lmstudio_llm_model: str
    lmstudio_embedding_model: str

    openrouter_base_url: str
    openrouter_api_key: str
    openrouter_llm_model: str
    openrouter_embedding_model: str

    jwt_secret: str
    jwt_algorithm: str
    jwt_expires_minutes: int


@lru_cache
def get_settings() -> Settings:
    return Settings()
