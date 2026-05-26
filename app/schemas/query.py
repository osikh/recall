from uuid import UUID

from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    top_k: int = Field(default=5, ge=1, le=20)
    document_ids: list[UUID] | None = None


class Citation(BaseModel):
    document_id: UUID
    chunk_id: UUID
    score: float
    snippet: str
    page: int | None = None


class QueryResponse(BaseModel):
    answer: str
    citations: list[Citation]
    latency_ms: int
