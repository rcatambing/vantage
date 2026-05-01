import { useRef, useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  RadioGroup,
  Radio,
  Callout,
  Spinner,
  ProgressBar,
  Tag,
  Classes,
} from "@blueprintjs/core";
import { useM07Upload } from "../hooks/useM07Upload";
import { getM07ErrorReportUrl } from "../api/m07Api";
import type { DuplicateMode } from "../types";

const WIZARD_STEP_LABELS = [
  "Select File",
  "Map Columns",
  "Preview",
  "Importing",
  "Result",
] as const;

/** Required and optional columns the server expects in the upload file. */
const EXPECTED_COLUMNS = [
  { field: "district_id", label: "District ID (or district_name)", required: true },
  { field: "historical_turnout_rate", label: "Historical Turnout Rate", required: true },
  { field: "historical_turnout_election_type", label: "Election Type", required: true },
  { field: "historical_turnout_last_cycle_year", label: "Last Cycle Year", required: true },
  { field: "historical_turnout_cycle_count", label: "Cycle Count", required: true },
  { field: "historical_turnout_source", label: "Source", required: true },
  { field: "historical_turnout_quality_score", label: "Quality Score", required: false },
  { field: "historical_turnout_as_of", label: "As-of Date", required: false },
  { field: "source_observed_at", label: "Source Observed At", required: false },
];

const ACCEPTED_FORMATS = ".csv,.xlsx,.xls";

interface Props {
  isOpen: boolean;
  campaignId: string;
  onClose: () => void;
  /** Called when a COMMIT batch reaches COMMITTED status — use to refresh history. */
  onSuccess: () => void;
}

export default function TurnoutUploadWizard({ isOpen, campaignId, onClose, onSuccess }: Props) {
  const { state, selectFile, confirmMapping, runCommit, goBack, reset } =
    useM07Upload(campaignId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const duplicateModeRef = useRef<DuplicateMode>("REJECT");
  // Tracks whether the native file input has a file chosen (enables Next on step 1)
  const [localFileChosen, setLocalFileChosen] = useState(false);

  const handleClose = useCallback(() => {
    reset();
    setLocalFileChosen(false);
    onClose();
  }, [reset, onClose]);

  const handleSelectFile = useCallback(() => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    void selectFile(file, duplicateModeRef.current);
  }, [selectFile]);

  const handleConfirmMapping = useCallback(() => {
    void confirmMapping();
  }, [confirmMapping]);

  const handleImport = useCallback(() => {
    void runCommit();
  }, [runCommit]);

  // Notify parent when a successful commit lands on step 5
  const batchStatus = state.batchStatus;
  const prevStep = useRef(state.step);
  useEffect(() => {
    if (state.step === 5 && prevStep.current !== 5 && batchStatus?.status === "COMMITTED") {
      onSuccess();
    }
    prevStep.current = state.step;
  }, [state.step, batchStatus?.status, onSuccess]);

  const title = `Upload Historical Turnout Data — Step ${state.step} of 5`;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      style={{ width: 640 }}
    >
      <DialogBody>
        {/* Step indicator */}
        <StepIndicator step={state.step} />

        {state.error && (
          <div role="alert" aria-live="assertive" style={{ marginBottom: 12 }}>
            <Callout
              intent={Intent.DANGER}
              icon="error"
            >
              {state.error}
            </Callout>
          </div>
        )}

        {(state.step === 1 || state.step === 2 || state.step === 3) && (
          <div role="status" aria-live="polite">
            {state.step === 1 && (
              <Step1SelectFile
                fileInputRef={fileInputRef}
                duplicateModeRef={duplicateModeRef}
                onFileChange={(hasFile) => setLocalFileChosen(hasFile)}
              />
            )}

            {state.step === 2 && (
              <Step2MapColumns
                fileName={state.file?.name ?? ""}
                csvHeaders={state.csvHeaders}
              />
            )}

            {state.step === 3 && (
              <Step3Preview
                loading={state.loading}
                validateResult={state.validateResult}
                duplicateMode={state.duplicateMode}
              />
            )}
          </div>
        )}

        {state.step === 4 && (
          <div role="status" aria-live="polite">
            <Step4Importing batchStatus={state.batchStatus} />
          </div>
        )}

        {state.step === 5 && (
          <div role="status" aria-live="polite">
            <Step5Result
              batchStatus={state.batchStatus}
            />
          </div>
        )}
      </DialogBody>

      <DialogFooter
        actions={
          <WizardFooterActions
            step={state.step}
            loading={state.loading}
            localFileChosen={localFileChosen}
            onBack={goBack}
            onNext={() => {
              if (state.step === 1) handleSelectFile();
              else if (state.step === 2) handleConfirmMapping();
              else if (state.step === 3) handleImport();
            }}
            onDone={handleClose}
            onUploadAnother={() => {
              setLocalFileChosen(false);
              reset();
              if (state.batchStatus?.status === "COMMITTED") onSuccess();
            }}
          />
        }
      />
    </Dialog>
  );
}

