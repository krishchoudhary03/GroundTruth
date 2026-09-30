import { describe, expect, it } from "vitest";
import { calculateTrustScore, haversineDistanceKm } from "./trust-score";

describe("trust score engine", () => {
  it("rewards clean evidence", () => {
    expect(calculateTrustScore({ gpsConsistent: true, timestampConsistent: true, aiConfidence: 95, claimMatch: 92, unique: true, moderation: true }).score).toBe(97);
  });

  it("penalizes possible reused evidence", () => {
    const score = calculateTrustScore({ gpsConsistent: true, timestampConsistent: true, aiConfidence: 90, claimMatch: 90, unique: false, moderation: true, duplicateSimilarity: 0.94 }).score;
    expect(score).toBeLessThan(80);
  });

  it("penalizes GPS and timestamp anomalies", () => {
    const score = calculateTrustScore({ gpsConsistent: false, timestampConsistent: false, aiConfidence: 80, claimMatch: 70, unique: true, moderation: true }).score;
    expect(score).toBeLessThan(70);
  });
});

describe("metadata helpers", () => {
  it("calculates a meaningful distance", () => {
    expect(haversineDistanceKm({ lat: 27.1767, lng: 78.0081 }, { lat: 28.6139, lng: 77.209 }).toFixed(0)).toBe("178");
  });
});
