export type VerificationStatus = "VERIFIED" | "PARTIALLY_VERIFIED" | "NEEDS_REVIEW" | "UNSUPPORTED" | "POSSIBLE_REUSE";

export type Evidence = {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  capturedAt: string;
  imageUrl: string;
  caption: string;
  description: string;
  detectedObjects: string[];
  confidence: number;
  trustScore: number;
  status: VerificationStatus;
  gps: { lat: number; lng: number } | null;
  flags: string[];
};

export type DemoProject = { id: string; name: string; location: string; category: string; coverage: number; trustScore: number };