/* ─── Step indicator ─────────────────────────────────────────────────────── */

function StepIndicator({ step }: { step: number }) {
  return (
    <ol
      aria-label="Upload wizard steps"
      style={{
        display: "flex",
        listStyle: "none",
        padding: 0,
        margin: "0 0 20px 0",
        gap: 0,
      }}
    >
      {WIZARD_STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const isDone = step > num;
        const isCurrent = step === num;
        return (
          <li
            key={label}
            aria-current={isCurrent ? "step" : undefined}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: isDone ? "#198038" : isCurrent ? "#0f62fe" : "var(--cds-layer-02, #e8e8e8)",
                color: isDone || isCurrent ? "#fff" : "#525252",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {isDone ? "✓" : num}
            </div>
            <span
              style={{
                fontSize: 10,
                marginTop: 4,
                color: isCurrent ? "#0f62fe" : "#525252",
                textAlign: "center",
              }}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ─── Step 1: Select File ────────────────────────────────────────────────── */

function Step1SelectFile({
  fileInputRef,
  duplicateModeRef,
  onFileChange,
}: {
  fileInputRef: React.RefObject<HTMLInputElement>;
  duplicateModeRef: React.MutableRefObject<DuplicateMode>;
  onFileChange: (hasFile: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormGroup
        label="Upload file"
        labelInfo="(required)"
        helperText="Accepted formats: CSV, XLSX, XLS. The file must contain all required columns."
        labelFor="upload-file-input"
      >
        <input
          id="upload-file-input"
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FORMATS}
          aria-required="true"
          aria-describedby="upload-file-hint"
          style={{ display: "block", marginTop: 4 }}
          onChange={(e) => onFileChange(!!e.target.files?.[0])}
        />
        <span id="upload-file-hint" className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
          Max recommended file size: 10 MB
        </span>
      </FormGroup>

      <FormGroup
        label="Duplicate handling"
        labelInfo="(required)"
        helperText="REJECT: rows with duplicate keys are rejected. UPSERT: existing rows are superseded."
      >
        <RadioGroup
          aria-label="Duplicate mode"
          defaultSelectedValue="REJECT"
          onChange={(e) => {
            duplicateModeRef.current = (e.target as HTMLInputElement).value as DuplicateMode;
          }}
          inline
        >
          <Radio value="REJECT" label="Skip duplicates (REJECT)" />
          <Radio value="UPSERT" label="Overwrite existing (UPSERT)" />
        </RadioGroup>
      </FormGroup>

      <Callout intent={Intent.NONE} icon="info-sign">
        A unique idempotency key is automatically generated per upload to prevent accidental
        double-submissions.
      </Callout>
    </div>
  );
}

/* ─── Step 2: Map Columns ────────────────────────────────────────────────── */

function Step2MapColumns({
  fileName,
  csvHeaders,
}: {
  fileName: string;
  csvHeaders: string[];
}) {
  const isCsv = fileName.toLowerCase().endsWith(".csv");
  const detectedSet = new Set(csvHeaders.map((h) => h.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p className={Classes.TEXT_MUTED} style={{ margin: 0, fontSize: 13 }}>
        Confirm the expected columns below. Column detection for XLSX files is handled
        server-side.
      </p>

      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
        aria-label="Expected column mapping"
      >
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "left", padding: "4px 8px", borderBottom: "1px solid var(--cds-border-subtle-01, #e8e8e8)" }}>Expected field</th>
            <th scope="col" style={{ textAlign: "left", padding: "4px 8px", borderBottom: "1px solid var(--cds-border-subtle-01, #e8e8e8)" }}>Required</th>
            <th scope="col" style={{ textAlign: "left", padding: "4px 8px", borderBottom: "1px solid var(--cds-border-subtle-01, #e8e8e8)" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {EXPECTED_COLUMNS.map((col) => {
            const found = !isCsv || detectedSet.has(col.field.toLowerCase());
            return (
              <tr key={col.field}>
                <td style={{ padding: "4px 8px", fontFamily: "monospace", fontSize: 11 }}>
                  {col.field}
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {col.required ? (
                    <Tag minimal intent={Intent.PRIMARY} style={{ fontSize: 10 }}>Required</Tag>
                  ) : (
                    <Tag minimal intent={Intent.NONE} style={{ fontSize: 10 }}>Optional</Tag>
                  )}
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {isCsv ? (
                    found ? (
                      <span style={{ color: "#198038" }} aria-label="Column detected">✓ Detected</span>
                    ) : col.required ? (
                      <span style={{ color: "#da1e28" }} aria-label="Required column not found">⚠ Not found</span>
                    ) : (
                      <span className={Classes.TEXT_MUTED} aria-label="Optional column not found">— Not found</span>
                    )
                  ) : (
                    <span className={Classes.TEXT_MUTED}>Server-verified</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Callout intent={Intent.PRIMARY} icon="info-sign" style={{ fontSize: 12 }}>
        Clicking <strong>Validate &amp; Preview</strong> will submit the file for a dry-run
        validation. No data is committed at this stage.
      </Callout>
    </div>
  );
}

/* ─── Step 3: Preview / Validate ─────────────────────────────────────────── */

function Step3Preview({
  loading,
  validateResult,
  duplicateMode,
}: {
  loading: boolean;
  validateResult: ReturnType<typeof useM07Upload>["state"]["validateResult"];
  duplicateMode: DuplicateMode;
}) {
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24 }}>
        <Spinner size={32} aria-label="Validating file" />
        <p className={Classes.TEXT_MUTED}>Validating file on server…</p>
      </div>
    );
  }

  if (!validateResult) {
    return (
      <Callout intent={Intent.WARNING} icon="warning-sign">
        Validation result not available. Go back and try again.
      </Callout>
    );
  }

  const batchId = validateResult.batch_id;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Callout intent={Intent.SUCCESS} icon="tick-circle" title="Validation complete">
        The file has been validated. Review the summary and click{" "}
        <strong>Import</strong> to commit.
      </Callout>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          background: "var(--cds-layer-02, #f4f4f4)",
          borderRadius: 2,
          padding: 12,
        }}
        aria-label="Validation summary"
      >
        <CounterCell label="Total rows" value="—" note="Counted server-side" />
        <CounterCell label="Duplicate mode" value={duplicateMode} />
        <CounterCell label="Batch ID" value={batchId.slice(0, 8) + "…"} note="Truncated" />
      </div>

      <p className={Classes.TEXT_MUTED} style={{ fontSize: 12, margin: 0 }}>
        Batch status: <strong>{validateResult.status}</strong>. Counters are
        {validateResult.counters_provisional ? " provisional" : " final"} at this stage.
      </p>

      {batchId && (
        <div>
          <a
            href={getM07ErrorReportUrl(batchId)}
            download="m07-validation-errors.csv"
            style={{ fontSize: 12 }}
            aria-label="Download validation error report CSV"
          >
            Download validation error report (CSV)
          </a>
        </div>
      )}
    </div>
  );
}

function CounterCell({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 300 }}>{value}</div>
      <div className={Classes.TEXT_MUTED} style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      {note && <div className={Classes.TEXT_MUTED} style={{ fontSize: 10 }}>{note}</div>}
    </div>
  );
}

/* ─── Step 4: Import in progress ─────────────────────────────────────────── */

function Step4Importing({
  batchStatus,
}: {
  batchStatus: ReturnType<typeof useM07Upload>["state"]["batchStatus"];
}) {
  const status = batchStatus?.status ?? "UPLOADED";
  const statusLabel =
    status === "UPLOADED"
      ? "Uploading…"
      : status === "PARSED"
      ? "Parsing rows…"
      : status === "VALIDATED"
      ? "Committing…"
      : "Processing…";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 24 }}>
      <Spinner size={40} aria-label="Import in progress" />
      <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{statusLabel}</p>
      <ProgressBar intent={Intent.PRIMARY} animate stripes style={{ width: 320 }} aria-label="Import progress" />
      {batchStatus && (
        <p className={Classes.TEXT_MUTED} style={{ margin: 0, fontSize: 12 }}>
          Status: <strong>{batchStatus.status}</strong>
        </p>
      )}
    </div>
  );
}

