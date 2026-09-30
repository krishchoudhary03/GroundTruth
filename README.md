# GroundTruth

**From field evidence to verified impact.**

GroundTruth is a field-media intelligence prototype for CSR, NGO, sustainability, impact, and audit teams. It organizes field media as evidence, links evidence to project claims, exposes observable facts and uncertainty, and calculates a deterministic trust score that is independent of generative AI output.

This repository currently contains a polished, responsive dashboard demo plus the foundations for a production verification pipeline. The demo is intentionally usable with zero API keys. External services are represented by small adapters, a health endpoint, a database migration, a Pathway-compatible normalizer, and an n8n workflow export.

## What the project does

The product is designed around this workflow:

1. A field team submits media associated with an impact project.
2. Media metadata and visual observations become structured evidence.
3. Evidence is compared with a project claim and checked for metadata gaps, anomalies, and possible reuse.
4. A deterministic application-side score summarizes the available signals.
5. Operators review evidence with its image, location, confidence, observations, flags, and status.
6. Only evidence-supported information should be used to create an impact story.

The product deliberately distinguishes:

- **Observation:** what is directly visible or present in metadata.
- **Inference:** what the system estimates from the evidence.
- **Human review:** what cannot be established automatically.

Missing GPS, weak metadata, or a similarity match should result in `NEEDS_REVIEW` or `POSSIBLE_REUSE`, never an automatic accusation of fraud.

## Current implementation status

### Implemented and runnable

- Next.js App Router dashboard in `app/page.tsx`.
- Responsive sidebar, top bar, search, navigation state, metrics, project pulse, evidence list, status distribution, and integration status sections.
- Evidence drawer with image, project, location, status, trust score, capture date, source, AI confidence, GPS state, description, detected objects, and automated flag.
- Six deterministic demo evidence records and three demo projects in `data/demo.ts`.
- Search across evidence caption, project name, and location.
- Deterministic trust-score engine and GPS distance helper in `lib/trust-score.ts`.
- Unit tests for clean evidence, duplicate similarity, metadata anomalies, and Haversine distance.
- Zod schema and provider interface for future Gemini-backed evidence analysis in `lib/gemini/provider.ts`.
- Cloudinary signing helper in `lib/cloudinary/server.ts`.
- Qdrant client adapter with live/fallback mode detection in `lib/qdrant/client.ts`.
- `GET /api/health` service configuration endpoint.
- Supabase schema with projects, media, verifications, stories, indexes, and row-level security policies.
- Minimal Pathway-compatible HTTP normalizer in `pathway-service/main.py`.
- n8n workflow export that emails an operator when a trust score is below 60.

### Planned or not yet connected to the dashboard

The following items are described in the implementation plan but are not complete production flows in the current repository:

- Signed upload UI and Cloudinary upload route.
- Supabase authentication and persistence routes.
- Production Gemini Vision, text, and embedding calls.
- Qdrant collection creation, indexing, and similarity search.
- Full Pathway event pipeline.
- Project, media, analysis, search, copilot, story, and n8n webhook API routes.
- Timeline and map views, public stories, PDF export, and production hardening.

Do not document these planned routes as currently available unless implementing them first.

## Technology stack

- **Frontend and server:** Next.js 14 App Router, React 18, TypeScript.
- **Styling:** Tailwind CSS v4 PostCSS integration plus handcrafted CSS in `app/globals.css`.
- **UI icons:** `lucide-react`.
- **Charts and visualization dependency:** `recharts`.
- **Validation:** Zod.
- **Media:** Cloudinary adapter and delivery URLs.
- **Multimodal AI boundary:** Gemini provider interface.
- **Semantic memory boundary:** Qdrant client adapter.
- **Persistence and auth boundary:** Supabase JS/SSR packages and PostgreSQL migration.
- **Streaming/event boundary:** Pathway-compatible Python service.
- **Operator automation:** n8n workflow export.
- **Testing:** Vitest.
- **Linting:** ESLint with Next.js configuration.

