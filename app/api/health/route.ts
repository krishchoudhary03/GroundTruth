import { NextResponse } from "next/server";

export async function GET() {
  const services = {
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_SECRET),
    qdrant: Boolean(process.env.QDRANT_URL && process.env.QDRANT_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    pathway: Boolean(process.env.PATHWAY_SERVICE_URL),
    n8n: Boolean(process.env.N8N_WEBHOOK_URL),
  };
  return NextResponse.json({ mode: Object.values(services).some(Boolean) ? "mixed" : "demo", services, checkedAt: new Date().toISOString() });
}
