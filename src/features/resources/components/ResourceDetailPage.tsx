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
  Tag,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { useResource } from "../hooks/useResource";
import { useResourceMutations } from "../hooks/useResourceMutations";
import { useResourceAssignmentMutations } from "../hooks/useResourceAssignmentMutations";
import { ResourceStatusTag } from "./ResourceStatusTag";
import { ResourceTypeBadge } from "./ResourceTypeBadge";
import { ResourceConditionTag } from "./ResourceConditionTag";
import { ResourceSpecsPanel } from "./ResourceSpecsPanel";
import { ResourceAssignmentHistory } from "./ResourceAssignmentHistory";
import { ResourceEditDrawer } from "./ResourceEditDrawer";
import { AssignResourceDialog } from "./AssignResourceDialog";
import { ReassignResourceDialog } from "./ReassignResourceDialog";
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

function formatCurrency(value: number | null): string {
  if (value == null) return "—";
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { resource, loading, error, refetch } = useResource(id ?? "");
  const { remove, submitting: deleteSubmitting } = useResourceMutations();
  const { unassign, submitting: assignSubmitting } = useResourceAssignmentMutations(refetch);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [unassignOpen, setUnassignOpen] = useState(false);

  if (!id) {
    return (
      <NonIdealState
        icon="error"
        title="Invalid resource ID"
        action={<Button text="Back to Resources" onClick={() => navigate("/resources")} />}
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

  if (error || !resource) {
    return (
      <NonIdealState
        icon="search"
        title="Resource not found"
        description={error ?? "This resource does not exist or was deleted."}
        action={<Button text="Back to Resources" onClick={() => navigate("/resources")} />}
      />
    );
  }

  const handleDelete = async () => {
    setDeleteError(null);
    const ok = await remove(resource.id);
    if (ok) {
      const toaster = await appToaster;
      toaster.show({ message: "Resource deleted.", intent: Intent.NONE, icon: "trash" });
      navigate("/resources");
    } else {
      setDeleteError("Failed to delete resource. Please try again.");
    }
  };

  const handleUnassign = async () => {
    await unassign(resource.id, {});
    setUnassignOpen(false);
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

  const isAssigned = resource.current_assignment != null;

  return (
    <div style={{ padding: 24 }}>
      {/* Back navigation */}
      <div style={{ marginBottom: 12 }}>
        <Button
          minimal
          small
          icon="arrow-left"
          text="All Resources"
          onClick={() => navigate("/resources")}
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
              <h2 style={{ margin: 0, fontSize: 20 }}>{resource.resource_name}</h2>
              <ResourceTypeBadge type={resource.resource_type} />
              <ResourceStatusTag status={resource.status} />
              <ResourceConditionTag condition={resource.condition} />
              {resource.resource_code && (
                <code
                  className={Classes.TEXT_MUTED}
                  style={{
                    fontSize: 12,
                    background: "var(--cds-layer-02)",
                    padding: "2px 8px",
                  }}
                >
                  {resource.resource_code}
                </code>
              )}
            </div>

            {resource.brand && (
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>
                {[resource.brand, resource.model].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
            {!isAssigned && (
              <Button
                icon="office"
                intent={Intent.PRIMARY}
                text="Assign"
                onClick={() => setAssignOpen(true)}
              />
            )}
            {isAssigned && (
              <>
                <Button
                  icon="swap-horizontal"
                  text="Transfer"
                  onClick={() => setReassignOpen(true)}
                />
                <Button
                  icon="remove"
                  intent={Intent.WARNING}
                  minimal
                  text="Unassign"
                  onClick={() => setUnassignOpen(true)}
                />
              </>
            )}
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
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {resource.description && (
            <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600 }}>Description</h4>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{resource.description}</p>
            </Card>
          )}

          {Object.keys(resource.specifications).length > 0 && (
            <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Specifications</h4>
              <ResourceSpecsPanel specifications={resource.specifications} />
            </Card>
          )}

          {(resource.brand || resource.model || resource.serial_number) && (
            <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Asset Details</h4>
              {resource.brand && (
                <>
                  <div style={metaLabelStyle}>Brand</div>
                  <div style={metaValueStyle}>{resource.brand}</div>
                </>
              )}
              {resource.model && (
                <>
                  <div style={metaLabelStyle}>Model</div>
                  <div style={metaValueStyle}>{resource.model}</div>
                </>
              )}
              {resource.serial_number && (
                <>
                  <div style={metaLabelStyle}>Serial Number</div>
                  <div style={metaValueStyle}>
                    <code style={{ fontSize: 12 }}>{resource.serial_number}</code>
                  </div>
                </>
              )}
            </Card>
          )}

          {(resource.last_maintenance_date ||
            resource.next_maintenance_date ||
            resource.maintenance_notes) && (
            <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Maintenance</h4>
              {resource.last_maintenance_date && (
                <>
                  <div style={metaLabelStyle}>Last Maintenance</div>
                  <div style={metaValueStyle}>{formatDate(resource.last_maintenance_date)}</div>
                </>
              )}
              {resource.next_maintenance_date && (
                <>
                  <div style={metaLabelStyle}>Next Maintenance</div>
                  <div style={metaValueStyle}>{formatDate(resource.next_maintenance_date)}</div>
                </>
              )}
              {resource.maintenance_notes && (
                <>
                  <div style={metaLabelStyle}>Maintenance Notes</div>
                  <div style={{ ...metaValueStyle, whiteSpace: "pre-wrap" }}>
                    {resource.maintenance_notes}
                  </div>
                </>
              )}
            </Card>
          )}

          {resource.tags.length > 0 && (
            <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600 }}>Tags</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {resource.tags.map((t) => (
                  <Tag key={t} minimal>
                    {t}
                  </Tag>
                ))}
              </div>
            </Card>
          )}

          {/* Assignment history */}
          <Card elevation={Elevation.ONE} style={{ marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>
              Assignment History
            </h4>
            <ResourceAssignmentHistory resourceId={resource.id} />
          </Card>
        </div>

        {/* Right sidebar */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <Card elevation={Elevation.ONE} style={{ padding: 16 }}>
            {/* Current assignment */}
            <div style={metaLabelStyle}>Current Assignment</div>
            <div style={metaValueStyle}>
              {isAssigned ? (
                <a
                  href={`/offices/${resource.current_assignment!.office_id}`}
                  style={{ color: "var(--cds-link-01)", textDecoration: "none", fontSize: 13 }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/offices/${resource.current_assignment!.office_id}`);
                  }}
                >
                  {resource.current_assignment!.office_name}
                </a>
              ) : (
                <span className={Classes.TEXT_MUTED}>Unassigned</span>
              )}
            </div>

            {/* Financial info */}
            <div style={metaLabelStyle}>Acquisition Cost</div>
            <div style={metaValueStyle}>{formatCurrency(resource.acquisition_cost)}</div>

            <div style={metaLabelStyle}>Current Value</div>
            <div style={metaValueStyle}>{formatCurrency(resource.current_value)}</div>

            {resource.acquisition_date && (
              <>
                <div style={metaLabelStyle}>Acquired</div>
                <div style={metaValueStyle}>{formatDate(resource.acquisition_date)}</div>
              </>
            )}

            {resource.warranty_expiry && (
              <>
                <div style={metaLabelStyle}>Warranty Expiry</div>
                <div style={metaValueStyle}>{formatDate(resource.warranty_expiry)}</div>
              </>
            )}

            {/* GPS */}
            {resource.latitude != null && resource.longitude != null && (
              <>
                <div style={metaLabelStyle}>GPS Coordinates</div>
                <div style={metaValueStyle}>
                  <code style={{ fontSize: 11 }}>
                    {resource.latitude.toFixed(6)}, {resource.longitude.toFixed(6)}
                  </code>
                  {resource.last_location_update && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--cds-text-secondary, #525252)",
                        marginTop: 2,
                      }}
                    >
                      Updated {formatDate(resource.last_location_update)}
                    </div>
                  )}
                </div>
              </>
            )}

            <div style={metaLabelStyle}>Classification</div>
            <div style={metaValueStyle}>
              <Tag minimal>{resource.data_classification}</Tag>
            </div>

            <div style={metaLabelStyle}>Created</div>
            <div style={metaValueStyle}>{formatDate(resource.created_at)}</div>

            {resource.updated_at && (
              <>
                <div style={metaLabelStyle}>Last Updated</div>
                <div style={metaValueStyle}>{formatDate(resource.updated_at)}</div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Edit drawer */}
      {editOpen && (
        <ResourceEditDrawer
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={refetch}
          resource={resource}
        />
      )}

      {/* Assign dialog */}
      <AssignResourceDialog
        isOpen={assignOpen}
        resourceId={resource.id}
        onClose={() => setAssignOpen(false)}
        onAssigned={() => {
          setAssignOpen(false);
          refetch();
        }}
      />

      {/* Reassign dialog */}
      {isAssigned && (
        <ReassignResourceDialog
          isOpen={reassignOpen}
          resourceId={resource.id}
          currentOffice={resource.current_assignment!}
          onClose={() => setReassignOpen(false)}
          onReassigned={() => {
            setReassignOpen(false);
            refetch();
          }}
        />
      )}

      {/* Unassign confirmation */}
      <Alert
        isOpen={unassignOpen}
        onClose={() => setUnassignOpen(false)}
        onConfirm={handleUnassign}
        intent={Intent.WARNING}
        icon="remove"
        confirmButtonText="Unassign"
        cancelButtonText="Cancel"
        loading={assignSubmitting}
      >
        <p>
          Unassign <strong>{resource.resource_name}</strong> from{" "}
          <strong>{resource.current_assignment?.office_name}</strong>?
        </p>
      </Alert>

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
        confirmButtonText="Dispose"
        cancelButtonText="Cancel"
        loading={deleteSubmitting}
      >
        <p>
          Dispose of resource <strong>{resource.resource_name}</strong>? The resource will be marked
          as disposed and can no longer be assigned.
        </p>
      </Alert>
    </div>
  );
}
