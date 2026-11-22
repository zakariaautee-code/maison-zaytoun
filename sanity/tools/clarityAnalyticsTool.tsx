"use client";

import { BarChartIcon } from "@sanity/icons";
import { Badge, Button, Card, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { useEffect, useState } from "react";

type Insight = {
  name: string;
  sessions: number;
  users: number;
  bots: number;
  friction: number;
};

type Insights = {
  configured: boolean;
  message?: string;
  generatedAt?: string;
  windowDays?: number;
  summary?: {
    sessions: number;
    users: number;
    averageTime: string;
    frictionClicks: number;
    customEvents: string;
  };
  trackedEvents?: string[];
  pages?: Insight[];
  countries?: Insight[];
  devices?: Insight[];
  errors?: string[];
};

const truncate = (value: string, max = 52) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card padding={4} radius={2} shadow={1} tone="transparent" border>
      <Stack space={2}>
        <Text size={1} muted>
          {label}
        </Text>
        <Text size={5} weight="semibold">
          {value}
        </Text>
        {hint && (
          <Text size={1} muted>
            {hint}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

function Table({ title, rows, empty }: { title: string; rows: Insight[]; empty: string }) {
  return (
    <Card padding={4} radius={2} border>
      <Stack space={3}>
        <Heading size={1}>{title}</Heading>
        {rows.length === 0 ? (
          <Text size={1} muted>
            {empty}
          </Text>
        ) : (
          <Stack space={2}>
            {rows.map((row) => (
              <Flex key={row.name} align="center" justify="space-between" gap={2}>
                <Text size={1} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {truncate(row.name)}
                </Text>
                <Flex gap={3} align="center">
                  <Text size={1} muted>
                    {row.users} users
                  </Text>
                  <Badge tone="default">{row.sessions} sessions</Badge>
                </Flex>
              </Flex>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

export default function ClarityAnalyticsTool() {
  const [data, setData] = useState<Insights | null>(null);
  const [error, setError] = useState("");
  const projectId = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    let active = true;
    fetch("/api/admin/clarity")
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        return response.json() as Promise<Insights>;
      })
      .then((insights) => {
        if (active) setData(insights);
      })
      .catch((reason: unknown) => {
        if (active) setError(String(reason));
      });
    return () => {
      active = false;
    };
  }, []);

  const recordingUrl = `https://clarity.microsoft.com/projects/view/${projectId || ""}/recordings`;

  return (
    <Card padding={[3, 4, 5]}>
      <Stack space={4}>
        <Flex align="center" justify="space-between" gap={3} wrap="wrap">
          <Stack space={2}>
            <Heading size={2}>Visitor analytics</Heading>
            <Text size={1} muted>
              Microsoft Clarity · last {data?.windowDays ?? 3} days
            </Text>
          </Stack>
          <a href={recordingUrl} target="_blank" rel="noreferrer">
            <Button icon={BarChartIcon} text="Watch heatmaps & replays" tone="primary" />
          </a>
        </Flex>

        {error && (
          <Card padding={3} tone="critical" border>
            <Text size={1}>Could not load analytics: {error}</Text>
          </Card>
        )}

        {!data && !error && (
          <Flex align="center" gap={2} padding={4}>
            <Spinner muted />
            <Text size={1} muted>
              Loading insights…
            </Text>
          </Flex>
        )}

        {data && !data.configured && (
          <Card padding={4} tone="caution" border>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Clarity is not connected yet
              </Text>
              <Text size={1} muted>
                {data.message ?? "Add CLARITY_API_TOKEN and NEXT_PUBLIC_CLARITY_ID in Vercel, then redeploy."}
              </Text>
            </Stack>
          </Card>
        )}

        {data?.configured && data.summary && (
          <>
            <Grid columns={[1, 2, 4]} gap={2}>
              <Metric label="Total sessions" value={String(data.summary.sessions)} />
              <Metric label="Unique users" value={String(data.summary.users)} />
              <Metric label="Average time spent" value={data.summary.averageTime} />
              <Metric
                label="Friction clicks"
                value={String(data.summary.frictionClicks)}
                hint="rage, dead, error and quickback"
              />
            </Grid>

            <Card padding={3} tone="transparent" border>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Tracked button events
                </Text>
                <Flex gap={2} wrap="wrap">
                  {(data.trackedEvents ?? []).map((event) => (
                    <Badge key={event} tone="positive">
                      {event}
                    </Badge>
                  ))}
                </Flex>
                <Text size={1} muted>
                  {data.summary.customEvents}
                </Text>
              </Stack>
            </Card>

            <Grid columns={[1, 2, 3]} gap={2}>
              <Table
                title="Top visited pages"
                rows={data.pages ?? []}
                empty="No page data yet."
              />
              <Table
                title="Countries"
                rows={data.countries ?? []}
                empty="No location data yet."
              />
              <Table title="Devices" rows={data.devices ?? []} empty="No device data yet." />
            </Grid>

            {data.errors && data.errors.length > 0 && (
              <Card padding={3} tone="caution" border>
                <Stack space={1}>
                  {data.errors.map((item) => (
                    <Text key={item} size={1}>
                      {item}
                    </Text>
                  ))}
                </Stack>
              </Card>
            )}

            {data.generatedAt && (
              <Text size={1} muted>
                Updated {new Date(data.generatedAt).toLocaleString()}
              </Text>
            )}
          </>
        )}
      </Stack>
    </Card>
  );
}
