import type { Metadata } from "next";
import { AnalyzerView } from "@/components/analyzer-view";

export const metadata: Metadata = {
  title: "Analyzer",
};

export default function AnalyzerPage() {
  return <AnalyzerView />;
}
