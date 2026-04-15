import { useEffect, useState } from "react";
import {
  Button,
  Callout,
  Dialog,
  DialogBody,
  DialogFooter,
  Intent,
  NonIdealState,
  Spinner,
  Tag,
  TextArea,
} from "@blueprintjs/core";
import { useAccountSignals } from "../hooks/useAccountSignals";
import { useAccountSignalMutations } from "../hooks/useAccountSignalMutations";
import { useSignalTypes } from "../hooks/useSignalTypes";
import { DerivedSignalBadge } from "./DerivedSignalBadge";
import type { AccountSignal, AccountSignalCreatePayload, AccountSignalUpdatePayload } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
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

// ── Signal edit/create dialog ─────────────────────────────────────────────────

interface SignalDialogProps {
  isOpen: boolean;
  accountId: string;
  existing?: AccountSignal | null;
  onClose: () => void;
  onSuccess: () => void;
}

function SignalDialog({ isOpen, accountId, existing, onClose, onSuccess }: SignalDialogProps) {
  const isEdit = existing != null;
  const isDerived = (existing?.derived_from_affiliation_id ?? null) !== null;
  const { create, update, submitting, error, clearError } = useAccountSignalMutations();
  const { items: signalTypes } = useSignalTypes();

  const todayIso = new Date().toISOString().slice(0, 10);

  const [signalTypeId, setSignalTypeId] = useState(existing?.signal_type_id ?? "");
  const [intensityRaw, setIntensityRaw] = useState(
    existing?.intensity_score != null ? String(existing.intensity_score) : ""
  );
  const [confidenceRaw, setConfidenceRaw] = useState(
    existing?.confidence_score != null ? String(existing.confidence_score) : ""
  );
  const [observedAt, setObservedAt] = useState(
    existing?.observed_at ? existing.observed_at.slice(0, 10) : todayIso
  );
  const [expiresAt, setExpiresAt] = useState(existing?.expires_at?.slice(0, 10) ?? "");
  const [source, setSource] = useState(existing?.source ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);

  function handleClose() {
    clearError();
    setFieldError(null);
    onClose();
  }

  async function handleSubmit() {
    setFieldError(null);
    if (!isEdit && !signalTypeId.trim()) {
      setFieldError("Signal Type ID is required.");
      return;
    }
    if (!observedAt) {
      setFieldError("Observed At date is required.");
      return;
    }
    if (expiresAt && expiresAt <= observedAt) {
      setFieldError("Expires At must be after Observed At.");
      return;
    }

    const intensity = intensityRaw !== "" ? Number(intensityRaw) : undefined;
    const confidence = confidenceRaw !== "" ? Number(confidenceRaw) : undefined;
    if (
      intensityRaw !== "" &&
      (Number.isNaN(intensity) || intensity == null || intensity < 0 || intensity > 100)
    ) {
      setFieldError("Intensity must be a number between 0 and 100.");
      return;
    }
    if (
      confidenceRaw !== "" &&
      (Number.isNaN(confidence) || confidence == null || confidence < 0 || confidence > 100)
    ) {
      setFieldError("Confidence must be a number between 0 and 100.");
      return;
    }

    if (isEdit && existing) {
      const payload: AccountSignalUpdatePayload = {
        intensity_score: intensity,
        confidence_score: confidence,
        expires_at: expiresAt || null,
        notes: notes || undefined,
      };
      const result = await update(accountId, existing.id, payload);
      if (result) { onSuccess(); handleClose(); }
    } else {
      const payload: AccountSignalCreatePayload = {
        signal_type_id: signalTypeId.trim(),
        intensity_score: intensity,
        confidence_score: confidence,
        observed_at: observedAt,
        expires_at: expiresAt || undefined,
        source: source || undefined,
        notes: notes || undefined,
      };
      const result = await create(accountId, payload);
      if (result) { onSuccess(); handleClose(); }
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Signal" : "Add Signal"}
      style={{ borderRadius: 0, width: 480 }}
    >
      <DialogBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Derived banner */}
          {isDerived && (
            <Callout intent={Intent.PRIMARY} icon="info-sign" style={{ borderRadius: 0 }}>
              This signal was auto-derived from an affiliation. Signal type and source are
              locked. Adjust scores and notes only, or remove the affiliation to expire it.
            </Callout>
          )}

          {/* Signal Type */}
          <div>
            <label style={labelStyle}>Signal Type ID *</label>
            <select
              style={{
                ...inputStyle,
                ...(isEdit ? { color: "var(--cds-text-secondary, #525252)" } : {}),
                paddingRight: 24,
              }}
              value={isEdit ? (existing?.signal_type_id ?? signalTypeId) : signalTypeId}
              onChange={(e) => setSignalTypeId(e.target.value)}
              disabled={isEdit}
            >
              <option value="">Select signal type</option>
              {signalTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>

          {/* Intensity + Confidence */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Intensity (0–100)</label>
              <input
                style={inputStyle}
                type="number"
                min={0}
                max={100}
                value={intensityRaw}
                onChange={(e) => setIntensityRaw(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <label style={labelStyle}>Confidence (0–100)</label>
              <input
                style={inputStyle}
                type="number"
                min={0}
                max={100}
                value={confidenceRaw}
                onChange={(e) => setConfidenceRaw(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Observed At *</label>
              <input
                style={inputStyle}
                type="date"
                value={observedAt}
                onChange={(e) => setObservedAt(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Expires At</label>
              <input
                style={inputStyle}
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          {/* Source — locked for derived signals */}
          {!isDerived && (
            <div>
              <label style={labelStyle}>Source</label>
              <input
                style={inputStyle}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. FIELD_SURVEY"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fill
              style={{ borderRadius: 0, resize: "vertical", minHeight: 72 }}
            />
          </div>

          {/* Error summary */}
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
              {isEdit ? "Save Changes" : "Add Signal"}
            </Button>
          </>
        }
      />
    </Dialog>
  );
}

// ── Params table ──────────────────────────────────────────────────────────────

function ParamsRow({ signal }: { signal: AccountSignal }) {
  const [expanded, setExpanded] = useState(false);
  if (signal.params.length === 0) return null;

  function paramValue(p: AccountSignal["params"][number]): string {
    if (p.param_value_text != null) return p.param_value_text;
    if (p.param_value_number != null) return `${p.param_value_number}${p.unit ? ` ${p.unit}` : ""}`;
    if (p.param_value_bool != null) return p.param_value_bool ? "true" : "false";
    return "—";
  }

  return (
    <div style={{ marginTop: 4 }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 12,
          color: "var(--cds-link-primary, #0f62fe)",
          letterSpacing: "0.16px",
        }}
      >
        {expanded ? "▾" : "▸"} params ({signal.params.length})
      </button>
      {expanded && (
        <table style={{ fontSize: 12, marginTop: 4, borderCollapse: "collapse" }}>
          <tbody>
            {signal.params.map((p) => (
              <tr key={p.id}>
                <td style={{ paddingRight: 12, color: "var(--cds-text-secondary, #525252)", letterSpacing: "0.16px" }}>
                  {p.param_key}
                </td>
                <td style={{ letterSpacing: "0.16px" }}>{paramValue(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Signal card ───────────────────────────────────────────────────────────────

interface SignalCardProps {
  signal: AccountSignal;
  onEdit: (s: AccountSignal) => void;
  onDelete: (s: AccountSignal) => void;
  deleting: boolean;
  confirmDeleteId: string | null;
  onConfirmDelete: (id: string | null) => void;
}

function SignalCard({ signal, onEdit, onDelete, deleting, confirmDeleteId, onConfirmDelete }: SignalCardProps) {
  const isDerived = signal.derived_from_affiliation_id !== null;
  const isExpired = signal.expires_at ? new Date(signal.expires_at) <= new Date() : false;

  return (
    <div
      style={{
        padding: "10px 14px",
        borderLeft: "2px solid var(--cds-border-subtle, #c6c6c6)",
        marginBottom: 8,
        opacity: isExpired ? 0.55 : 1,
      }}
    >
      {/* Top row: badges + dates */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <DerivedSignalBadge
            isDerived={isDerived}
            affiliationName={isDerived ? "linked affiliation" : undefined}
          />
          <Tag minimal style={{ borderRadius: 0, fontSize: 11, letterSpacing: "0.08em" }}>
            {signal.signal_type_code}
          </Tag>
          <span style={{ fontSize: 12, color: "var(--cds-text-secondary, #525252)", letterSpacing: "0.32px" }}>
            Observed: {formatDate(signal.observed_at)}
          </span>
          {signal.intensity_score != null && (
            <span style={{ fontSize: 12, color: "var(--cds-text-secondary, #525252)" }}>
              · Intensity: {signal.intensity_score}
            </span>
          )}
          {signal.confidence_score != null && (
            <span style={{ fontSize: 12, color: "var(--cds-text-secondary, #525252)" }}>
              · Confidence: {signal.confidence_score}
            </span>
          )}
          {isExpired && (
            <Tag minimal intent="none" style={{ borderRadius: 0, fontSize: 11, textDecoration: "line-through" }}>
              Expired {formatDate(signal.expires_at)}
            </Tag>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {confirmDeleteId === signal.id ? (
            <>
              <span style={{ fontSize: 12, color: "var(--cds-support-error, #da1e28)", alignSelf: "center", marginRight: 4 }}>
                {isDerived ? "Delete derived signal?" : "Delete?"}
              </span>
              <Button
                small
                intent={Intent.DANGER}
                loading={deleting}
                onClick={() => onDelete(signal)}
                style={{ borderRadius: 0 }}
              >
                Yes
              </Button>
              <Button small onClick={() => onConfirmDelete(null)} style={{ borderRadius: 0 }}>
                No
              </Button>
            </>
          ) : (
            <>
              <Button
                small
                minimal
                icon="edit"
                title={isDerived ? "Edit scores only" : "Edit signal"}
                onClick={() => onEdit(signal)}
                style={{ borderRadius: 0 }}
              />
              <Button
                small
                minimal
                icon="trash"
                intent={Intent.DANGER}
                onClick={() => onConfirmDelete(signal.id)}
                style={{ borderRadius: 0 }}
              />
            </>
          )}
        </div>
      </div>

      {/* Notes */}
      {signal.notes && (
        <div style={{ fontSize: 13, marginTop: 6, color: "var(--cds-text-primary, #161616)" }}>
          "{signal.notes}"
        </div>
      )}

      {/* Params */}
      <ParamsRow signal={signal} />
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface PanelProps {
  accountId: string;
  reloadToken?: number;
}

export function AccountSignalsPanel({ accountId, reloadToken }: PanelProps) {
  const { signals, loading, error, showExpired, setShowExpired, reload } = useAccountSignals(accountId);
  const { remove, submitting: deleting } = useAccountSignalMutations(reload);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AccountSignal | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleEdit(signal: AccountSignal) {
    setEditing(signal);
    setDialogOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  async function handleDelete(signal: AccountSignal) {
    await remove(accountId, signal.id);
    setConfirmDeleteId(null);
  }

  useEffect(() => {
    if (reloadToken !== undefined) {
      reload();
    }
  }, [reloadToken]);

  // Group signals by signal_type_code
  const groups: Record<string, AccountSignal[]> = {};
  for (const s of signals) {
    if (!groups[s.signal_type_code]) groups[s.signal_type_code] = [];
    groups[s.signal_type_code].push(s);
  }
  const groupCodes = Object.keys(groups).sort();

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
          {signals.length} signal{signals.length !== 1 ? "s" : ""}
          {showExpired ? " (incl. expired)" : ""}
        </span>
        <Button
          icon="add"
          small
          intent={Intent.PRIMARY}
          onClick={handleAdd}
          style={{ borderRadius: 0 }}
        >
          Add Signal
        </Button>
      </div>

      {/* Empty state */}
      {signals.length === 0 && (
        <NonIdealState
          icon="timeline-events"
          title="No signals recorded"
          description="Add signals manually or assign affiliations to auto-derive them."
          action={
            <Button intent={Intent.PRIMARY} onClick={handleAdd} style={{ borderRadius: 0 }}>
              Add Signal
            </Button>
          }
        />
      )}

      {/* Groups */}
      {groupCodes.map((code) => (
        <div key={code} style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingBottom: 6,
              borderBottom: "1px solid var(--cds-border-subtle, #c6c6c6)",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>{code}</span>
            <Tag minimal style={{ borderRadius: 0, fontSize: 11 }}>
              {groups[code].length}
            </Tag>
          </div>
          {groups[code].map((s) => (
            <SignalCard
              key={s.id}
              signal={s}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={deleting}
              confirmDeleteId={confirmDeleteId}
              onConfirmDelete={setConfirmDeleteId}
            />
          ))}
        </div>
      ))}

      {/* Show expired toggle */}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => setShowExpired((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontSize: 12,
            color: "var(--cds-link-primary, #0f62fe)",
            letterSpacing: "0.16px",
          }}
        >
          {showExpired ? "Hide expired" : "Show expired"}
        </button>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <SignalDialog
          isOpen={dialogOpen}
          accountId={accountId}
          existing={editing}
          onClose={() => { setDialogOpen(false); setEditing(null); }}
          onSuccess={reload}
        />
      )}
    </div>
  );
}
