from fastapi import APIRouter

from app.config import get_settings

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    settings = get_settings()
    return {"status": "ok", "app": settings.app_name, "env": settings.app_env}


@router.get("/health/db")
async def health_db() -> dict[str, str]:
    import psycopg

    settings = get_settings()
    # psycopg expects postgresql://, not the SQLAlchemy postgresql+psycopg:// prefix
    raw_url = settings.database_url.replace("postgresql+psycopg://", "postgresql://", 1)
    try:
        async with await psycopg.AsyncConnection.connect(raw_url, connect_timeout=3) as conn:
            await conn.execute("SELECT 1")
        return {"status": "ok"}
    except Exception as exc:
        return {"status": "error", "detail": str(exc)}
