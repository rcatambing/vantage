import { Intent, Tag, Classes } from "@blueprintjs/core";
import ScreenLayout from "../templates/ScreenLayout";
import Panel from "../components/Panel";
import KpiCard from "../widgets/KpiCard";
import BarChart from "../widgets/BarChart";
import MapView from "../widgets/MapView";
import DataTable, { StatusTag } from "../widgets/DataTable";
import { VOTER_WORKBENCH } from "../data/screens";

const sentimentData = [
  { label: "Jan", value: 68 },
  { label: "Feb", value: 71 },
  { label: "Mar", value: 74 },
  { label: "Apr", value: 72 },
  { label: "May", value: 69 },
  { label: "Jun", value: 75 },
  { label: "Jul", value: 78 },
  { label: "Aug", value: 76 },
];

interface VoterRow {
  id: string;
  name: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  sentiment: number;
  status: string;
}

const voterRows: VoterRow[] = [
  { id: "VTR-00142", name: "Rodriguez, Elena M.", region: "NCR", province: "Metro Manila", city: "Quezon City", barangay: "Brgy. 142", sentiment: 82, status: "Active" },
  { id: "VTR-00287", name: "Garcia, Roberto S.", region: "Region III", province: "Pampanga", city: "San Fernando", barangay: "Brgy. Del Carmen", sentiment: 65, status: "Active" },
  { id: "VTR-00431", name: "Mendoza, Clara T.", region: "Region IV-A", province: "Cavite", city: "Bacoor", barangay: "Brgy. Molino", sentiment: 73, status: "Active" },
  { id: "VTR-00576", name: "De Leon, Marco P.", region: "Region VII", province: "Cebu", city: "Cebu City", barangay: "Brgy. Lahug", sentiment: 58, status: "Active" },
  { id: "VTR-00721", name: "Santos, Isabel R.", region: "NCR", province: "Metro Manila", city: "Makati", barangay: "Brgy. Poblacion", sentiment: 91, status: "Active" },
  { id: "VTR-00866", name: "Villanueva, Jose A.", region: "Region XI", province: "Davao del Sur", city: "Davao City", barangay: "Brgy. Toril", sentiment: 44, status: "Active" },
  { id: "VTR-01011", name: "Bautista, Rosa L.", region: "Region VI", province: "Iloilo", city: "Iloilo City", barangay: "Brgy. Jaro", sentiment: 77, status: "Active" },
  { id: "VTR-01156", name: "Reyes, Daniel K.", region: "Region I", province: "Pangasinan", city: "Dagupan", barangay: "Brgy. Bonuan", sentiment: 61, status: "Active" },
];

function SentimentTag({ value }: { value: number }) {
  const intent = value >= 75 ? Intent.SUCCESS : value >= 50 ? Intent.WARNING : Intent.DANGER;
  return <Tag minimal intent={intent}>{value}</Tag>;
}

const voterColumns = [
  { key: "id", header: "ID", render: (r: VoterRow) => <code>{r.id}</code> },
  { key: "name", header: "Name", render: (r: VoterRow) => r.name },
  { key: "region", header: "Region", render: (r: VoterRow) => r.region },
  { key: "city", header: "City", render: (r: VoterRow) => r.city },
  { key: "barangay", header: "Barangay", render: (r: VoterRow) => r.barangay },
  { key: "sentiment", header: "Sentiment", render: (r: VoterRow) => <SentimentTag value={r.sentiment} /> },
  { key: "status", header: "Status", render: (r: VoterRow) => <StatusTag status={r.status} /> },
];

/* Demographics bar */
function DemographicsPanel() {
  const brackets = [
    { label: "18-24", value: 18 },
    { label: "25-34", value: 28 },
    { label: "35-44", value: 24 },
    { label: "45-54", value: 16 },
    { label: "55-64", value: 9 },
    { label: "65+", value: 5 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, height: "100%" }}>
      <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginBottom: 4 }}>Age Distribution (%)</div>
      {brackets.map((b) => (
        <div key={b.label} className="stat-row">
          <span style={{ fontSize: 13, width: 50 }}>{b.label}</span>
          <div className="progress-mini" style={{ flex: 1, margin: "0 12px" }}>
            <div className="progress-fill" style={{ width: `${b.value * 3}%`, background: "#4589ff" }} />
          </div>
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 12, width: 30, textAlign: "right" }}>{b.value}%</span>
        </div>
      ))}

      <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 12, marginBottom: 4 }}>Gender Split</div>
      <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
        <Tag minimal intent={Intent.PRIMARY}>Male 52%</Tag>
        <Tag minimal intent={Intent.SUCCESS}>Female 47%</Tag>
        <Tag minimal>Other 1%</Tag>
      </div>
    </div>
  );
}

export default function VoterWorkbenchScreen() {
  const cfg = VOTER_WORKBENCH;

  const handleSave = () => {
    /* Mock save */
  };

  return (
    <ScreenLayout
      id={cfg.id}
      name={cfg.name}
      description={cfg.description}
      className="workbench-screen"
      onSave={handleSave}
    >
      <Panel id={cfg.panels[0].id} name={cfg.panels[0].name} size={cfg.panels[0].size}>
        <KpiCard label="Total Registered" value="3.42M" delta="+48K new registrations" deltaPositive icon="people" intent={Intent.PRIMARY} />
      </Panel>

      <Panel id={cfg.panels[1].id} name={cfg.panels[1].name} size={cfg.panels[1].size}>
        <KpiCard label="Sentiment Index" value="72.4" delta="-1.2 pts this week" deltaPositive={false} icon="heart" intent={Intent.WARNING} />
      </Panel>

      <Panel id={cfg.panels[2].id} name={cfg.panels[2].name} size={cfg.panels[2].size}>
        <KpiCard label="Coverage Rate" value="64%" delta="+3.1% improvement" deltaPositive icon="map" intent={Intent.SUCCESS} />
      </Panel>

      <Panel id={cfg.panels[3].id} name={cfg.panels[3].name} size={cfg.panels[3].size}>
        <DemographicsPanel />
      </Panel>

      <Panel id={cfg.panels[4].id} name={cfg.panels[4].name} size={cfg.panels[4].size}>
        <MapView />
      </Panel>

      <Panel id={cfg.panels[5].id} name={cfg.panels[5].name} size={cfg.panels[5].size}>
        <DataTable columns={voterColumns} data={voterRows} />
      </Panel>

      <Panel id={cfg.panels[6].id} name={cfg.panels[6].name} size={cfg.panels[6].size}>
        <BarChart data={sentimentData} />
      </Panel>
    </ScreenLayout>
  );
}
