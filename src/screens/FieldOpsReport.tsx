import { useState, useEffect, useCallback } from "react";
import { Intent, Tag, Callout, Classes } from "@blueprintjs/core";
import ScreenLayout from "../templates/ScreenLayout";
import Panel from "../components/Panel";
import BarChart from "../widgets/BarChart";
import DonutChart from "../widgets/DonutChart";
import DataTable, { ProgressCell } from "../widgets/DataTable";
import { FIELD_OPS_REPORT } from "../data/screens";
import { apiFetch } from "../lib/api/client";
import MetricPanelSkeleton from "../features/analytics/components/MetricPanelSkeleton";
import MetricErrorState from "../features/analytics/components/MetricErrorState";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface ReportSummaryMetric {
  label: string;
  value: string;
}

interface IntelSegment {
  label: string;
  value: number;
  color: string;
}

interface StaffMember {
  name: string;
  tasks_completed: number;
  rating: number;
}

interface RegionRow {
  id: string;
  region: string;
  operatives: number;
  intel_reports: number;
  voters_reached: number;
  completion: number;
}

interface PollResult {
  question: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface MonthlyDatum {
  label: string;
  value: number;
}

interface FieldOpsResponse {
  summary_metrics: ReportSummaryMetric[];
  summary_title: string;
  summary_description: string;
  intel_segments: IntelSegment[];
  intel_total: number;
  staff_performance: StaffMember[];
  region_rows: RegionRow[];
  poll_results: PollResult[];
  monthly_data: MonthlyDatum[];
}

/* ── Fallback data ───────────────────────────────────────────────────── */

const defaultSummaryMetrics: ReportSummaryMetric[] = [
  { label: "Total Operations", value: "124" },
  { label: "Intel Reports", value: "489" },
  { label: "Regions Covered", value: "8" },
  { label: "Staff Deployed", value: "342" },
  { label: "Polling Sessions", value: "67" },
  { label: "Avg Completion", value: "73%" },
];

const defaultIntelSegments: IntelSegment[] = [
  { label: "Field Observations", value: 198, color: "#4589ff" },
  { label: "Photo Intel", value: 134, color: "#24a148" },
  { label: "Video Intel", value: 67, color: "#f1c21b" },
  { label: "Document Intel", value: 56, color: "#a56eff" },
  { label: "Audio Intel", value: 34, color: "#da1e28" },
];

const defaultStaff: StaffMember[] = [
  { name: "Maria Santos", tasks_completed: 47, rating: 94 },
  { name: "Juan Reyes", tasks_completed: 38, rating: 87 },
  { name: "Ana Cruz", tasks_completed: 35, rating: 91 },
  { name: "Carlos Tan", tasks_completed: 31, rating: 78 },
  { name: "Sofia Luna", tasks_completed: 29, rating: 85 },
];

const defaultRegionRows: RegionRow[] = [
  { id: "r1", region: "NCR", operatives: 86, intel_reports: 142, voters_reached: 284000, completion: 82 },
  { id: "r2", region: "Region III", operatives: 54, intel_reports: 89, voters_reached: 198000, completion: 71 },
  { id: "r3", region: "Region IV-A", operatives: 48, intel_reports: 76, voters_reached: 176000, completion: 68 },
  { id: "r4", region: "Region VII", operatives: 42, intel_reports: 61, voters_reached: 142000, completion: 75 },
  { id: "r5", region: "Region XI", operatives: 38, intel_reports: 54, voters_reached: 118000, completion: 62 },
  { id: "r6", region: "Region VI", operatives: 32, intel_reports: 38, voters_reached: 95000, completion: 58 },
  { id: "r7", region: "Region I", operatives: 24, intel_reports: 18, voters_reached: 87000, completion: 45 },
  { id: "r8", region: "Region X", operatives: 18, intel_reports: 11, voters_reached: 72000, completion: 39 },
];

const defaultPolls: PollResult[] = [
  { question: "Candidate Favorability", positive: 62, negative: 24, neutral: 14 },
  { question: "Service Satisfaction", positive: 71, negative: 12, neutral: 17 },
  { question: "Policy Awareness", positive: 45, negative: 31, neutral: 24 },
  { question: "Community Trust Index", positive: 58, negative: 22, neutral: 20 },
];

const defaultMonthlyData: MonthlyDatum[] = [
  { label: "Oct", value: 64 },
  { label: "Nov", value: 78 },
  { label: "Dec", value: 52 },
  { label: "Jan", value: 91 },
  { label: "Feb", value: 108 },
  { label: "Mar", value: 124 },
];

/* ── Sub-components ────────────────────────────────────────────────────── */

function ReportSummaryPanel({ metrics, title, description }: { metrics: ReportSummaryMetric[]; title: string; description: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Callout intent={Intent.PRIMARY} icon="document" title={title}>
        {description}
      </Callout>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ textAlign: "center", padding: 12, borderRadius: 0, background: "var(--cds-layer-02)" }}>
            <div style={{ fontSize: 24, fontWeight: 300 }}>{m.value}</div>
            <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffPerformancePanel({ staff }: { staff: StaffMember[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginBottom: 8 }}>Top Performers by Tasks Completed</div>
      {staff.map((s, i) => (
        <div key={s.name} className="stat-row">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14, width: 18, color: i < 3 ? "#4589ff" : undefined }}>
              {i + 1}
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>{s.tasks_completed} tasks · {s.rating}% rating</div>
            </div>
          </div>
          <Tag minimal intent={s.rating >= 90 ? Intent.SUCCESS : s.rating >= 80 ? Intent.PRIMARY : Intent.WARNING}>
            {s.rating}%
          </Tag>
        </div>
      ))}
    </div>
  );
}

