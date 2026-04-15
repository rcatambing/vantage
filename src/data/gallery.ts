import { type GalleryItem } from "../types";

export const GALLERY_ITEMS: GalleryItem[] = [
  { code: "KPI_CRD", name: "KPI Card", description: "Single metric with trend delta", group: "Metrics", icon: "trending-up", defaultSize: "small" },
  { code: "BAR_CRT", name: "Bar Chart", description: "Vertical bar chart visualization", group: "Charts", icon: "chart", defaultSize: "medium" },
  { code: "DNT_CRT", name: "Donut Chart", description: "Proportional donut ring chart", group: "Charts", icon: "doughnut-chart", defaultSize: "medium" },
  { code: "TBL_VEW", name: "Data Table", description: "Tabular data with sorting", group: "Tables", icon: "th", defaultSize: "wide-large" },
  { code: "ACT_FED", name: "Activity Feed", description: "Chronological event stream", group: "Feeds", icon: "feed", defaultSize: "medium" },
  { code: "TSK_LST", name: "Task List", description: "Actionable task checklist", group: "Management", icon: "tick-circle", defaultSize: "large" },
  { code: "MAP_VEW", name: "Map View", description: "Geographic heat-map placeholder", group: "Geo", icon: "map", defaultSize: "wide-medium" },
  { code: "TML_VEW", name: "Timeline", description: "Vertical event timeline", group: "Feeds", icon: "timeline-events", defaultSize: "medium" },
  { code: "STS_CRD", name: "Status Card", description: "Status breakdown with progress", group: "Metrics", icon: "pie-chart", defaultSize: "medium" },
  { code: "STF_TBL", name: "Staff Table", description: "Staff roster with roles", group: "Tables", icon: "people", defaultSize: "wide-large" },
  { code: "VOT_DMO", name: "Voter Demographics", description: "Demographic distribution chart", group: "Charts", icon: "person", defaultSize: "large" },
  { code: "POL_RES", name: "Poll Results", description: "Survey results summary", group: "Charts", icon: "horizontal-bar-chart", defaultSize: "large" },
  { code: "INT_FED", name: "Intel Feed", description: "Field intelligence items", group: "Feeds", icon: "eye-open", defaultSize: "large" },
  { code: "CMP_SUM", name: "Campaign Summary", description: "Campaign overview metrics", group: "Metrics", icon: "flag", defaultSize: "wide-medium" },
  { code: "FRM_WDG", name: "Form Widget", description: "Configurable input form", group: "Inputs", icon: "form", defaultSize: "medium" },
  { code: "CLT_INF", name: "Callout Info", description: "Informational callout banner", group: "System", icon: "info-sign", defaultSize: "wide-small" },
];

export const GALLERY_GROUPS = [...new Set(GALLERY_ITEMS.map((i) => i.group))];
