import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.documents import DocumentListItem, DocumentStatus, DocumentUploadResponse
from app.services import document as doc_service

router = APIRouter()


@router.post("", response_model=DocumentUploadResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
) -> DocumentUploadResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="filename required")
    doc = await doc_service.upload_document(db, file)
    return DocumentUploadResponse(job_id=doc.id, document_id=doc.id, status=doc.status)


@router.get("", response_model=list[DocumentListItem])
async def list_documents(db: AsyncSession = Depends(get_db)) -> list[DocumentListItem]:
    docs = await doc_service.list_documents(db)
    return [
        DocumentListItem(
            document_id=d.id,
            filename=d.filename,
            status=d.status,
            chunk_count=d.chunk_count,
            created_at=d.created_at,
        )
        for d in docs
    ]


@router.get("/{document_id}", response_model=DocumentStatus)
async def get_document(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> DocumentStatus:
    doc = await doc_service.get_document(db, document_id)
    if doc is None:
        raise HTTPException(status_code=404, detail="document not found")
    return DocumentStatus(
        document_id=doc.id,
        status=doc.status,
        filename=doc.filename,
        chunk_count=doc.chunk_count,
        error=doc.error,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    deleted = await doc_service.delete_document(db, document_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="document not found")
