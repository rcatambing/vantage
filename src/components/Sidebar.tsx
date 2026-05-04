import { Menu, MenuItem, MenuDivider, Icon } from "@blueprintjs/core";
import { useNavigate, useLocation, useParams } from "react-router";
import { useApp } from "../context/useApp";

interface NavItem {
  icon: string;
  text: string;
  path: string;
  campaignScoped?: boolean;
}

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Dashboards",
    items: [
      { icon: "dashboard", text: "Campaign Ops", path: "/" },
    ],
  },
  {
    label: "Workbenches",
    items: [
      { icon: "people", text: "Voter Intelligence", path: "/workbench/voters" },
    ],
  },
  {
    label: "Campaigns",
    items: [
      { icon: "flag", text: "Campaigns", path: "/campaigns" },
      { icon: "clipboard", text: "Tasks", path: "/campaigns/:campaignId/tasks", campaignScoped: true },
      { icon: "chart", text: "Intelligence", path: "/campaigns/:campaignId/intelligence", campaignScoped: true },
    ],
  },
  {
    label: "Tickets",
    items: [
      { icon: "issue", text: "Tickets", path: "/tickets" },
    ],
  },
  {
    label: "Boards",
    items: [
      { icon: "panel-table", text: "Kanban Board", path: "/boards" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: "office", text: "Offices", path: "/offices" },
      { icon: "box", text: "Resources", path: "/resources" },
      { icon: "map", text: "Districts", path: "/districts" },
      { icon: "calendar", text: "Calendar", path: "/campaigns/:campaignId/calendar", campaignScoped: true },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: "people", text: "Teams Directory", path: "/teams" },
      { icon: "notifications", text: "Notifications", path: "/notifications" },
    ],
  },
  {
    label: "Accounts Demo",
    items: [
      { icon: "people", text: "Community Leaders (Demo)", path: "/campaigns/1/leaders" },
      { icon: "office", text: "Customer Accounts (Demo)", path: "/campaigns/2/accounts" },
    ],
  },
  {
    label: "Reports",
    items: [
      { icon: "document", text: "Field Ops Report", path: "/report/field-ops" },
    ],
  },
  {
    label: "Administration",
    items: [
      { icon: "cog", text: "System Jobs", path: "/admin/jobs/system" },
      { icon: "chart", text: "Metrics Jobs", path: "/admin/jobs/metrics" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { icon: "chart", text: "Analytics Demo", path: "/analytics/demo" },
    ],
  },
];

function useActiveCampaignId(): string | null {
  const params = useParams<{ campaignId?: string; id?: string }>();
  return params.campaignId ?? params.id ?? null;
}

function resolvePath(item: NavItem, campaignId: string | null): string {
  if (item.campaignScoped && campaignId) {
    return item.path.replace(":campaignId", campaignId);
  }
  return item.path;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useApp();
  const activeCampaignId = useActiveCampaignId();

  const isActive = (item: NavItem) => {
    const resolved = resolvePath(item, activeCampaignId);
    return location.pathname === resolved;
  };

  const handleClick = (item: NavItem) => {
    const resolved = resolvePath(item, activeCampaignId);
    navigate(resolved);
  };

  return (
    <aside className={`vantage-sidebar${sidebarCollapsed ? " collapsed" : ""}`}>
      {!sidebarCollapsed ? (
        <Menu large={false} style={{ background: "transparent", padding: "4px 0" }}>
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map((item) => {
                // Hide campaign-scoped items when no campaign is selected
                if (item.campaignScoped && !activeCampaignId) return null;
                return (
                  <MenuItem
                    key={item.path}
                    icon={item.icon as never}
                    text={item.text}
                    active={isActive(item)}
                    onClick={() => handleClick(item)}
                  />
                );
              })}
              <MenuDivider />
            </div>
          ))}
        </Menu>
      ) : (
        <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          {SECTIONS.flatMap((s) => s.items).map((item) => {
            if (item.campaignScoped && !activeCampaignId) return null;
            return (
              <Icon
                key={item.path}
                icon={item.icon as never}
                size={16}
                style={{
                  padding: 8,
                  cursor: "pointer",
                  borderRadius: 0,
                  background: isActive(item) ? "var(--cds-active-ui)" : undefined,
                  color: isActive(item) ? "var(--cds-interactive)" : undefined,
                }}
                onClick={() => handleClick(item)}
              />
            );
          })}
        </div>
      )}
    </aside>
  );
}
