import { useState, useCallback } from "react";
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
import { useParticipantMutations } from "../hooks/usePolls";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pollId: string;
  onImported: () => void;
}

export default function ParticipantImportDialog({
  isOpen,
  onClose,
  pollId,
  onImported,
}: Props) {
  const { importing, error, clearErrors, importFile } = useParticipantMutations();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<{
    success_count: number;
    error_count: number;
  } | null>(null);

  const handleClose = useCallback(() => {
    setFile(null);
    setResult(null);
    clearErrors();
    onClose();
  }, [onClose, clearErrors]);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    clearErrors();
  }, [clearErrors]);

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
    const data = await importFile(pollId, file);
    if (data) {
      setResult({
        success_count: data.success_count,
        error_count: data.error_count,
      });
      onImported();
    }
  };

  const downloadTemplate = () => {
    const csv = "voter_id,email,phone\nV001,juan@example.com,+639123456789\nV002,maria@example.com,+639987654321\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participant_template.csv";
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
      title="Import Participants"
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
            </Callout>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <Button
            minimal
            small
            icon="download"
            text="Download template"
            onClick={downloadTemplate}
          />
        </div>

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
              aria-label="Drag and drop zone for participant import file"
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
              <p className={Classes.TEXT_MUTED} style={{ margin: "0 0 12px" }}>
                Drag & drop a CSV or XLSX file here
              </p>
              <FileInput
                text={file ? file.name : "Choose file…"}
                inputProps={{
                  accept: ".csv,.xlsx,.xls",
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
