import type { ScreenConfig } from "../types";

/* ── Campaign Operations Dashboard ── */
export const CAMPAIGN_DASHBOARD: ScreenConfig = {
  id: "DSH001",
  name: "Campaign Operations Dashboard",
  description: "Real-time overview of active campaigns, voter engagement, and field operations across all regions.",
  panels: [
    { id: "PNL0001", name: "Total Voters Reached", size: "small", component: "KpiCard" },
    { id: "PNL0002", name: "Active Campaigns", size: "small", component: "KpiCard" },
    { id: "PNL0003", name: "Field Operatives", size: "small", component: "KpiCard" },
    { id: "PNL0004", name: "Avg Sentiment Score", size: "small", component: "KpiCard" },
    { id: "PNL0005", name: "Tasks Completed", size: "small", component: "KpiCard" },
    { id: "PNL0006", name: "Intel Reports Filed", size: "small", component: "KpiCard" },
    { id: "PNL0007", name: "Voter Outreach by Region", size: "large", component: "BarChart" },
    { id: "PNL0008", name: "Campaign Status Breakdown", size: "medium", component: "DonutChart" },
    { id: "PNL0009", name: "Recent Activity", size: "medium", component: "ActivityFeed" },
    { id: "PNL0010", name: "Task Progress Overview", size: "wide-large", component: "DataTable" },
  ],
};

/* ── Voter Intelligence Workbench ── */
export const VOTER_WORKBENCH: ScreenConfig = {
  id: "WRB001",
  name: "Voter Intelligence Workbench",
  description: "Analyze voter demographics, sentiment trends, and geographic distribution for targeted outreach planning.",
  panels: [
    { id: "PNL0011", name: "Total Registered Voters", size: "small", component: "KpiCard" },
    { id: "PNL0012", name: "Sentiment Index", size: "small", component: "KpiCard" },
    { id: "PNL0013", name: "Coverage Rate", size: "small", component: "KpiCard" },
    { id: "PNL0014", name: "Voter Demographics", size: "large", component: "VoterDemographics" },
    { id: "PNL0015", name: "Geographic Distribution", size: "wide-medium", component: "MapView" },
    { id: "PNL0016", name: "Voter Registry", size: "wide-large", component: "VoterTable" },
    { id: "PNL0017", name: "Sentiment Trend", size: "medium", component: "BarChart" },
  ],
};

/* ── Campaign Detail ── */
export const CAMPAIGN_DETAIL: ScreenConfig = {
  id: "DTL001",
  name: "Campaign Detail",
  description: "Detailed configuration and status of a single campaign, including objectives, tasks, and staffing.",
  panels: [
    { id: "PNL0018", name: "Campaign Info", size: "wide-medium", component: "CampaignInfo" },
    { id: "PNL0019", name: "Objectives & Tasks", size: "large", component: "TaskList" },
    { id: "PNL0020", name: "Assigned Staff", size: "medium", component: "StaffMini" },
    { id: "PNL0021", name: "Activity Timeline", size: "medium", component: "Timeline" },
  ],
};

/* ── Field Operations Report ── */
export const FIELD_OPS_REPORT: ScreenConfig = {
  id: "RPT001",
  name: "Field Operations Report",
  description: "Summary and analytical report of field operations, intel collection, and staff performance metrics.",
  panels: [
    { id: "PNL0022", name: "Operations Summary", size: "wide-medium", component: "ReportSummary" },
    { id: "PNL0023", name: "Intel Collection by Type", size: "medium", component: "DonutChart" },
    { id: "PNL0024", name: "Staff Performance", size: "medium", component: "StaffPerformance" },
    { id: "PNL0025", name: "Regional Breakdown", size: "wide-large", component: "RegionTable" },
    { id: "PNL0026", name: "Poll Results Summary", size: "large", component: "PollResults" },
    { id: "PNL0027", name: "Monthly Trend", size: "medium", component: "BarChart" },
  ],
};
