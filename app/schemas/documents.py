from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class DocumentUploadResponse(BaseModel):
    job_id: UUID
    document_id: UUID
    status: Literal["queued", "processing", "ready", "failed"] = "queued"


class DocumentStatus(BaseModel):
    document_id: UUID
    status: Literal["queued", "processing", "ready", "failed"]
    filename: str
    chunk_count: int = 0
    error: str | None = None
    created_at: datetime
    updated_at: datetime


class DocumentListItem(BaseModel):
    document_id: UUID
    filename: str
    status: str
    chunk_count: int = Field(default=0, ge=0)
    created_at: datetime
