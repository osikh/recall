# Recall

A self-hostable cited Q&A API over your own documents. Upload PDFs, markdown, or plain text — ask questions and get answers with inline citations back to the source chunks. Think Perplexity, but scoped to a private knowledge base, behind an API.

## Stack

| Layer | Tech |
|---|---|
| API | FastAPI + Pydantic v2 |
| Database | PostgreSQL 15 + pgvector |
| ORM / migrations | SQLAlchemy 2 async + Alembic |
| Ingestion queue | Celery + Redis *(milestone 2)* |
| RAG orchestration | LlamaIndex *(milestone 1)* |
| Auth | JWT + API keys *(milestone 2)* |
| UI | React 18 + Vite + Tailwind CSS |

## Project layout

```
app/
  api/routes/     HTTP endpoints
  services/       Business logic
  models/         SQLAlchemy ORM models
  db/             Engine + session factory
  core/           Logging, shared utilities
  config.py       Pydantic-settings (reads .env)
alembic/          Database migrations
ui/               React + Vite frontend
tests/
```

## Quick start

### Prerequisites

- Python 3.11+
- Node 18+ (for the UI)
- PostgreSQL 15+ with the `pgvector` extension enabled
- Redis *(milestone 2 — not required for MVP)*

### Backend

```bash
python -m venv .venv
# Windows:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# edit .env — set DATABASE_URL and at least one LLM API key

alembic upgrade head          # run DB migrations
uvicorn app.main:app --reload # start dev server
```

Swagger UI → http://localhost:8000/docs

### UI

```bash
cd ui
npm install
npm run dev
```

App → http://localhost:5173

## API reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | App health check |
| `GET` | `/api/v1/health/db` | Postgres connectivity |
| `POST` | `/api/v1/documents` | Upload a document (202 + `job_id`) |
| `GET` | `/api/v1/documents` | List all documents |
| `GET` | `/api/v1/documents/{id}` | Document status + metadata |
| `DELETE` | `/api/v1/documents/{id}` | Delete a document |
| `POST` | `/api/v1/query` | Ask a question, get a cited answer |

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | **yes** | — | `postgresql+psycopg://user:pass@host/db` |
| `REDIS_URL` | no | `redis://localhost:6379/0` | For async ingestion queue |
| `LLM_PROVIDER` | no | `anthropic` | `anthropic` or `openai` |
| `ANTHROPIC_API_KEY` | if `llm_provider=anthropic` | — | |
| `OPENAI_API_KEY` | if embedding or `llm_provider=openai` | — | |
| `JWT_SECRET` | no | `change-me` | **Change in production** |
| `UPLOADS_DIR` | no | `<project-root>/uploads` | Where uploaded files are stored |

## Milestones

- [x] FastAPI skeleton — routes, schemas, config
- [x] Document upload/list with PostgreSQL persistence
- [ ] pgvector + sync embedding pipeline → `POST /query` returns cited answer
- [ ] JWT auth + per-user document isolation (enforced at query level)
- [ ] Async ingestion queue (Celery + Redis)
- [ ] Provider abstraction: Anthropic ↔ OpenAI, pgvector ↔ Pinecone
- [ ] Observability: per-stage latency, token counts, cost, `/metrics` (Prometheus)
- [ ] Hybrid search (BM25 + semantic) + reranking
