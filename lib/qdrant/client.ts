import { QdrantClient } from "@qdrant/js-client-rest";

export function getQdrantClient() { if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) return null; return new QdrantClient({ url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY }); }
export function qdrantMode(): "live" | "fallback" { return getQdrantClient() ? "live" : "fallback"; }
