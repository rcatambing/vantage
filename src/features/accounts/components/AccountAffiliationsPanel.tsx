import { useState } from "react";
import {
  Button,
  Callout,
  Dialog,
  DialogBody,
  DialogFooter,
  HTMLSelect,
  Intent,
  NonIdealState,
  Spinner,
  Switch,
  Tag,
} from "@blueprintjs/core";
import { useAccountAffiliations } from "../hooks/useAccountAffiliations";
import { useAccountAffiliationMutations } from "../hooks/useAccountAffiliationMutations";
import { useAffiliations } from "../hooks/useAffiliations";
import { useAffiliationTypes } from "../hooks/useAffiliationTypes";
import type { AccountAffiliation, AccountAffiliationCreatePayload, AccountAffiliationUpdatePayload } from "../types";

// ── Affinity score bar (0–100) ────────────────────────────────────────────────

function AffinityBar({ score }: { score: number | null }) {
  if (score == null) return <span style={{ color: "var(--cds-text-secondary, #525252)", fontSize: 13 }}>—</span>;
  const pct = Math.min(100, Math.max(0, score));
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          display: "inline-block",
          width: 60,
          height: 6,
          background: "var(--cds-border-subtle, #c6c6c6)",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            background: "var(--cds-interactive-01, #0f62fe)",
          }}
        />
      </span>
      <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{score}</span>
    </span>
  );
}

// ── Inline assign / edit dialog ───────────────────────────────────────────────

interface DialogProps {
  isOpen: boolean;
  accountId: string;
  existing?: AccountAffiliation | null;
  onClose: () => void;
  onSuccess: () => void;
}

