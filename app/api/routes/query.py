from fastapi import APIRouter, HTTPException

from app.schemas.query import QueryRequest, QueryResponse

router = APIRouter()


@router.post("", response_model=QueryResponse)
async def query(request: QueryRequest) -> QueryResponse:
    raise HTTPException(status_code=501, detail="RAG pipeline not yet implemented")
