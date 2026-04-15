import { Menu, MenuItem, MenuDivider, Icon } from "@blueprintjs/core";
import { useNavigate, useLocation } from "react-router";
import { useApp } from "../context/useApp";

interface NavItem {
  icon: string;
  text: string;
  path: string;
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
      { icon: "clipboard", text: "Kanban Board", path: "/boards" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: "office", text: "Offices", path: "/offices" },
      { icon: "box", text: "Resources", path: "/resources" },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: "people", text: "Teams Directory", path: "/teams" },
    ],
  },
  {
    label: "Accounts Demo",
    items: [
      { icon: "people", text: "Community Leaders (Demo)", path: "/campaigns/101/leaders" },
      { icon: "office", text: "Customer Accounts (Demo)", path: "/campaigns/202/accounts" },
    ],
  },
  {
    label: "Reports",
    items: [
      { icon: "document", text: "Field Ops Report", path: "/report/field-ops" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useApp();

  return (
    <aside className={`vantage-sidebar${sidebarCollapsed ? " collapsed" : ""}`}>
      {!sidebarCollapsed ? (
        <Menu large={false} style={{ background: "transparent", padding: "4px 0" }}>
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map((item) => (
                <MenuItem
                  key={item.path}
                  icon={item.icon as never}
                  text={item.text}
                  active={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                />
              ))}
              <MenuDivider />
            </div>
          ))}
        </Menu>
      ) : (
        <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          {SECTIONS.flatMap((s) => s.items).map((item) => (
            <Icon
              key={item.path}
              icon={item.icon as never}
              size={16}
              style={{
                padding: 8,
                cursor: "pointer",
                borderRadius: 0,
                background: location.pathname === item.path ? "var(--cds-active-ui)" : undefined,
                color: location.pathname === item.path ? "var(--cds-interactive)" : undefined,
              }}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