## Repository map

```text
app/
	globals.css                 Global layout, typography, colors, responsive UI styles
	layout.tsx                  Root metadata and HTML/body shell
	page.tsx                    Client-side demo dashboard and evidence drawer
	api/health/route.ts         Configuration-only health endpoint
automation/
	groundtruth-verification-workflow.json
															n8n webhook -> trust threshold -> email workflow
data/
	demo.ts                     Deterministic demo projects and evidence
docs/
	DEMO.md                     Three-minute judge/demo script
	IMPLEMENTATION_PLAN.md      Product phases, planned API surface, and test scope
lib/
	trust-score.ts              Trust calculation and geographic distance helper
	trust-score.test.ts         Vitest unit tests
	cloudinary/server.ts        Server-side Cloudinary configuration/signing helper
	gemini/provider.ts          Zod analysis schema and AIProvider/demo provider
	qdrant/client.ts            Qdrant client and live/fallback mode helper
pathway-service/
	main.py                     Minimal POST event normalizer on port 8090
	README.md                   Pathway service notes
	requirements.txt            Python service dependencies
supabase/
	migrations/001_initial_schema.sql
															PostgreSQL tables, indexes, RLS, and policies

	index.ts                    Evidence, project, and verification status types
```

## Local setup

### Prerequisites

- Node.js with npm.
- Python is optional and only needed for `pathway-service`.
- A Supabase, Cloudinary, Qdrant, Gemini, or n8n account is not required for the demo.

### Install and run the dashboard

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The page starts in Demo Mode when no service environment variables are configured.

### Available npm scripts

```bash
npm run dev       # Start the Next.js development server
npm run build     # Create a production Next.js build
npm run start     # Start the production build
npm run lint      # Run ESLint
npm run test      # Run Vitest once
```

### Optional environment configuration

Copy `.env.example` to `.env.local` only when enabling external services. Never commit `.env.local` or secret values.

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=

# Qdrant
QDRANT_URL=
QDRANT_API_KEY=
QDRANT_COLLECTION=groundtruth-evidence

# Gemini
GEMINI_API_KEY=
GEMINI_VISION_MODEL=gemini-2.0-flash
GEMINI_TEXT_MODEL=gemini-2.0-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004

# Automation and event processing
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
PATHWAY_SERVICE_URL=

