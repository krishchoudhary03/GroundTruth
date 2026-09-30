# GroundTruth implementation plan

GroundTruth connects field media to claims, verification signals, deterministic trust scores, and evidence-backed stories. Every automation distinguishes observation, inference, and human review.

## Phases
1. Demo foundation: seeded evidence, trust scoring, responsive dashboard, evidence drawer.
2. Evidence workflow: signed Cloudinary uploads, Gemini JSON analysis, duplicate search, metadata checks, API routes.
3. Persistence: Supabase auth/RLS, Qdrant retrieval, Pathway events, n8n alerts, timeline/map/report routes.
4. Polish: public stories, accessibility, tests, Vercel hardening, Qdrant Edge reference architecture.

## Modules
`app/` routes; `data/` deterministic records; `lib/trust-score.ts` verification math; `lib/{cloudinary,gemini,qdrant,supabase}/` server adapters; `supabase/` migrations; `pathway-service/` worker; `automation/` n8n export.

## API surface
`POST /api/projects`, `GET /api/projects`, `POST /api/media`, `POST /api/media/upload/signature`, `POST /api/media/[id]/analyze`, `POST /api/search`, `POST /api/copilot`, `POST /api/stories/generate`, `POST /api/webhook/n8n`, and `GET /api/health`.

## Testing
Unit tests cover GPS distance, trust-score weights and penalties, duplicate threshold, schema validation, and demo fallback. Integration tests run only when external test resources are configured.
