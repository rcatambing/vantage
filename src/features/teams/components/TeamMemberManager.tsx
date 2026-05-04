import { useState, useCallback, useMemo } from "react";
import {
  HTMLTable,
  Tag,
  Intent,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Callout,
  Alert,
  NonIdealState,
  Classes,
} from "@blueprintjs/core";
import type { TeamMember, MemberRole } from "../types";
import { addTeamMember, removeTeamMember } from "../api/teamApi";
import { appToaster } from "../../../toaster";

interface Props {
  teamId: string;
  members: TeamMember[];
  onRefetch: () => void;
}

const ROLE_OPTIONS: { value: MemberRole; label: string }[] = [
  { value: "TEAM_LEAD", label: "Team Lead" },
  { value: "MEMBER", label: "Member" },
  { value: "OBSERVER", label: "Observer" },
];

function roleIntent(role: MemberRole): Intent {
  switch (role) {
    case "TEAM_LEAD":
      return Intent.PRIMARY;
    case "MEMBER":
      return Intent.SUCCESS;
    case "OBSERVER":
      return Intent.NONE;
    default:
      return Intent.NONE;
  }
}

function formatDate(iso: string): string {
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

export default function TeamMemberManager({ teamId, members, onRefetch }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<MemberRole>("MEMBER");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [removeAlertOpen, setRemoveAlertOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{ userId: string; fullName: string } | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const leadCount = useMemo(
    () => members.filter((m) => m.role === "TEAM_LEAD").length,
    [members]
  );

  const handleAdd = useCallback(async () => {
    if (!userId.trim()) {
      setApiError("User ID is required.");
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      await addTeamMember(teamId, { user_id: userId.trim(), role });
      const toaster = await appToaster;
      toaster.show({
        message: "Member added successfully.",
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      setAddOpen(false);
      setUserId("");
      setRole("MEMBER");
      onRefetch();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  }, [teamId, userId, role, onRefetch]);

  const promptRemove = useCallback((member: TeamMember) => {
    // BR-009: Block removing the last TEAM_LEAD
    if (member.role === "TEAM_LEAD" && leadCount <= 1) {
      setApiError(
        "Cannot remove the last Team Lead. Assign another lead first."
      );
      return;
    }
    setRemoveTarget({ userId: member.user_id, fullName: member.full_name });
    setRemoveAlertOpen(true);
    setRemoveError(null);
  }, [leadCount]);

  const confirmRemove = useCallback(async () => {
    if (!removeTarget) return;
    setSubmitting(true);
    try {
      await removeTeamMember(teamId, removeTarget.userId);
      const toaster = await appToaster;
      toaster.show({
        message: "Member removed successfully.",
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      setRemoveAlertOpen(false);
      setRemoveTarget(null);
      onRefetch();
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setSubmitting(false);
    }
  }, [teamId, removeTarget, onRefetch]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
          {members.length} member{members.length !== 1 ? "s" : ""}
        </span>
        <Button
          icon="add"
          intent={Intent.PRIMARY}
          small
          onClick={() => {
            setAddOpen(true);
            setApiError(null);
          }}
        >
          Add Member
        </Button>
      </div>

      {apiError && !addOpen && (
        <Callout intent={Intent.DANGER} icon="error">{apiError}</Callout>
      )}

      {members.length === 0 ? (
        <NonIdealState
          icon="people"
          title="No members"
          description="This team has no members yet."
        />
      ) : (
        <HTMLTable
          striped
          interactive
          bordered
          compact
          style={{ width: "100%", fontSize: 13 }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Added By</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.full_name}</td>
                <td>
                  <Tag minimal intent={roleIntent(member.role)} style={{ fontSize: 11 }}>
                    {member.role.replace("_", " ")}
                  </Tag>
                </td>
                <td className={Classes.TEXT_MUTED}>{formatDate(member.joined_at)}</td>
                <td className={Classes.TEXT_MUTED}>{member.added_by ?? "—"}</td>
                <td>
                  <Button
                    icon="remove"
                    minimal
                    small
                    intent={Intent.DANGER}
                    onClick={() => promptRemove(member)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      {/* Add Member Dialog */}
      <Dialog
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setApiError(null);
        }}
        title="Add Member"
        icon="add"
        style={{ width: 400, borderRadius: 0 }}
      >
        <DialogBody>
          {apiError && (
            <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
              {apiError}
            </Callout>
          )}
          <FormGroup label="User ID" labelInfo="(required)">
            <InputGroup
              placeholder="Enter user ID…"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoFocus
              disabled={submitting}
            />
          </FormGroup>
          <FormGroup label="Role">
            <HTMLSelect
              fill
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              options={ROLE_OPTIONS}
              disabled={submitting}
            />
          </FormGroup>
        </DialogBody>
        <DialogFooter
          actions={
            <>
              <Button
                text="Cancel"
                onClick={() => {
                  setAddOpen(false);
                  setApiError(null);
                }}
                disabled={submitting}
              />
              <Button
                intent={Intent.PRIMARY}
                icon="add"
                text="Add Member"
                loading={submitting}
                onClick={() => void handleAdd()}
              />
            </>
          }
        />
      </Dialog>

      {/* Remove Confirmation Alert */}
      <Alert
        isOpen={removeAlertOpen}
        onConfirm={() => void confirmRemove()}
        onCancel={() => {
          setRemoveAlertOpen(false);
          setRemoveTarget(null);
        }}
        confirmButtonText="Remove"
        cancelButtonText="Cancel"
        intent={Intent.DANGER}
        icon="warning-sign"
      >
        {removeError && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 12 }}>
            {removeError}
          </Callout>
        )}
        <p>
          Remove <strong>{removeTarget?.fullName}</strong> from this team?
        </p>
      </Alert>
    </div>
  );
}
