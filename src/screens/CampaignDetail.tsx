import { Tag, Intent, Classes, Callout, FormGroup, InputGroup, TextArea, Switch, Button } from "@blueprintjs/core";
import ScreenLayout from "../templates/ScreenLayout";
import Panel from "../components/Panel";
import TaskList from "../widgets/TaskList";
import Timeline from "../widgets/Timeline";
import { CAMPAIGN_DETAIL } from "../data/screens";

const tasks = [
  { id: "t1", title: "Complete voter registration in Brgy. 142", status: "done" as const, assignee: "M. Santos", priority: "high" as const },
  { id: "t2", title: "Deploy polling session for Makati District 2", status: "in-progress" as const, assignee: "S. Luna", priority: "high" as const },
  { id: "t3", title: "Collect field intel from Region VII contacts", status: "in-progress" as const, assignee: "C. Tan", priority: "medium" as const },
  { id: "t4", title: "Review sentiment data for NCR precincts", status: "pending" as const, assignee: "A. Cruz", priority: "medium" as const },
  { id: "t5", title: "Schedule community engagement event in Cebu", status: "pending" as const, assignee: "J. Reyes", priority: "low" as const },
  { id: "t6", title: "Update staff area assignments for Mindanao", status: "pending" as const, assignee: "D. Ramos", priority: "medium" as const },
  { id: "t7", title: "Finalize quarterly field operations report", status: "pending" as const, assignee: "M. Santos", priority: "high" as const },
];

const timelineItems = [
  { id: "tl1", icon: "flag", color: "#4589ff", title: "Campaign Created", description: "Luzon Expansion campaign initialized by Admin", time: "Jan 15, 2026 · 09:00" },
  { id: "tl2", icon: "people", color: "#24a148", title: "Staff Assigned", description: "18 field operatives assigned to NCR and Region III", time: "Jan 22, 2026 · 14:30" },
  { id: "tl3", icon: "tick-circle", color: "#24a148", title: "Objective Completed", description: "Phase 1 voter registration target met (120K)", time: "Feb 10, 2026 · 11:00" },
  { id: "tl4", icon: "eye-open", color: "#f1c21b", title: "Intel Alert", description: "Anomalous sentiment drop detected in QC District 4", time: "Mar 02, 2026 · 16:45" },
  { id: "tl5", icon: "chart", color: "#a56eff", title: "Report Generated", description: "Q1 progress report auto-generated and filed", time: "Mar 15, 2026 · 08:00" },
  { id: "tl6", icon: "changes", color: "#4589ff", title: "Scope Update", description: "Region IV-A added to campaign coverage area", time: "Mar 25, 2026 · 10:15" },
];

function CampaignInfoPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Callout intent={Intent.PRIMARY} icon="info-sign" title="Active Campaign">
        This campaign is currently in its execution phase. All modifications are tracked in the audit log.
      </Callout>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormGroup label="Campaign Name" style={{ margin: 0 }}>
          <InputGroup value="Luzon Expansion 2026" readOnly />
        </FormGroup>
        <FormGroup label="Campaign Type" style={{ margin: 0 }}>
          <InputGroup value="ELECTION" readOnly />
        </FormGroup>
        <FormGroup label="Start Date" style={{ margin: 0 }}>
          <InputGroup value="January 15, 2026" readOnly leftIcon="calendar" />
        </FormGroup>
        <FormGroup label="End Date" style={{ margin: 0 }}>
          <InputGroup value="June 30, 2026" readOnly leftIcon="calendar" />
        </FormGroup>
      </div>

      <FormGroup label="Description" style={{ margin: 0 }}>
        <TextArea
          fill
          readOnly
          value="Strategic voter outreach expansion across Luzon provinces targeting 500K new voter contacts. Focus on Region III and IV-A with satellite operations in NCR."
          rows={3}
        />
      </FormGroup>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Switch label="Auto-generate reports" checked readOnly />
        <Switch label="Intel alerts enabled" checked readOnly />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>Tags:</span>
        <Tag minimal intent={Intent.PRIMARY}>Luzon</Tag>
        <Tag minimal intent={Intent.SUCCESS}>Election</Tag>
        <Tag minimal>High Priority</Tag>
        <Tag minimal intent={Intent.WARNING}>Q1-Q2</Tag>
      </div>
    </div>
  );
}

function StaffMiniPanel() {
  const staff = [
    { name: "Maria Santos", role: "Political Officer", area: "NCR", status: "Active" },
    { name: "Juan Reyes", role: "Field Volunteer", area: "Region VII", status: "Active" },
    { name: "Ana Cruz", role: "Full-time Staff", area: "NCR", status: "Active" },
    { name: "Carlos Tan", role: "Contractor", area: "Region XI", status: "Active" },
    { name: "Sofia Luna", role: "Political Officer", area: "NCR", status: "On Leave" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {staff.map((s) => (
        <div key={s.name} className="stat-row">
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
            <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>{s.role} · {s.area}</div>
          </div>
          <Tag minimal intent={s.status === "Active" ? Intent.SUCCESS : Intent.WARNING} className={Classes.TEXT_SMALL}>
            {s.status}
          </Tag>
        </div>
      ))}
    </div>
  );
}

export default function CampaignDetailScreen() {
  const cfg = CAMPAIGN_DETAIL;

  return (
    <ScreenLayout
      id={cfg.id}
      name={cfg.name}
      description={cfg.description}
      actions={<Button icon="edit" text="Edit Campaign" />}
    >
      <Panel id={cfg.panels[0].id} name={cfg.panels[0].name} size={cfg.panels[0].size}>
        <CampaignInfoPanel />
      </Panel>

      <Panel id={cfg.panels[1].id} name={cfg.panels[1].name} size={cfg.panels[1].size}>
        <TaskList tasks={tasks} />
      </Panel>

      <Panel id={cfg.panels[2].id} name={cfg.panels[2].name} size={cfg.panels[2].size}>
        <StaffMiniPanel />
      </Panel>

      <Panel id={cfg.panels[3].id} name={cfg.panels[3].name} size={cfg.panels[3].size}>
        <Timeline items={timelineItems} />
      </Panel>
    </ScreenLayout>
  );
}
