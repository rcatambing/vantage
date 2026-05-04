import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Spinner,
  NonIdealState,
  Button,
  Tabs,
  Tab,
  Classes,
  HTMLTable,
} from "@blueprintjs/core";
import { useDistrict, useDistrictAncestors, useDistrictMutations } from "../hooks/useDistricts";
import { getDistrictChildren } from "../api/districtApi";
import DistrictBreadcrumb from "./DistrictBreadcrumb";
import DistrictTypeTag from "./DistrictTypeTag";
import DistrictStatsPanel from "./DistrictStatsPanel";
import DistrictEditForm from "./DistrictEditForm";
import type { District } from "../types";

export default function DistrictDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: district, loading, error, refetch } = useDistrict(id);
  const { data: ancestors } = useDistrictAncestors(id);
  const { update, loading: saving } = useDistrictMutations();
  const [activeTab, setActiveTab] = useState<"overview" | "statistics" | "children" | "history">("overview");
  const [children, setChildren] = useState<District[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadChildren = async () => {
    if (!id) return;
    setChildrenLoading(true);
    try {
      const res = await getDistrictChildren(id);
      setChildren(res);
    } catch {
      setChildren([]);
    } finally {
      setChildrenLoading(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    const tab = tabId as typeof activeTab;
    setActiveTab(tab);
    if (tab === "children") {
      loadChildren();
    }
  };

  const handleSave = async (districtId: string, payload: Parameters<typeof update>[1]) => {
    await update(districtId, payload);
    setIsEditing(false);
    refetch();
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !district) {
    return (
      <div style={{ padding: 24 }}>
        <NonIdealState
          icon="error"
          title="District not found"
          description={error ?? "The requested district could not be loaded."}
          action={
            <Button intent="primary" icon="refresh" onClick={refetch}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <DistrictBreadcrumb ancestors={ancestors ?? []} currentName={district.name} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>{district.name}</h1>
        <DistrictTypeTag type={district.district_type} />
        <code
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            background: "var(--cds-layer-02)",
            padding: "2px 8px",
            letterSpacing: 0.5,
          }}
        >
          {district.district_code}
        </code>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button
            icon="edit"
            minimal
            onClick={() => setIsEditing((v) => !v)}
            active={isEditing}
            aria-label="Edit district"
          >
            Edit
          </Button>
          <Button icon="arrow-left" minimal onClick={() => navigate("/districts")}>
            Back
          </Button>
        </div>
      </div>

      <Tabs selectedTabId={activeTab} onChange={handleTabChange}>
        <Tab id="overview" title="Overview" panel={
          <div style={{ padding: "16px 0" }}>
            {isEditing ? (
              <DistrictEditForm district={district} onSave={handleSave} saving={saving} />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                <InfoCard label="Region" value={district.region} />
                <InfoCard label="Code" value={district.district_code} />
                <InfoCard label="Type" value={district.district_type} />
                <InfoCard
                  label="Parent"
                  value={district.parent_name ?? district.parent_district_id ?? "None"}
                />
                <InfoCard
                  label="Population"
                  value={district.population?.toLocaleString() ?? "—"}
                />
                <InfoCard
                  label="Registered Voters"
                  value={district.registered_voters?.toLocaleString() ?? "—"}
                />
              </div>
            )}
          </div>
        } />

        <Tab
          id="statistics"
          title="Statistics"
          panel={
            <div style={{ padding: "16px 0" }}>
              {district.statistics ? (
                <DistrictStatsPanel stats={district.statistics} />
              ) : (
                <NonIdealState
                  icon="chart"
                  title="No statistics available"
                  description="Statistics have not been computed for this district yet."
                />
              )}
            </div>
          }
        />

        <Tab
          id="children"
          title="Children"
          panel={
            <div style={{ padding: "16px 0" }}>
              {childrenLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                  <Spinner size={24} />
                </div>
              ) : children.length === 0 ? (
                <NonIdealState
                  icon="map-marker"
                  title="No child districts"
                  description="This district has no subordinate districts."
                />
              ) : (
                <HTMLTable compact striped style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Population</th>
                      <th>Voters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((child) => (
                      <tr
                        key={child.id}
                        onClick={() => navigate(`/districts/${child.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <td><code>{child.district_code}</code></td>
                        <td><strong>{child.name}</strong></td>
                        <td><DistrictTypeTag type={child.district_type} /></td>
                        <td>{child.population?.toLocaleString() ?? "—"}</td>
                        <td>{child.registered_voters?.toLocaleString() ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </HTMLTable>
              )}
            </div>
          }
        />

        <Tab
          id="history"
          title="History"
          panel={
            <div style={{ padding: "16px 0" }}>
              <NonIdealState
                icon="history"
                title="History"
                description="Audit trail and change history will appear here."
              />
            </div>
          }
        />
      </Tabs>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--cds-layer-01)",
        border: "1px solid var(--cds-border-subtle)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 500 }}>{value}</div>
    </div>
  );
}
