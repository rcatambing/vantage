import { useState } from "react";
import {
  Alert,
  Button,
  Callout,
  Card,
  Classes,
  Elevation,
  Intent,
  NonIdealState,
  Spinner,
  Tab,
  Tabs,
  Tag,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { useOffice } from "../hooks/useOffice";
import { useOfficeMutations } from "../hooks/useOfficeMutations";
import { OfficeStatusTag } from "./OfficeStatusTag";
import { OfficeTypeBadge } from "./OfficeTypeBadge";
import { OfficeAddress } from "./OfficeAddress";
import { DescriptionRenderer } from "./DescriptionRenderer";
import { CapabilitiesTagInput } from "./CapabilitiesTagInput";
import { OfficeContactsPanel } from "./OfficeContactsPanel";
import { CampaignLinksPanel } from "./CampaignLinksPanel";
import { OfficeStaffPanel } from "./OfficeStaffPanel";
import { OfficeResourcesPanel } from "./OfficeResourcesPanel";
import { OfficeEditDrawer } from "./OfficeEditDrawer";
import { appToaster } from "../../../toaster";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function OfficeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { office, loading, error, refetch } = useOffice(id ?? "");
  const { remove, submitting: deleteSubmitting } = useOfficeMutations();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  if (!id) {
    return (
      <NonIdealState
        icon="error"
        title="Invalid office ID"
        action={<Button text="Back to Offices" onClick={() => navigate("/offices")} />}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !office) {
    return (
      <NonIdealState
        icon="search"
        title="Office not found"
        description={error ?? "This office does not exist or was deleted."}
        action={<Button text="Back to Offices" onClick={() => navigate("/offices")} />}
      />
    );
  }

  const handleDelete = async () => {
    setDeleteError(null);
    const ok = await remove(office.id);
    if (ok) {
      const toaster = await appToaster;
      toaster.show({ message: "Office deleted.", intent: Intent.NONE, icon: "trash" });
      navigate("/offices");
    } else {
      setDeleteError("Failed to delete office. Please try again.");
    }
  };

  const metaLabelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--cds-text-secondary, #525252)",
    marginBottom: 2,
  };

  const metaValueStyle: React.CSSProperties = {
    fontSize: 13,
    marginBottom: 12,
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Back navigation */}
      <div style={{ marginBottom: 12 }}>
        <Button
          minimal
          small
          icon="arrow-left"
          text="All Offices"
          onClick={() => navigate("/offices")}
        />
      </div>

      {/* Header card */}
      <Card elevation={Elevation.TWO} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20 }}>{office.office_name}</h2>
              <OfficeTypeBadge type={office.office_type} />
              <OfficeStatusTag status={office.status} />
              {office.office_code && (
                <code
                  className={Classes.TEXT_MUTED}
                  style={{
                    fontSize: 12,
                    background: "var(--cds-layer-02)",
                    padding: "2px 8px",
                  }}
                >
                  {office.office_code}
                </code>
              )}
            </div>

            <div className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>
              {[office.city_municipality, office.province].filter(Boolean).join(", ") || "No location set"}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Button icon="edit" text="Edit" onClick={() => setEditOpen(true)} />
            <Button
              icon="trash"
              intent={Intent.DANGER}
              minimal
              onClick={() => setDeleteOpen(true)}
            />
          </div>
        </div>
      </Card>

      {/* Main content + sidebar */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Tabs (main content) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Tabs
            id="office-detail-tabs"
            selectedTabId={activeTab}
            onChange={(id) => setActiveTab(String(id))}
          >
            <Tab
              id="overview"
              title="Overview"
              panel={
                <div style={{ paddingTop: 16 }}>
                  <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600 }}>Description</h4>
                    <DescriptionRenderer description={office.description} />
                  </Card>

                  <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600 }}>Capabilities</h4>
                    <CapabilitiesTagInput values={office.capabilities} readOnly />
                  </Card>

                  <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Address</h4>
                    <OfficeAddress
                      street_address={office.street_address}
                      barangay={office.barangay}
                      city_municipality={office.city_municipality}
                      province={office.province}
                      zip_code={office.zip_code}
                    />
                    {office.operating_hours && (
                      <div style={{ marginTop: 8, fontSize: 13 }}>
                        <span className={Classes.TEXT_MUTED}>Hours: </span>
                        {office.operating_hours}
                      </div>
                    )}
                    {office.capacity != null && (
                      <div style={{ marginTop: 4, fontSize: 13 }}>
                        <span className={Classes.TEXT_MUTED}>Capacity: </span>
                        {office.capacity}
                      </div>
                    )}
                  </Card>

                  <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
                    <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Contacts</h4>
                    <OfficeContactsPanel officeId={office.id} />
                  </Card>

                  <Card elevation={Elevation.ONE}>
                    <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Campaigns</h4>
                    <CampaignLinksPanel officeId={office.id} />
                  </Card>
                </div>
              }
            />
            <Tab
              id="staff"
              title={`Staff (${office.staff_count})`}
              panel={
                <div style={{ paddingTop: 16 }}>
                  <OfficeStaffPanel officeId={office.id} />
                </div>
              }
            />
            <Tab
              id="resources"
              title={`Resources (${office.resource_count})`}
              panel={
                <div style={{ paddingTop: 16 }}>
                  <OfficeResourcesPanel officeId={office.id} />
                </div>
              }
            />
          </Tabs>
        </div>

        {/* Sidebar */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <Card elevation={Elevation.ONE} style={{ padding: 16 }}>
            {office.manager_name && (
              <>
                <div style={metaLabelStyle}>Manager</div>
                <div style={metaValueStyle}>{office.manager_name}</div>
              </>
            )}

            {office.district_name && (
              <>
                <div style={metaLabelStyle}>District</div>
                <div style={metaValueStyle}>{office.district_name}</div>
              </>
            )}

            <div style={metaLabelStyle}>Staff</div>
            <div style={metaValueStyle}>
              <Tag minimal>{office.staff_count} members</Tag>
            </div>

            <div style={metaLabelStyle}>Resources</div>
            <div style={metaValueStyle}>
              <Tag minimal>{office.resource_count} items</Tag>
            </div>

            <div style={metaLabelStyle}>Campaigns</div>
            <div style={metaValueStyle}>
              <Tag minimal>{office.campaign_count} linked</Tag>
            </div>

            {office.opened_date && (
              <>
                <div style={metaLabelStyle}>Opened</div>
                <div style={metaValueStyle}>{formatDate(office.opened_date)}</div>
              </>
            )}

            {office.closed_date && (
              <>
                <div style={metaLabelStyle}>Closed</div>
                <div style={metaValueStyle}>{formatDate(office.closed_date)}</div>
              </>
            )}

            <div style={metaLabelStyle}>Created</div>
            <div style={metaValueStyle}>{formatDate(office.created_at)}</div>

            {office.updated_at && (
              <>
                <div style={metaLabelStyle}>Last Updated</div>
                <div style={metaValueStyle}>{formatDate(office.updated_at)}</div>
              </>
            )}

            <div style={metaLabelStyle}>Classification</div>
            <div style={metaValueStyle}>
              <Tag minimal>{office.data_classification}</Tag>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit drawer */}
      {editOpen && (
        <OfficeEditDrawer
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={refetch}
          office={office}
        />
      )}

      {/* Delete confirmation */}
      {deleteError && (
        <Callout intent={Intent.DANGER} icon="error" style={{ marginTop: 16 }}>
          {deleteError}
        </Callout>
      )}
      <Alert
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        intent={Intent.DANGER}
        icon="trash"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        loading={deleteSubmitting}
      >
        <p>
          Permanently delete office <strong>{office.office_name}</strong>? This action cannot be undone.
        </p>
      </Alert>
    </div>
  );
}
