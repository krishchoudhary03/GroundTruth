export type TrustInputs = { gpsConsistent: boolean | null; timestampConsistent: boolean | null; aiConfidence: number; claimMatch: number; unique: boolean; moderation: boolean | null; duplicateSimilarity?: number; anomalySeverity?: number };

export function calculateTrustScore(input: TrustInputs) {
  const breakdown = { aiConfidence: Math.round(input.aiConfidence * 0.2), claimMatch: Math.round(input.claimMatch * 0.2), gpsConsistency: input.gpsConsistent === true ? 15 : 0, timestampConsistency: input.timestampConsistent === true ? 15 : 0, uniqueness: input.unique ? 20 : 0, moderation: input.moderation === true ? 10 : 0 };
  let score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  if ((input.duplicateSimilarity ?? 0) > 0.92) score -= 30;
  if (input.gpsConsistent === false) score -= 15;
  if (input.timestampConsistent === false) score -= 10;
  score -= Math.min(15, input.anomalySeverity ?? 0);
  return { score: Math.max(0, Math.min(100, score)), breakdown };
}

export function haversineDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const radius = 6371;
  const latitudeDelta = ((b.lat - a.lat) * Math.PI) / 180;
  const longitudeDelta = ((b.lng - a.lng) * Math.PI) / 180;
  const value = Math.sin(latitudeDelta / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(longitudeDelta / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}
