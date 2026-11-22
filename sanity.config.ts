"use client";

import { BarChartIcon } from "@sanity/icons";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import ClarityAnalyticsTool from "./sanity/tools/clarityAnalyticsTool";
import { schemaTypes } from "./sanity/schemaTypes";

const clarityAnalyticsTool = {
  name: "clarity-analytics",
  title: "Analytics",
  icon: BarChartIcon,
  component: ClarityAnalyticsTool,
};

export default defineConfig({
  name: "maison-zaytoun",
  title: "Maison Zaytoun — Menu",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool()],
  tools: [clarityAnalyticsTool],
  schema: { types: schemaTypes },
});