/* ─── Step 5: Result ─────────────────────────────────────────────────────── */

function Step5Result({
  batchStatus,
}: {
  batchStatus: ReturnType<typeof useM07Upload>["state"]["batchStatus"];
}) {
  if (!batchStatus) {
    return (
      <Callout intent={Intent.WARNING} icon="warning-sign">
        Import status is unavailable. Check the History tab to confirm.
      </Callout>
    );
  }

  const succeeded = batchStatus.status === "COMMITTED";
  const hasErrors = batchStatus.rejected_rows > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Callout
        intent={succeeded ? Intent.SUCCESS : Intent.DANGER}
        icon={succeeded ? "tick-circle" : "error"}
        title={succeeded ? "Import complete" : `Import ${batchStatus.status.toLowerCase()}`}
      >
        {succeeded
          ? "Historical turnout data has been imported successfully."
          : "The import did not complete. Check the error report for details."}
      </Callout>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          background: "var(--cds-layer-02, #f4f4f4)",
          borderRadius: 2,
          padding: 12,
        }}
        aria-label="Import result summary"
      >
        <CounterCell label="Total rows" value={batchStatus.total_rows} />
        <CounterCell label="Accepted" value={batchStatus.accepted_rows} />
        <CounterCell
          label="Rejected"
          value={batchStatus.rejected_rows}
          note={hasErrors ? "See error report" : undefined}
        />
      </div>

      {hasErrors && (
        <a
          href={getM07ErrorReportUrl(batchStatus.batch_id)}
          download="m07-import-errors.csv"
          style={{ fontSize: 12 }}
          aria-label="Download import error report CSV"
        >
          Download import error report (CSV)
        </a>
      )}

      {batchStatus.committed_at && (
        <p className={Classes.TEXT_MUTED} style={{ fontSize: 12, margin: 0 }}>
          Committed at:{" "}
          {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(
            new Date(batchStatus.committed_at)
          )}
        </p>
      )}

      {succeeded && (
        <Callout intent={Intent.PRIMARY} icon="info-sign" style={{ fontSize: 12 }}>
          Switch to the <strong>Historical Data</strong> tab to view the imported records.
        </Callout>
      )}
    </div>
  );
}

