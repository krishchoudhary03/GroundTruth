import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GroundTruth | From field evidence to verified impact",
  description: "Evidence-backed field media intelligence for impact teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
