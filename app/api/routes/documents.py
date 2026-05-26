from uuid import UUID, uuid4

from fastapi import APIRouter, HTTPException, UploadFile, status

from app.schemas.documents import DocumentListItem, DocumentStatus, DocumentUploadResponse

router = APIRouter()


@router.post(
    "",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def upload_document(file: UploadFile) -> DocumentUploadResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="filename required")
    return DocumentUploadResponse(job_id=uuid4(), document_id=uuid4(), status="queued")


@router.get("", response_model=list[DocumentListItem])
async def list_documents() -> list[DocumentListItem]:
    return []


@router.get("/{document_id}", response_model=DocumentStatus)
async def get_document(document_id: UUID) -> DocumentStatus:
    raise HTTPException(status_code=404, detail="not implemented")


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: UUID) -> None:
    raise HTTPException(status_code=404, detail="not implemented")