# Verification tuning
GPS_ANOMALY_DISTANCE_KM=50
```

The current application does not automatically make all of these services live merely because variables exist. The adapters and health endpoint expose configuration readiness; production routes still need to be implemented and connected.

## Dashboard behavior

The dashboard is rendered by the client component in `app/page.tsx`.

- The left navigation changes the active label and breadcrumb. Most sections are presentational demo states rather than separate routes.
- The search field filters demo evidence by caption, project, and location.
- Selecting an evidence row opens the drawer without leaving the page.
- The drawer closes from the close button or by clicking the backdrop.
- Mobile navigation is toggled with the menu button.
- The `DEMO MODE` badge is intentionally visible when using seeded local data.
- The UI displays status counts for all verification statuses, including zero-count statuses.
- Demo image URLs are stable Unsplash URLs and are not Cloudinary uploads.

### Demo projects

| ID | Project | Location | Category | Coverage | Trust |
| --- | --- | --- | ---: | ---: | ---: |
| `water` | Clean Water Initiative | Mathura, Uttar Pradesh | WATER | 61% | 78 |
| `solar` | Rural Solar Access | Agra, Uttar Pradesh | SOLAR | 88% | 91 |
| `school` | School Nutrition Program | Vrindavan, Uttar Pradesh | SCHOOL | 74% | 84 |

### Demo evidence statuses

- `VERIFIED`: Evidence currently supports the relevant claim with no seeded concern.
- `PARTIALLY_VERIFIED`: Some infrastructure or activity is observable, but the complete claim needs more proof.
- `NEEDS_REVIEW`: A missing or inconsistent signal requires a person to review it.
- `UNSUPPORTED`: The evidence does not support the claim. No current seeded item uses this status.
- `POSSIBLE_REUSE`: Similarity suggests possible reused evidence. It is a review signal, not a fraud determination. No current seeded item uses this status.

## Trust-score engine

`calculateTrustScore` in `lib/trust-score.ts` accepts these inputs:

```ts
type TrustInputs = {
	gpsConsistent: boolean | null;
	timestampConsistent: boolean | null;
	aiConfidence: number;
	claimMatch: number;
	unique: boolean;
	moderation: boolean | null;
	duplicateSimilarity?: number;
	anomalySeverity?: number;
};
```

The positive score breakdown is:

| Signal | Rule | Maximum |
| --- | --- | ---: |
| AI confidence | `round(aiConfidence * 0.2)` | 20 |
| Claim match | `round(claimMatch * 0.2)` | 20 |
| GPS consistency | 15 when exactly `true` | 15 |
| Timestamp consistency | 15 when exactly `true` | 15 |
| Uniqueness | 20 when `unique` is true | 20 |
| Moderation | 10 when exactly `true` | 10 |
| **Total** |  | **100** |

Penalties are applied after the positive breakdown:

- Subtract 30 when `duplicateSimilarity > 0.92`.
- Subtract 15 when `gpsConsistent === false`.
- Subtract 10 when `timestampConsistent === false`.
- Subtract up to 15 for `anomalySeverity`.
- Clamp the result to the inclusive range 0-100.

`null` means that a signal is unavailable; it does not earn the positive points and does not receive the corresponding negative penalty. The score is calculated by application logic, not generated by Gemini.

`haversineDistanceKm` calculates the great-circle distance between two latitude/longitude points using an Earth radius of 6,371 km. The configured `GPS_ANOMALY_DISTANCE_KM` value is intended for future metadata checks.

## AI provider contract

`lib/gemini/provider.ts` defines the stable boundary for a future provider:

```ts
interface AIProvider {
	analyzeEvidence(imageUrl: string, claim: string): Promise<EvidenceAnalysis>;
	generateEmbedding(text: string): Promise<number[]>;
	answerQuestion(question: string, context: string): Promise<string>;
}
```

`EvidenceAnalysis` is Zod-validated and contains:

- `description: string`
- `detected_objects: string[]`
- `matches_claim: number` from 0 to 100
- `confidence: number` from 0 to 100
- `anomalies: string[]`
- `estimated_progress_stage: string`
- `extracted_text: string`, defaulting to an empty string

The current `demoAIProvider` returns deterministic fallback values and an eight-number toy embedding. It is a development placeholder, not a production Gemini implementation.

## API and service contracts

### Implemented endpoint

`GET /api/health` returns JSON shaped like:

```json
{
	"mode": "demo",
	"services": {
		"supabase": false,
		"cloudinary": false,
		"qdrant": false,
		"gemini": false,
		"pathway": false,
		"n8n": false
	},
	"checkedAt": "2026-09-30T00:00:00.000Z"
}
```

`mode` is `demo` when no listed service is configured and `mixed` when at least one service variable is present. The endpoint reports booleans only and does not expose secret values.

### Pathway-compatible normalizer

Run the optional service from its directory:

```bash
cd pathway-service
python main.py
```

It listens on `0.0.0.0:8090` and accepts a JSON `POST` body. It returns:

```json
{
	"event": "evidence.received",
	"media_id": null,
	"project_id": null,
	"normalized": true
}
```

The `event`, `media_id`, and `project_id` values are copied from the request when supplied. This is an isolated fallback normalizer, not a full Pathway deployment.

### Planned API surface

The implementation plan names these future routes, but they are not currently present under `app/api`:

```text
POST /api/projects
GET  /api/projects
POST /api/media
POST /api/media/upload/signature
POST /api/media/[id]/analyze
POST /api/search
POST /api/copilot
POST /api/stories/generate
POST /api/webhook/n8n
```

## Supabase data model

Run `supabase/migrations/001_initial_schema.sql` in a Supabase SQL editor when persistence is ready. The migration creates:

- `profiles`: display name keyed to `auth.users`.
- `projects`: owner, project name, category, location, coordinates, goal, description, and timestamps.
- `media`: project/user ownership, Cloudinary metadata, EXIF/GPS/capture data, detected objects, trust score, verification status, and optional Qdrant point ID.
- `verifications`: analysis result, claim match, confidence, anomalies, progress stage, duplicate fields, GPS/timestamp anomaly flags, reason, and status.
- `stories`: generated headline, summary, metrics, narrative, evidence references, trust score, author, publication flag, and timestamps.

Indexes exist for media project, user, capture time, status, and trust score. Row-level security is enabled for projects, media, verifications, and stories. Policies restrict users to their own projects/media and related verifications; stories can also be read when `is_public = true`.

The migration creates the tables and policies but does not create application routes, authentication UI, triggers, or automatic verification jobs.

## n8n automation

Import `automation/groundtruth-verification-workflow.json` into n8n. The workflow:

1. Receives a `POST` request at the `groundtruth-verification` webhook path.
2. Checks whether `$json.trust_score` is below 60.
3. Sends an email with the media ID when review is required.

The exported workflow requires n8n email credentials/configuration. It is intended as a non-blocking operator alert, not as the source of truth for verification.

## Demo script

For a short product demonstration:

1. Start the Next.js app and point out `DEMO MODE`.
2. Search for `water`.
3. Open `EVID-014` to show image evidence, detected objects, GPS, confidence, and a score of 92.
4. Open `EVID-011` to explain the seeded claim gap: 52 supported households versus 85 claimed.
5. Open `EVID-009` to show missing GPS as `NEEDS_REVIEW`, not fraud.
6. Explain the status mix, project pulse, and integration indicators.
7. Close with the product principle: GroundTruth shows the evidence behind an impact story.

The canonical script is also in [docs/DEMO.md](docs/DEMO.md).

## Testing and validation

Run the focused test suite:

```bash
npm run test
```

The tests currently verify:

- Clean evidence receives a high score.
- High duplicate similarity lowers the score.
- GPS and timestamp anomalies lower the score.
- The Haversine helper returns a meaningful distance.

Before submitting changes, also run:

```bash
npm run lint
npm run build
```

The project may use external resources only when explicitly configured. The normal zero-key test path should remain deterministic.

## Guidance for an AI working on this repository

Treat this README and the source files as the source of truth. Before changing behavior:

1. Read `AGENTS.md`; it contains repository-specific Next.js instructions.
2. Inspect the nearest owning file and existing types before adding abstractions.
3. Preserve the distinction between demo data, provider interfaces, and live integrations.
4. Keep trust scoring deterministic and test changes in `lib/trust-score.test.ts`.
5. Use Zod validation at AI/provider boundaries.
6. Never expose service secrets in client components or API responses.
7. Keep uncertainty visible. Do not convert missing metadata or similarity into a fraud verdict.
8. Update this README when setup, routes, schema, service contracts, or implementation status changes.
9. Run the narrowest relevant test first, then lint and build for cross-cutting changes.

When adding a production integration, implement the route and persistence behavior before claiming it is available in documentation. Prefer the existing adapter locations and types over introducing a second contract.

## Known limitations

- The main dashboard uses seeded in-memory data and does not persist user changes.
- Demo images come from Unsplash delivery URLs; production should use project-owned Cloudinary assets.
- Most navigation items are visual dashboard states, not separate pages.
- The live AI, database, vector search, signed upload, auth, map, report, and public-story flows are not connected end to end.
- Some package and framework versions should be validated with the local lockfile/package installation before deployment.
