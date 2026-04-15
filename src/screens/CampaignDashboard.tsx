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

const kpiData = [
  { label: "Total Voters Reached", value: "1.24M", delta: "+12.3% vs last month", deltaPositive: true, icon: "people", intent: Intent.PRIMARY },
  { label: "Active Campaigns", value: "7", delta: "+2 this quarter", deltaPositive: true, icon: "flag", intent: Intent.SUCCESS },
  { label: "Field Operatives", value: "342", delta: "+18 deployed", deltaPositive: true, icon: "walk", intent: Intent.WARNING },
  { label: "Avg Sentiment Score", value: "72.4", delta: "-1.2 pts", deltaPositive: false, icon: "heart", intent: Intent.DANGER },
  { label: "Tasks Completed", value: "1,847", delta: "+156 this week", deltaPositive: true, icon: "tick-circle", intent: Intent.SUCCESS },
  { label: "Intel Reports Filed", value: "489", delta: "+34 today", deltaPositive: true, icon: "eye-open", intent: Intent.PRIMARY },
];

const regionData = [
  { label: "NCR", value: 284000 },
  { label: "Region III", value: 198000 },
  { label: "Region IV-A", value: 176000 },
  { label: "Region VII", value: 142000 },
  { label: "Region XI", value: 118000 },
  { label: "Region VI", value: 95000 },
  { label: "Region I", value: 87000 },
  { label: "Region X", value: 72000 },
];

const statusSegments = [
  { label: "Active", value: 4, color: "#24a148" },
  { label: "Planning", value: 2, color: "#f1c21b" },
  { label: "Completed", value: 1, color: "#4589ff" },
];

interface TaskRow {
  id: string;
  campaign: string;
  objective: string;
  assignee: string;
  status: string;
  progress: number;
  dueDate: string;
}

const taskRows: TaskRow[] = [
  { id: "TSK-001", campaign: "Luzon Expansion", objective: "Voter Registration Drive", assignee: "M. Santos", status: "In Progress", progress: 68, dueDate: "Apr 15, 2026" },
  { id: "TSK-002", campaign: "Visayas Outreach", objective: "Community Engagement", assignee: "J. Reyes", status: "Active", progress: 42, dueDate: "Apr 22, 2026" },
  { id: "TSK-003", campaign: "NCR Operations", objective: "Sentiment Analysis", assignee: "A. Cruz", status: "Completed", progress: 100, dueDate: "Mar 28, 2026" },
  { id: "TSK-004", campaign: "Mindanao Intel", objective: "Field Intelligence", assignee: "C. Tan", status: "Planning", progress: 15, dueDate: "May 01, 2026" },
  { id: "TSK-005", campaign: "NCR Operations", objective: "Poll Deployment", assignee: "S. Luna", status: "In Progress", progress: 81, dueDate: "Apr 10, 2026" },
  { id: "TSK-006", campaign: "Luzon Expansion", objective: "Staff Recruitment", assignee: "D. Ramos", status: "Active", progress: 55, dueDate: "Apr 30, 2026" },
  { id: "TSK-007", campaign: "Visayas Outreach", objective: "Intel Consolidation", assignee: "M. Santos", status: "Overdue", progress: 23, dueDate: "Mar 20, 2026" },
];

const taskColumns = [
  { key: "id", header: "ID", render: (r: TaskRow) => <code>{r.id}</code> },
  { key: "campaign", header: "Campaign", render: (r: TaskRow) => r.campaign },
  { key: "objective", header: "Objective", render: (r: TaskRow) => r.objective },
  { key: "assignee", header: "Assignee", render: (r: TaskRow) => r.assignee },
  { key: "status", header: "Status", render: (r: TaskRow) => <StatusTag status={r.status} /> },
  { key: "progress", header: "Progress", render: (r: TaskRow) => <ProgressCell value={r.progress} /> },
  { key: "dueDate", header: "Due Date", render: (r: TaskRow) => r.dueDate },
];

export default function CampaignDashboardScreen() {
  const cfg = CAMPAIGN_DASHBOARD;

  const handleSave = () => {
    /* Mock save — would POST to /api/dashboards/{id}/layout */
  };

  return (
    <ScreenLayout id={cfg.id} name={cfg.name} description={cfg.description} onSave={handleSave}>
      {cfg.panels.slice(0, 6).map((p, i) => (
        <Panel key={p.id} id={p.id} name={p.name} size={p.size}>
          <KpiCard {...kpiData[i]} />
        </Panel>
      ))}

      <Panel id={cfg.panels[6].id} name={cfg.panels[6].name} size={cfg.panels[6].size}>
        <BarChart data={regionData} />
      </Panel>

      <Panel id={cfg.panels[7].id} name={cfg.panels[7].name} size={cfg.panels[7].size}>
        <DonutChart segments={statusSegments} centerLabel="7" />
      </Panel>

      <Panel id={cfg.panels[8].id} name={cfg.panels[8].name} size={cfg.panels[8].size}>
        <Feed items={feedItems} commentsMap={feedCommentsMap} />
      </Panel>

      <Panel id={cfg.panels[9].id} name={cfg.panels[9].name} size={cfg.panels[9].size}>
        <DataTable columns={taskColumns} data={taskRows} />
      </Panel>
    </ScreenLayout>
  );
}
