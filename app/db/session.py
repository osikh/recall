from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.db.engine import get_engine

_factory: async_sessionmaker[AsyncSession] | None = None


def _get_factory() -> async_sessionmaker[AsyncSession]:
    global _factory
    if _factory is None:
        _factory = async_sessionmaker(get_engine(), class_=AsyncSession, expire_on_commit=False)
    return _factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with _get_factory()() as session:
        yield session
