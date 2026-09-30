import { z } from "zod";

export const evidenceAnalysisSchema = z.object({ description: z.string(), detected_objects: z.array(z.string()), matches_claim: z.number().min(0).max(100), confidence: z.number().min(0).max(100), anomalies: z.array(z.string()), estimated_progress_stage: z.string(), extracted_text: z.string().default("") });
export type EvidenceAnalysis = z.infer<typeof evidenceAnalysisSchema>;
export interface AIProvider { analyzeEvidence(imageUrl: string, claim: string): Promise<EvidenceAnalysis>; generateEmbedding(text: string): Promise<number[]>; answerQuestion(question: string, context: string): Promise<string>; }
export const demoAIProvider: AIProvider = { async analyzeEvidence() { return { description: "Visual evidence suggests field infrastructure relevant to the project claim.", detected_objects: ["project infrastructure"], matches_claim: 78, confidence: 86, anomalies: [], estimated_progress_stage: "Implementation", extracted_text: "" }; }, async generateEmbedding(text) { return Array.from({ length: 8 }, (_, index) => ((text.charCodeAt(index % Math.max(text.length, 1)) || 65) % 31) / 31); }, async answerQuestion() { return "Insufficient evidence available."; } };
