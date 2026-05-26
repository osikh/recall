import uuid
from pathlib import Path

import aiofiles
from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.document import Document


async def upload_document(db: AsyncSession, file: UploadFile) -> Document:
    settings = get_settings()
    doc_id = uuid.uuid4()
    upload_dir = Path(settings.uploads_dir) / str(doc_id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    filename = file.filename or "upload"
    stored_path = upload_dir / filename

    content = await file.read()
    async with aiofiles.open(stored_path, "wb") as f:
        await f.write(content)

    doc = Document(
        id=doc_id,
        filename=filename,
        stored_path=str(stored_path),
        content_type=file.content_type,
        file_size=len(content),
        status="queued",
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


async def list_documents(db: AsyncSession) -> list[Document]:
    result = await db.execute(select(Document).order_by(Document.created_at.desc()))
    return list(result.scalars().all())


async def get_document(db: AsyncSession, document_id: uuid.UUID) -> Document | None:
    return await db.get(Document, document_id)


async def delete_document(db: AsyncSession, document_id: uuid.UUID) -> bool:
    doc = await db.get(Document, document_id)
    if doc is None:
        return False
    await db.delete(doc)
    await db.commit()
    return True
