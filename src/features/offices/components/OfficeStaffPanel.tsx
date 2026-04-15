import { useState } from "react";
import {
  Alert,
  Button,
  Callout,
  HTMLTable,
  Intent,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";
import { useOfficeStaff } from "../hooks/useOfficeStaff";
import { useOfficeStaffMutations } from "../hooks/useOfficeStaffMutations";
import { AssignStaffDialog } from "./AssignStaffDialog";
import type { OfficeStaffAssignment } from "../types";
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

interface Props {
  officeId: string;
}

export function OfficeStaffPanel({ officeId }: Props) {
  const { staff, loading, error, refetch } = useOfficeStaff(officeId);
  const mutations = useOfficeStaffMutations(refetch);

  const [assignOpen, setAssignOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<OfficeStaffAssignment | null>(null);
  const [editTarget, setEditTarget] = useState<OfficeStaffAssignment | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error" title="Failed to load staff">
        {error}
      </Callout>
    );
  }

  async function handleRemove() {
    if (!removeTarget) return;
    const ok = await mutations.remove(officeId, removeTarget.user_id);
    if (ok) {
      const toaster = await appToaster;
      toaster.show({ message: "Staff member removed.", intent: Intent.NONE, icon: "trash" });
    }
    setRemoveTarget(null);
  }

  async function handleEditRole() {
    if (!editTarget) return;
    setEditSubmitting(true);
    const result = await mutations.updateRole(officeId, editTarget.user_id, {
      role: editRole.trim() || undefined,
    });
    setEditSubmitting(false);
    if (result) {
      const toaster = await appToaster;
      toaster.show({ message: "Role updated.", intent: Intent.SUCCESS, icon: "tick" });
      setEditTarget(null);
    }
  }

  const activeStaff = staff.filter((s) => !s.removed_at);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13 }}>
          Staff ({activeStaff.length})
        </span>
        <Button small icon="person" text="Assign Staff" onClick={() => setAssignOpen(true)} />
      </div>

      {activeStaff.length === 0 ? (
        <NonIdealState
          icon="people"
          title="No staff assigned"
          description="Assign staff members to this office."
        />
      ) : (
        <HTMLTable striped bordered style={{ width: "100%", fontSize: 12 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Assigned</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeStaff.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.user_name}</td>
                <td style={{ color: "var(--cds-text-secondary, #525252)" }}>
                  {s.role ?? "—"}
                </td>
                <td>{formatDate(s.assigned_at)}</td>
                <td style={{ textAlign: "right" }}>
                  <Button
                    small
                    minimal
                    icon="edit"
                    onClick={() => {
                      setEditTarget(s);
                      setEditRole(s.role ?? "");
                    }}
                    style={{ marginRight: 4 }}
                  />
                  <Button
                    small
                    minimal
                    icon="trash"
                    intent={Intent.DANGER}
                    onClick={() => setRemoveTarget(s)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      <AssignStaffDialog
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        officeId={officeId}
        onAssigned={() => {
          setAssignOpen(false);
          refetch();
        }}
      />

      {/* Edit role inline alert */}
      <Alert
        isOpen={editTarget != null}
        onClose={() => setEditTarget(null)}
        onConfirm={handleEditRole}
        intent={Intent.PRIMARY}
        icon="edit"
        confirmButtonText="Save"
        cancelButtonText="Cancel"
        loading={editSubmitting}
      >
        <p style={{ marginBottom: 8 }}>
          Update role for <strong>{editTarget?.user_name}</strong>:
        </p>
        <input
          className="bp5-input"
          value={editRole}
          onChange={(e) => setEditRole(e.target.value)}
          placeholder="Role (optional)"
          style={{ width: "100%" }}
        />
      </Alert>

      {/* Remove confirmation */}
      <Alert
        isOpen={removeTarget != null}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        intent={Intent.DANGER}
        icon="person"
        confirmButtonText="Remove"
        cancelButtonText="Cancel"
        loading={mutations.submitting}
      >
        <p>
          Remove <strong>{removeTarget?.user_name}</strong> from this office?
        </p>
      </Alert>
    </div>
  );
}
