import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  Callout,
  ProgressBar,
  Tag,
  Classes,
  FileInput,
} from "@blueprintjs/core";
import { useVoterImport } from "../hooks/useVoters";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export default function VoterImportDialog({ isOpen, onClose, campaignId }: Props) {
  const { importing, result, error, clear, importFile } = useVoterImport();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setFile(null);
    clear();
    onClose();
  }, [onClose, clear]);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    clear();
  }, [clear]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect],
  );

  const handleSubmit = async () => {
    if (!file) return;
    const success = await importFile(file, campaignId);
    if (success) {
      // Keep dialog open to show result; user clicks Close
    }
  };

  const downloadErrorReport = () => {
    if (!result || result.error_rows.length === 0) return;
    const csv = [
      "Row,Reason",
      ...result.error_rows.map((r) => `${r.row},"${r.reason.replace(/"/g, '""')}"`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voter_import_errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isValidFile =
    file &&
    (file.name.endsWith(".csv") ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls"));

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Voters"
      icon="import"
      style={{ width: 520 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        {result && (
          <div style={{ marginBottom: 16 }}>
            <Callout intent={Intent.SUCCESS} icon="tick" title="Import complete">
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <Tag intent={Intent.SUCCESS} minimal>
                  {result.success_count} imported
                </Tag>
                {result.error_count > 0 && (
                  <Tag intent={Intent.DANGER} minimal>
                    {result.error_count} errors
                  </Tag>
                )}
              </div>
              {result.error_rows.length > 0 && (
                <Button
                  minimal
                  small
                  icon="download"
                  text="Download error report"
                  onClick={downloadErrorReport}
                  style={{ marginTop: 12 }}
                />
              )}
            </Callout>
          </div>
        )}

        {!result && (
          <>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? "var(--cds-interactive, #78a9ff)" : "var(--cds-border-strong, #6f6f6f)"}`,
                borderRadius: 0,
                padding: 32,
                textAlign: "center",
                background: dragOver
                  ? "var(--cds-hover-ui, #353535)"
                  : "var(--cds-layer-01, #262626)",
                transition: "background 150ms ease, border-color 150ms ease",
                marginBottom: 16,
              }}
              role="region"
              aria-label="Drag and drop zone for voter import file"
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
              <p className={Classes.TEXT_MUTED} style={{ margin: "0 0 12px" }}>
                Drag & drop a CSV or XLSX file here
              </p>
              <FileInput
                text={file ? file.name : "Choose file…"}
                inputProps={{
                  accept: ".csv,.xlsx,.xls",
                  ref: inputRef,
                  onChange: (e) =>
                    handleFileSelect(e.target.files?.[0] ?? null),
                }}
              />
            </div>

            {file && !isValidFile && (
              <Callout intent={Intent.WARNING} icon="warning-sign" style={{ marginBottom: 16 }}>
                Please select a CSV or XLSX file.
              </Callout>
            )}

            {importing && (
              <div style={{ marginTop: 8 }}>
                <ProgressBar intent={Intent.PRIMARY} />
                <p
                  className={Classes.TEXT_MUTED}
                  style={{ fontSize: 12, marginTop: 8, textAlign: "center" }}
                >
                  Uploading and processing…
                </p>
              </div>
            )}
          </>
        )}
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button text="Close" onClick={handleClose} />
            {!result && (
              <Button
                intent={Intent.PRIMARY}
                text="Import"
                onClick={handleSubmit}
                loading={importing}
                disabled={!isValidFile}
              />
            )}
          </>
        }
      />
    </Dialog>
  );
}