function PollResultsPanel({ polls }: { polls: PollResult[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {polls.map((p) => (
        <div key={p.question}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{p.question}</div>
          <div style={{ display: "flex", height: 20, borderRadius: 0, overflow: "hidden" }}>
            <div style={{ width: `${p.positive}%`, background: "#24a148", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 10 }}>{p.positive}%</span>
            </div>
            <div style={{ width: `${p.neutral}%`, background: "#f1c21b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 10 }}>{p.neutral}%</span>
            </div>
            <div style={{ width: `${p.negative}%`, background: "#da1e28", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 10 }}>{p.negative}%</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
          <div style={{ width: 8, height: 8, borderRadius: 0, background: "#24a148" }} /> Positive
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
          <div style={{ width: 8, height: 8, borderRadius: 0, background: "#f1c21b" }} /> Neutral
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
          <div style={{ width: 8, height: 8, borderRadius: 0, background: "#da1e28" }} /> Negative
        </div>
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────── */

export default function FieldOpsReportScreen() {
  const cfg = FIELD_OPS_REPORT;

  const [data, setData] = useState<FieldOpsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<FieldOpsResponse>("/analytics/field-ops");
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load field ops report");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const metrics = data?.summary_metrics ?? defaultSummaryMetrics;
  const summaryTitle = data?.summary_title ?? "Field Operations Summary — Q1 2026";
  const summaryDescription = data?.summary_description ?? "This report covers January 1 through March 28, 2026. Data is aggregated from all active campaigns across 8 regions.";
  const intelSegments = data?.intel_segments ?? defaultIntelSegments;
  const intelTotal = data?.intel_total ?? 489;
  const staff = data?.staff_performance ?? defaultStaff;
  const regionRows = data?.region_rows ?? defaultRegionRows;
  const polls = data?.poll_results ?? defaultPolls;
  const monthlyData = data?.monthly_data ?? defaultMonthlyData;

  const regionColumns = [
    { key: "region", header: "Region", render: (r: RegionRow) => <strong>{r.region}</strong> },
    { key: "operatives", header: "Operatives", render: (r: RegionRow) => r.operatives },
    { key: "intel_reports", header: "Intel Reports", render: (r: RegionRow) => r.intel_reports },
    { key: "voters_reached", header: "Voters Reached", render: (r: RegionRow) => r.voters_reached.toLocaleString() },
    { key: "completion", header: "Completion", render: (r: RegionRow) => <ProgressCell value={r.completion} /> },
  ];

  return (
    <ScreenLayout
      id={cfg.id}
      name={cfg.name}
      description={cfg.description}
      className="report-screen"
    >
      {loading && <MetricPanelSkeleton count={cfg.panels.length} />}

      {!loading && error && (
        <MetricErrorState metricName="Field Operations Report" onRetry={fetchReport} />
      )}

      {!loading && !error && (
        <>
          <Panel id={cfg.panels[0].id} name={cfg.panels[0].name} size={cfg.panels[0].size}>
            <ReportSummaryPanel metrics={metrics} title={summaryTitle} description={summaryDescription} />
          </Panel>

          <Panel id={cfg.panels[1].id} name={cfg.panels[1].name} size={cfg.panels[1].size}>
            <DonutChart segments={intelSegments} centerLabel={String(intelTotal)} />
          </Panel>

          <Panel id={cfg.panels[2].id} name={cfg.panels[2].name} size={cfg.panels[2].size}>
            <StaffPerformancePanel staff={staff} />
          </Panel>

          <Panel id={cfg.panels[3].id} name={cfg.panels[3].name} size={cfg.panels[3].size}>
            <DataTable columns={regionColumns} data={regionRows} />
          </Panel>

          <Panel id={cfg.panels[4].id} name={cfg.panels[4].name} size={cfg.panels[4].size}>
            <PollResultsPanel polls={polls} />
          </Panel>

          <Panel id={cfg.panels[5].id} name={cfg.panels[5].name} size={cfg.panels[5].size}>
            <BarChart data={monthlyData} />
          </Panel>
        </>
      )}
    </ScreenLayout>
  );
}
