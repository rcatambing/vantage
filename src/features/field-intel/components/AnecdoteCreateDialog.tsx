import { useState, useCallback } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  InputGroup,
  HTMLSelect,
  TextArea,
  Callout,
} from "@blueprintjs/core";
import { useAnecdoteMutations } from "../hooks/useIntel";
import type { IntelClassification } from "../types";
import { CLASSIFICATION_OPTIONS } from "../types";
import GPSCaptureButton from "./GPSCaptureButton";
import MediaGallery from "./MediaGallery";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export default function AnecdoteCreateDialog({ isOpen, onClose, campaignId }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [classification, setClassification] = useState<IntelClassification>("INTERNAL");
  const [districtId, setDistrictId] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const { create, submitting, error, clearErrors } = useAnecdoteMutations({
    onSuccess: () => handleClose(),
  });

  const isValid =
    title.trim().length > 0 && content.trim().length > 0;

  const handleClose = useCallback(() => {
    setTitle("");
    setContent("");
    setClassification("INTERNAL");
    setDistrictId("");
    setLatitude(null);
    setLongitude(null);
    setGpsAccuracy(null);
    setMediaUrls([]);
    setFileError(null);
    clearErrors();
    onClose();
  }, [onClose, clearErrors]);

  const handleGPSSuccess = useCallback(
    (lat: number, lng: number, accuracy: number) => {
      setLatitude(lat);
      setLongitude(lng);
      setGpsAccuracy(accuracy);
    },
    [],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      setFileError(null);
      const maxSize = 10 * 1024 * 1024; // 10MB
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > maxSize) {
          setFileError(`File "${file.name}" exceeds 10MB limit.`);
          return;
        }
        urls.push(URL.createObjectURL(file));
      }
      setMediaUrls((prev) => [...prev, ...urls]);
    },
    [],
  );

  const handleRemoveMedia = useCallback((url: string) => {
    setMediaUrls((prev) => prev.filter((u) => u !== url));
    URL.revokeObjectURL(url);
  }, []);

  const handleSubmit = async () => {
    if (!isValid) return;
    const success = await create({
      title: title.trim(),
      content: content.trim(),
      classification,
      campaign_id: campaignId,
      district_id: districtId.trim() || undefined,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
      gps_accuracy: gpsAccuracy ?? undefined,
      media_urls: mediaUrls,
    });
    if (success) handleClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Anecdote"
      icon="document"
      style={{ width: 640, maxWidth: "95vw" }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 12 }}>
            {error}
          </Callout>
        )}
        <FormGroup label="Title" labelFor="anecdote-title" labelInfo="(required)">
          <InputGroup
            id="anecdote-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter anecdote title"
            style={{ borderRadius: 0 }}
          />
        </FormGroup>

        <FormGroup label="Content" labelFor="anecdote-content" labelInfo="(required)">
          <TextArea
            id="anecdote-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe the field intelligence…"
            fill
            rows={6}
            style={{
              borderRadius: 0,
              fontSize: 14,
              resize: "vertical",
              minHeight: 120,
            }}
          />
        </FormGroup>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <FormGroup label="Classification" labelFor="anecdote-classification" style={{ minWidth: 180 }}>
            <HTMLSelect
              id="anecdote-classification"
              value={classification}
              onChange={(e) => setClassification(e.target.value as IntelClassification)}
              options={CLASSIFICATION_OPTIONS}
              fill
              style={{ borderRadius: 0 }}
            />
          </FormGroup>

          <FormGroup label="District ID" labelFor="anecdote-district" style={{ flex: 1, minWidth: 180 }}>
            <InputGroup
              id="anecdote-district"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              placeholder="Optional district"
              style={{ borderRadius: 0 }}
            />
          </FormGroup>
        </div>

        <FormGroup label="Location">
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            <GPSCaptureButton onCapture={handleGPSSuccess} disabled={submitting} />
            {(latitude != null && longitude != null) && (
              <div style={{ fontSize: 12, color: "var(--cds-text-secondary)", paddingTop: 14 }}>
                Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
                {gpsAccuracy != null && ` (±${Math.round(gpsAccuracy)}m)`}
              </div>
            )}
          </div>
        </FormGroup>

        <FormGroup label="Media Attachments">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            disabled={submitting}
            aria-label="Upload media files"
            style={{ marginBottom: 8 }}
          />
          {fileError && (
            <Callout intent={Intent.WARNING} icon="warning-sign" style={{ marginBottom: 8, fontSize: 12 }}>
              {fileError}
            </Callout>
          )}
          {mediaUrls.length > 0 && (
            <MediaGallery
              mediaUrls={mediaUrls}
              altText={title || "Anecdote media"}
              onRemove={handleRemoveMedia}
            />
          )}
        </FormGroup>
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              intent={Intent.PRIMARY}
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              loading={submitting}
              icon="tick"
            >
              Create Anecdote
            </Button>
          </>
        }
      />
    </Dialog>
  );
}
