import { useState, useEffect, useCallback } from "react";
import { Intent } from "@blueprintjs/core";
import ScreenLayout from "../templates/ScreenLayout";
import Panel from "../components/Panel";
import KpiCard from "../widgets/KpiCard";
import BarChart from "../widgets/BarChart";
import DonutChart from "../widgets/DonutChart";
import DataTable, { StatusTag, ProgressCell } from "../widgets/DataTable";
import Feed from "../components/Feed";
import { type IComment } from "../components/Comment.types";
import { CAMPAIGN_DASHBOARD } from "../data/screens";
import { feedItems } from "../data/feed";
import { apiFetch } from "../lib/api/client";
import MetricPanelSkeleton from "../features/analytics/components/MetricPanelSkeleton";
import MetricErrorState from "../features/analytics/components/MetricErrorState";
import DashboardFilterBar, { type DashboardFilters } from "../features/analytics/components/DashboardFilterBar";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface DashboardKpi {
  label: string;
  value: string;
  delta?: string;
  delta_positive?: boolean;
  icon?: string;
  intent?: Intent;
}

interface DashboardRegionData {
  label: string;
  value: number;
}

interface DashboardStatusSegment {
  label: string;
  value: number;
  color: string;
}

interface DashboardTask {
  id: string;
  campaign: string;
  objective: string;
  assignee: string;
  status: string;
  progress: number;
  due_date: string;
}

interface DashboardResponse {
  kpis: DashboardKpi[];
  region_data: DashboardRegionData[];
  status_segments: DashboardStatusSegment[];
  tasks: DashboardTask[];
  feed_comments: Record<string, IComment[]>;
}

/* ── Mock fallback data (used when API fails or for initial state) ─────── */