function AffiliationDialog({ isOpen, accountId, existing, onClose, onSuccess }: DialogProps) {
  const isEdit = existing != null;
  const { create, update, submitting, error, clearError } = useAccountAffiliationMutations();
  const { items: affiliationTypes } = useAffiliationTypes();

  const [selectedAffiliationTypeId, setSelectedAffiliationTypeId] = useState(existing?.affiliation_type_id ?? "");
  const { items: affiliations } = useAffiliations(selectedAffiliationTypeId || undefined);
  const [affiliationId, setAffiliationId] = useState(existing?.affiliation_id ?? "");
  const [role, setRole] = useState(existing?.role_in_affiliation ?? "");
  const [affinityRaw, setAffinityRaw] = useState(
    existing?.affinity_score != null ? String(existing.affinity_score) : ""
  );
  const [isPrimary, setIsPrimary] = useState(existing?.is_primary ?? false);
  const [startDate, setStartDate] = useState(existing?.start_date ?? "");
  const [endDate, setEndDate] = useState(existing?.end_date ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);

  function resetForm() {
    setSelectedAffiliationTypeId(existing?.affiliation_type_id ?? "");
    setAffiliationId(existing?.affiliation_id ?? "");
    setRole(existing?.role_in_affiliation ?? "");
    setAffinityRaw(existing?.affinity_score != null ? String(existing.affinity_score) : "");
    setIsPrimary(existing?.is_primary ?? false);
    setStartDate(existing?.start_date ?? "");
    setEndDate(existing?.end_date ?? "");
    setFieldError(null);
    clearError();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit() {
    setFieldError(null);
    if (!affiliationId.trim()) {
      setFieldError("Affiliation ID is required.");
      return;
    }
    const affinity = affinityRaw !== "" ? Number(affinityRaw) : undefined;
    if (affinityRaw !== "" && (isNaN(affinity!) || affinity! < 0 || affinity! > 100)) {
      setFieldError("Affinity score must be between 0 and 100.");
      return;
    }
    if (isEdit && existing) {
      const payload: AccountAffiliationUpdatePayload = {
        role_in_affiliation: role || undefined,
        affinity_score: affinity,
        is_primary: isPrimary,
        end_date: endDate || undefined,
      };
      const result = await update(accountId, existing.id, payload);
      if (result) { onSuccess(); handleClose(); }
    } else {
      const payload: AccountAffiliationCreatePayload = {
        affiliation_id: affiliationId.trim(),
        role_in_affiliation: role || undefined,
        affinity_score: affinity,
        is_primary: isPrimary,
        start_date: startDate || undefined,
        source: "MANUAL",
      };
      const result = await create(accountId, payload);
      if (result) { onSuccess(); handleClose(); }
    }
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--cds-text-secondary, #525252)",
    marginBottom: 4,
    display: "block",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 8px",
    fontSize: 14,
    border: "none",
    borderBottom: "1px solid var(--cds-border-subtle, #c6c6c6)",
    background: "transparent",
    outline: "none",
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Affiliation" : "Assign Affiliation"}
      style={{ borderRadius: 0, width: 440 }}
    >
      <DialogBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Affiliation ID */}
          <div>
            <label style={labelStyle}>Affiliation Type *</label>
            <HTMLSelect
              value={selectedAffiliationTypeId}
              onChange={(e) => {
                const nextType = e.target.value;
                setSelectedAffiliationTypeId(nextType);
                setAffiliationId("");
              }}
              disabled={isEdit}
              fill
              options={[
                { value: "", label: "Select affiliation type" },
                ...affiliationTypes.map((item) => ({
                  value: item.id,
                  label: `${item.name} (${item.code})`,
                })),
              ]}
            />
          </div>

          <div>
            <label style={labelStyle}>Affiliation *</label>
            <HTMLSelect
              key={selectedAffiliationTypeId || "affiliation-select"}
              value={affiliationId}
              onChange={(e) => setAffiliationId(e.target.value)}
              disabled={isEdit || !selectedAffiliationTypeId}
              fill
              options={[
                {
                  value: "",
                  label: selectedAffiliationTypeId ? "Select affiliation" : "Select affiliation type first",
                },
                ...affiliations.map((item) => ({ value: item.id, label: item.name })),
              ]}
            />
            {isEdit && (
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary, #525252)", marginTop: 2 }}>
                {existing?.affiliation_name}
              </div>
            )}
          </div>

          {/* Role */}
          <div>
            <label style={labelStyle}>Role</label>
            <input
              style={inputStyle}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Member, Partner, Distributor"
            />
          </div>

          {/* Affinity score */}
          <div>
            <label style={labelStyle}>Affinity Score (0–100)</label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              max={100}
              value={affinityRaw}
              onChange={(e) => setAffinityRaw(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {/* Start / End date row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input
                style={inputStyle}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isEdit}
              />
            </div>
            {isEdit && (
              <div>
                <label style={labelStyle}>End Date</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Primary toggle */}
          <Switch
            checked={isPrimary}
            onChange={(e) => setIsPrimary((e.target as HTMLInputElement).checked)}
            label="Mark as primary for this affiliation type"
          />

          {/* Errors */}
          {(fieldError || error) && (
            <Callout intent={Intent.DANGER} style={{ borderRadius: 0 }}>
              {fieldError ?? error}
            </Callout>
          )}
        </div>
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button onClick={handleClose} style={{ borderRadius: 0 }} disabled={submitting}>
              Cancel
            </Button>
            <Button
              intent={Intent.PRIMARY}
              onClick={handleSubmit}
              loading={submitting}
              style={{ borderRadius: 0 }}
            >
              {isEdit ? "Save Changes" : "Assign"}
            </Button>
          </>
        }
      />
    </Dialog>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface PanelProps {
  accountId: string;
  onChanged?: () => void;
}

export function AccountAffiliationsPanel({ accountId, onChanged }: PanelProps) {
  const { affiliations, loading, error, reload } = useAccountAffiliations(accountId);
  const { remove, submitting: deleting } = useAccountAffiliationMutations(reload);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AccountAffiliation | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleEdit(aff: AccountAffiliation) {
    setEditing(aff);
    setDialogOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    const ok = await remove(accountId, id);
    if (ok) onChanged?.();
    setConfirmDeleteId(null);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout intent={Intent.DANGER} style={{ borderRadius: 0 }} icon="error">
        {error}
      </Callout>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "var(--cds-text-secondary, #525252)" }}>
          {affiliations.length} active affiliation{affiliations.length !== 1 ? "s" : ""}
        </span>
        <Button
          icon="add"
          small
          intent={Intent.PRIMARY}
          onClick={handleAdd}
          style={{ borderRadius: 0 }}
        >
          Assign Affiliation
        </Button>
      </div>

      {/* Empty state */}
      {affiliations.length === 0 && (
        <NonIdealState
          icon="link"
          title="No affiliations assigned"
          description="Assign this account to a group or category."
          action={
            <Button intent={Intent.PRIMARY} onClick={handleAdd} style={{ borderRadius: 0 }}>
              Assign
            </Button>
          }
        />
      )}

      {/* Affiliation cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {affiliations.map((aff) => (
          <div
            key={aff.id}
            style={{
              background: "var(--cds-layer-01, #f4f4f4)",
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Type + Primary badge */}
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                <Tag minimal style={{ borderRadius: 0, fontSize: 11, letterSpacing: "0.08em" }}>
                  {aff.affiliation_type_code}
                </Tag>
                {aff.is_primary && (
                  <Tag icon="star" minimal intent="warning" style={{ borderRadius: 0, fontSize: 11 }}>
                    PRIMARY
                  </Tag>
                )}
              </div>

              {/* Name + role + affinity */}
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                {aff.affiliation_name}
              </div>
              <div style={{ fontSize: 13, color: "var(--cds-text-secondary, #525252)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                {aff.role_in_affiliation && <span>Role: {aff.role_in_affiliation}</span>}
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  Affinity: <AffinityBar score={aff.affinity_score} />
                </span>
              </div>

              {/* Dates + source */}
              <div style={{ fontSize: 12, color: "var(--cds-text-secondary, #525252)", marginTop: 4, letterSpacing: "0.32px" }}>
                {aff.start_date ?? "—"} – {aff.end_date ?? "ongoing"}
                {aff.source && <span style={{ marginLeft: 8 }}>· Source: {aff.source}</span>}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {confirmDeleteId === aff.id ? (
                <>
                  <span style={{ fontSize: 12, color: "var(--cds-support-error, #da1e28)", alignSelf: "center", marginRight: 4 }}>
                    Remove?
                  </span>
                  <Button
                    small
                    intent={Intent.DANGER}
                    loading={deleting}
                    onClick={() => handleDelete(aff.id)}
                    style={{ borderRadius: 0 }}
                  >
                    Yes
                  </Button>
                  <Button small onClick={() => setConfirmDeleteId(null)} style={{ borderRadius: 0 }}>
                    No
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    small
                    minimal
                    icon="edit"
                    onClick={() => handleEdit(aff)}
                    style={{ borderRadius: 0 }}
                  />
                  <Button
                    small
                    minimal
                    icon="trash"
                    intent={Intent.DANGER}
                    onClick={() => setConfirmDeleteId(aff.id)}
                    style={{ borderRadius: 0 }}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <AffiliationDialog
          isOpen={dialogOpen}
          accountId={accountId}
          existing={editing}
          onClose={() => { setDialogOpen(false); setEditing(null); }}
          onSuccess={() => {
            reload();
            onChanged?.();
          }}
        />
      )}
    </div>
  );
}