/* ─── Footer actions ─────────────────────────────────────────────────────── */

interface FooterProps {
  step: number;
  loading: boolean;
  localFileChosen: boolean;
  onBack: () => void;
  onNext: () => void;
  onDone: () => void;
  onUploadAnother: () => void;
}

function WizardFooterActions({
  step,
  loading,
  localFileChosen,
  onBack,
  onNext,
  onDone,
  onUploadAnother,
}: FooterProps) {
  if (step === 4) {
    return <Button text="Cancel" onClick={onDone} disabled={loading} />;
  }

  if (step === 5) {
    return (
      <>
        <Button text="Upload Another" icon="upload" onClick={onUploadAnother} />
        <Button text="Done" intent={Intent.PRIMARY} onClick={onDone} />
      </>
    );
  }

  const nextLabel =
    step === 1
      ? "Next"
      : step === 2
      ? "Validate & Preview"
      : step === 3
      ? "Import"
      : "Next";

  const nextIntent = step === 3 ? Intent.SUCCESS : Intent.PRIMARY;
  const nextIcon = step === 3 ? ("import" as const) : ("arrow-right" as const);

  return (
    <>
      {step > 1 && step < 4 && (
        <Button text="Back" onClick={onBack} disabled={loading} />
      )}
      <Button text="Cancel" onClick={onDone} disabled={loading} />
      <Button
        text={nextLabel}
        intent={nextIntent}
        icon={nextIcon}
        loading={loading}
        disabled={step === 1 && !localFileChosen}
        onClick={onNext}
      />
    </>
  );
}
