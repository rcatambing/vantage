import { Intent, Tag, Callout, Classes } from "@blueprintjs/core";
import ScreenLayout from "../templates/ScreenLayout";
import Panel from "../components/Panel";
import BarChart from "../widgets/BarChart";
import DonutChart from "../widgets/DonutChart";
import DataTable, { ProgressCell } from "../widgets/DataTable";
import { FIELD_OPS_REPORT } from "../data/screens";

function ReportSummaryPanel() {
  const metrics = [
    { label: "Total Operations", value: "124" },
    { label: "Intel Reports", value: "489" },
    { label: "Regions Covered", value: "8" },
    { label: "Staff Deployed", value: "342" },
    { label: "Polling Sessions", value: "67" },
    { label: "Avg Completion", value: "73%" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Callout intent={Intent.PRIMARY} icon="document" title="Field Operations Summary — Q1 2026">
        This report covers January 1 through March 28, 2026. Data is aggregated from all active campaigns across 8 regions.
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

const intelSegments = [
  { label: "Field Observations", value: 198, color: "#4589ff" },
  { label: "Photo Intel", value: 134, color: "#24a148" },
  { label: "Video Intel", value: 67, color: "#f1c21b" },
  { label: "Document Intel", value: 56, color: "#a56eff" },
  { label: "Audio Intel", value: 34, color: "#da1e28" },
];

function StaffPerformancePanel() {
  const staff = [
    { name: "Maria Santos", tasksCompleted: 47, rating: 94 },
    { name: "Juan Reyes", tasksCompleted: 38, rating: 87 },
    { name: "Ana Cruz", tasksCompleted: 35, rating: 91 },
    { name: "Carlos Tan", tasksCompleted: 31, rating: 78 },
    { name: "Sofia Luna", tasksCompleted: 29, rating: 85 },
  ];

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
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>{s.tasksCompleted} tasks · {s.rating}% rating</div>
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

interface RegionRow {
  id: string;
  region: string;
  operatives: number;
  intelReports: number;
  votersReached: number;
  completion: number;
}

const regionRows: RegionRow[] = [
  { id: "r1", region: "NCR", operatives: 86, intelReports: 142, votersReached: 284000, completion: 82 },
  { id: "r2", region: "Region III", operatives: 54, intelReports: 89, votersReached: 198000, completion: 71 },
  { id: "r3", region: "Region IV-A", operatives: 48, intelReports: 76, votersReached: 176000, completion: 68 },
  { id: "r4", region: "Region VII", operatives: 42, intelReports: 61, votersReached: 142000, completion: 75 },
  { id: "r5", region: "Region XI", operatives: 38, intelReports: 54, votersReached: 118000, completion: 62 },
  { id: "r6", region: "Region VI", operatives: 32, intelReports: 38, votersReached: 95000, completion: 58 },
  { id: "r7", region: "Region I", operatives: 24, intelReports: 18, votersReached: 87000, completion: 45 },
  { id: "r8", region: "Region X", operatives: 18, intelReports: 11, votersReached: 72000, completion: 39 },
];

const regionColumns = [
  { key: "region", header: "Region", render: (r: RegionRow) => <strong>{r.region}</strong> },
  { key: "operatives", header: "Operatives", render: (r: RegionRow) => r.operatives },
  { key: "intelReports", header: "Intel Reports", render: (r: RegionRow) => r.intelReports },
  { key: "votersReached", header: "Voters Reached", render: (r: RegionRow) => r.votersReached.toLocaleString() },
  { key: "completion", header: "Completion", render: (r: RegionRow) => <ProgressCell value={r.completion} /> },
];

function PollResultsPanel() {
  const polls = [
    { question: "Candidate Favorability", positive: 62, negative: 24, neutral: 14 },
    { question: "Service Satisfaction", positive: 71, negative: 12, neutral: 17 },
    { question: "Policy Awareness", positive: 45, negative: 31, neutral: 24 },
    { question: "Community Trust Index", positive: 58, negative: 22, neutral: 20 },
  ];

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

const monthlyData = [
  { label: "Oct", value: 64 },
  { label: "Nov", value: 78 },
  { label: "Dec", value: 52 },
  { label: "Jan", value: 91 },
  { label: "Feb", value: 108 },
  { label: "Mar", value: 124 },
];

export default function FieldOpsReportScreen() {
  const cfg = FIELD_OPS_REPORT;

  return (
    <ScreenLayout
      id={cfg.id}
      name={cfg.name}
      description={cfg.description}
      className="report-screen"
    >
      <Panel id={cfg.panels[0].id} name={cfg.panels[0].name} size={cfg.panels[0].size}>
        <ReportSummaryPanel />
      </Panel>

      <Panel id={cfg.panels[1].id} name={cfg.panels[1].name} size={cfg.panels[1].size}>
        <DonutChart segments={intelSegments} centerLabel="489" />
      </Panel>

      <Panel id={cfg.panels[2].id} name={cfg.panels[2].name} size={cfg.panels[2].size}>
        <StaffPerformancePanel />
      </Panel>

      <Panel id={cfg.panels[3].id} name={cfg.panels[3].name} size={cfg.panels[3].size}>
        <DataTable columns={regionColumns} data={regionRows} />
      </Panel>

      <Panel id={cfg.panels[4].id} name={cfg.panels[4].name} size={cfg.panels[4].size}>
        <PollResultsPanel />
      </Panel>

      <Panel id={cfg.panels[5].id} name={cfg.panels[5].name} size={cfg.panels[5].size}>
        <BarChart data={monthlyData} />
      </Panel>
    </ScreenLayout>
  );
}
