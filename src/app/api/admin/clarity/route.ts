import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

/** Regenerate the composed response at most every two hours. */
export const revalidate = 7200;

const BASE_URL = "https://www.clarity.ms/export-data/api/v1/project-live-insights";
const TOKEN = process.env.CLARITY_API_TOKEN;

type Facts = Record<string, unknown>;
type MetricBlock = { metricName?: string; information?: Facts[] };

async function fetchInsights(dimension?: string): Promise<MetricBlock[]> {
  const url = new URL(BASE_URL);
  url.searchParams.set("numOfDays", "3");
  if (dimension) url.searchParams.set("dimension1", dimension);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Clarity API responded ${response.status}`);
  const json: unknown = await response.json();
  return Array.isArray(json) ? (json as MetricBlock[]) : [];
}

/*
 * Clarity allows only 10 requests per project per day. Each upstream query is
 * cached for a full day, so opening Studio repeatedly never burns the quota.
 */
const getSummary = unstable_cache(() => fetchInsights(), ["clarity-v1", "summary"], {
  revalidate: 86400,
});
const getPages = unstable_cache(() => fetchInsights("URL"), ["clarity-v1", "pages"], {
  revalidate: 86400,
});
const getCountries = unstable_cache(
  () => fetchInsights("Country/Region"),
  ["clarity-v1", "countries"],
  { revalidate: 86400 }
);
const getDevices = unstable_cache(() => fetchInsights("Device"), ["clarity-v1", "devices"], {
  revalidate: 86400,
});

const num = (value: unknown): number => {
  const parsed = Number(typeof value === "string" ? value.replace(/,/g, "") : value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function metricRows(blocks: MetricBlock[], name: string): Facts[] {
  const block = blocks.find((item) => item.metricName?.toLowerCase() === name.toLowerCase());
  return block?.information ?? [];
}

const METRIC_FIELDS = new Set([
  "totalSessionCount",
  "totalBotSessionCount",
  "distinctUserCount",
  "pagesPerSessionPercentage",
  "sessionsCount",
  "sessionsWithMetricPercentage",
  "sessionsWithoutMetricPercentage",
  "pagesViews",
  "subTotal",
  "averageScrollDepth",
  "totalTime",
  "activeTime",
]);

function dimensionValue(row: Facts, preferred: string[]): string {
  for (const key of preferred) {
    const value = row[key];
    if (typeof value === "string" && value) return value;
  }
  for (const [key, value] of Object.entries(row)) {
    if (!METRIC_FIELDS.has(key) && typeof value === "string" && value) return value;
  }
  return "Autres";
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function breakdown(blocks: MetricBlock[], dimensionKeys: string[]) {
  const friction = ["RageClickCount", "DeadClickCount", "ErrorClickCount"];
  const frictionByDimension = new Map<string, number>();
  for (const metric of friction) {
    for (const row of metricRows(blocks, metric)) {
      const key = dimensionValue(row, dimensionKeys);
      frictionByDimension.set(key, (frictionByDimension.get(key) ?? 0) + num(row.subTotal));
    }
  }

  return metricRows(blocks, "Traffic")
    .map((row) => {
      const name = dimensionValue(row, dimensionKeys);
      return {
        name,
        sessions: num(row.totalSessionCount),
        bots: num(row.totalBotSessionCount),
        users: num(row.distinctUserCount),
        friction: frictionByDimension.get(name) ?? 0,
      };
    })
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10);
}

export async function GET() {
  if (!TOKEN) {
    return NextResponse.json({
      configured: false,
      message: "CLARITY_API_TOKEN is not set on the server.",
      trackedEvents: [
        "whatsapp_click",
        "phone_call_click",
        "reserve_click",
        "order_click",
        "book_now_click",
      ],
    });
  }

  const [summaryResult, pagesResult, countriesResult, devicesResult] = await Promise.allSettled([
    getSummary(),
    getPages(),
    getCountries(),
    getDevices(),
  ]);

  const errors: string[] = [];
  const value = (result: PromiseSettledResult<MetricBlock[]>, label: string): MetricBlock[] => {
    if (result.status === "fulfilled") return result.value;
    errors.push(`${label}: ${String(result.reason)}`);
    return [];
  };

  const summaryBlocks = value(summaryResult, "summary");
  const pagesBlocks = value(pagesResult, "pages");
  const countriesBlocks = value(countriesResult, "countries");
  const devicesBlocks = value(devicesResult, "devices");

  const combined = [...summaryBlocks, ...pagesBlocks];
  const traffic = metricRows(combined, "Traffic");
  const sessions = traffic.reduce((total, row) => total + num(row.totalSessionCount), 0);
  const bots = traffic.reduce((total, row) => total + num(row.totalBotSessionCount), 0);
  const users = traffic.reduce((total, row) => total + num(row.distinctUserCount), 0);
  const engagement = metricRows(combined, "EngagementTime");
  const totalSeconds = engagement.reduce((total, row) => total + num(row.totalTime), 0);
  const avgSeconds = sessions > 0 ? Math.round(totalSeconds / sessions) : 0;

  const frictionMetrics = ["DeadClickCount", "RageClickCount", "QuickbackClick", "ErrorClickCount"];
  const frictionClicks = frictionMetrics.reduce(
    (total, metric) =>
      total +
      metricRows(pagesBlocks, metric).reduce((sum, row) => sum + num(row.subTotal), 0),
    0
  );

  return NextResponse.json({
    configured: true,
    generatedAt: new Date().toISOString(),
    windowDays: 3,
    summary: {
      sessions: Math.max(sessions - bots, 0),
      users,
      averageTime: formatDuration(avgSeconds),
      frictionClicks,
      customEvents: "Custom button events are only available in the Clarity dashboard.",
    },
    trackedEvents: [
      "whatsapp_click",
      "phone_call_click",
      "reserve_click",
      "order_click",
      "book_now_click",
    ],
    pages: breakdown(pagesBlocks, ["Url"]),
    countries: breakdown(countriesBlocks, ["Country/Region", "Country"]),
    devices: breakdown(devicesBlocks, ["Device"]),
    errors,
  });
}