const feedCommentsMap: Record<string, IComment[]> = {
  "1": [
    {
      id: "c1",
      author: { name: "M. Santos", avatar: "https://randomuser.me/api/portraits/women/10.jpg", role: "Political Officer" },
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      content: "Has anyone reported this to the city maintenance department yet?",
      likesCount: 3,
      replies: [
        {
          id: "c1r1",
          author: { name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg", role: "Reporter" },
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          content: "Yes, I filed a ticket with Public Works this morning.",
          likesCount: 2,
        },
      ],
    },
  ],
  "2": [
    {
      id: "c2",
      author: { name: "A. Cruz", role: "Analyst" },
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      content: "I can confirm this. Drove by earlier and saw the mess. We need a cleanup crew.",
      likesCount: 5,
    },
    {
      id: "c2b",
      author: { name: "J. Reyes", avatar: "https://randomuser.me/api/portraits/men/12.jpg", role: "Field Coordinator" },
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      content: "Dispatching a sanitation team to the area now.",
      likesCount: 7,
    },
  ],
  "3": [
    {
      id: "c3",
      author: { name: "D. Ramos", avatar: "https://randomuser.me/api/portraits/men/15.jpg", role: "Volunteer" },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
      content: "The water department has been notified. ETA for repair crew is 2 hours.",
      likesCount: 4,
      replies: [
        {
          id: "c3r1",
          author: { name: "S. Luna", avatar: "https://randomuser.me/api/portraits/women/20.jpg", role: "Staff" },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
          content: "Residents on Elm St should boil water until further notice.",
          likesCount: 6,
        },
      ],
    },
  ],
  "5": [
    {
      id: "c5",
      author: { name: "S. Luna", avatar: "https://randomuser.me/api/portraits/women/20.jpg", role: "Staff" },
      timestamp: new Date(Date.now() - 1000 * 5),
      content: "Emergency services are en route. Please avoid Ocean Drive until cleared.",
      likesCount: 12,
    },
  ],
};

const defaultKpis: DashboardKpi[] = [
  { label: "Total Voters Reached", value: "1.24M", delta: "+12.3% vs last month", delta_positive: true, icon: "people", intent: Intent.PRIMARY },
  { label: "Active Campaigns", value: "7", delta: "+2 this quarter", delta_positive: true, icon: "flag", intent: Intent.SUCCESS },
  { label: "Field Operatives", value: "342", delta: "+18 deployed", delta_positive: true, icon: "walk", intent: Intent.WARNING },
  { label: "Avg Sentiment Score", value: "72.4", delta: "-1.2 pts", delta_positive: false, icon: "heart", intent: Intent.DANGER },
  { label: "Tasks Completed", value: "1,847", delta: "+156 this week", delta_positive: true, icon: "tick-circle", intent: Intent.SUCCESS },
  { label: "Intel Reports Filed", value: "489", delta: "+34 today", delta_positive: true, icon: "eye-open", intent: Intent.PRIMARY },
];

const defaultRegionData: DashboardRegionData[] = [
  { label: "NCR", value: 284000 },
  { label: "Region III", value: 198000 },
  { label: "Region IV-A", value: 176000 },
  { label: "Region VII", value: 142000 },
  { label: "Region XI", value: 118000 },
  { label: "Region VI", value: 95000 },
  { label: "Region I", value: 87000 },
  { label: "Region X", value: 72000 },
];

const defaultStatusSegments: DashboardStatusSegment[] = [
  { label: "Active", value: 4, color: "#24a148" },
  { label: "Planning", value: 2, color: "#f1c21b" },
  { label: "Completed", value: 1, color: "#4589ff" },
];

const defaultTasks: DashboardTask[] = [
  { id: "TSK-001", campaign: "Luzon Expansion", objective: "Voter Registration Drive", assignee: "M. Santos", status: "In Progress", progress: 68, due_date: "Apr 15, 2026" },
  { id: "TSK-002", campaign: "Visayas Outreach", objective: "Community Engagement", assignee: "J. Reyes", status: "Active", progress: 42, due_date: "Apr 22, 2026" },
  { id: "TSK-003", campaign: "NCR Operations", objective: "Sentiment Analysis", assignee: "A. Cruz", status: "Completed", progress: 100, due_date: "Mar 28, 2026" },
  { id: "TSK-004", campaign: "Mindanao Intel", objective: "Field Intelligence", assignee: "C. Tan", status: "Planning", progress: 15, due_date: "May 01, 2026" },
  { id: "TSK-005", campaign: "NCR Operations", objective: "Poll Deployment", assignee: "S. Luna", status: "In Progress", progress: 81, due_date: "Apr 10, 2026" },
  { id: "TSK-006", campaign: "Luzon Expansion", objective: "Staff Recruitment", assignee: "D. Ramos", status: "Active", progress: 55, due_date: "Apr 30, 2026" },
  { id: "TSK-007", campaign: "Visayas Outreach", objective: "Intel Consolidation", assignee: "M. Santos", status: "Overdue", progress: 23, due_date: "Mar 20, 2026" },
];

/* ── Component ───────────────────────────────────────────────────────── */

export default function CampaignDashboardScreen() {
  const cfg = CAMPAIGN_DASHBOARD;

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    campaignId: "1",
    dateFrom: "",
    dateTo: "",
    districtId: "",
  });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      qs.set("campaign_id", filters.campaignId);
      if (filters.dateFrom) qs.set("from_date", filters.dateFrom);
      if (filters.dateTo) qs.set("to_date", filters.dateTo);
      if (filters.districtId) qs.set("district_id", filters.districtId);

      const res = await apiFetch<DashboardResponse>(`/analytics/dashboard?${qs.toString()}`);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const kpis = data?.kpis ?? defaultKpis;
  const regionData = data?.region_data ?? defaultRegionData;
  const statusSegments = data?.status_segments ?? defaultStatusSegments;
  const tasks = data?.tasks ?? defaultTasks;

  const taskColumns = [
    { key: "id", header: "ID", render: (r: DashboardTask) => <code>{r.id}</code> },
    { key: "campaign", header: "Campaign", render: (r: DashboardTask) => r.campaign },
    { key: "objective", header: "Objective", render: (r: DashboardTask) => r.objective },
    { key: "assignee", header: "Assignee", render: (r: DashboardTask) => r.assignee },
    { key: "status", header: "Status", render: (r: DashboardTask) => <StatusTag status={r.status} /> },
    { key: "progress", header: "Progress", render: (r: DashboardTask) => <ProgressCell value={r.progress} /> },
    { key: "due_date", header: "Due Date", render: (r: DashboardTask) => r.due_date },
  ];

  const handleSave = () => {
    /* Mock save — would POST to /api/dashboards/{id}/layout */
  };

  return (
    <ScreenLayout id={cfg.id} name={cfg.name} description={cfg.description} onSave={handleSave}>
      <DashboardFilterBar
        campaigns={[
          { id: "1", name: "NCR Operations" },
          { id: "2", name: "Luzon Expansion" },
          { id: "3", name: "Visayas Outreach" },
          { id: "4", name: "Mindanao Intel" },
        ]}
        districts={[
          { id: "", name: "All districts" },
          { id: "ncr", name: "NCR" },
          { id: "region-3", name: "Region III" },
          { id: "region-4a", name: "Region IV-A" },
          { id: "region-7", name: "Region VII" },
        ]}
        initialFilters={filters}
        onApply={setFilters}
        onClear={() =>
          setFilters({ campaignId: "1", dateFrom: "", dateTo: "", districtId: "" })
        }
      />

      {loading && <MetricPanelSkeleton count={cfg.panels.length} />}

      {!loading && error && (
        <MetricErrorState metricName="Campaign Dashboard" onRetry={fetchDashboard} />
      )}

      {!loading && !error && (
        <>
          {cfg.panels.slice(0, 6).map((p, i) => (
            <Panel key={p.id} id={p.id} name={p.name} size={p.size}>
              <KpiCard
                label={kpis[i]?.label ?? p.name}
                value={kpis[i]?.value ?? "—"}
                delta={kpis[i]?.delta}
                deltaPositive={kpis[i]?.delta_positive}
                icon={kpis[i]?.icon}
                intent={kpis[i]?.intent}
              />
            </Panel>
          ))}

          <Panel id={cfg.panels[6].id} name={cfg.panels[6].name} size={cfg.panels[6].size}>
            <BarChart data={regionData} />
          </Panel>

          <Panel id={cfg.panels[7].id} name={cfg.panels[7].name} size={cfg.panels[7].size}>
            <DonutChart segments={statusSegments} centerLabel={String(statusSegments.reduce((a, s) => a + s.value, 0))} />
          </Panel>

          <Panel id={cfg.panels[8].id} name={cfg.panels[8].name} size={cfg.panels[8].size}>
            <Feed items={feedItems} commentsMap={feedCommentsMap} />
          </Panel>

          <Panel id={cfg.panels[9].id} name={cfg.panels[9].name} size={cfg.panels[9].size}>
            <DataTable columns={taskColumns} data={tasks} />
          </Panel>
        </>
      )}
    </ScreenLayout>
  );
}
