import { useState, useCallback, useEffect } from "react";
import {
  Button,
  FormGroup,
  InputGroup,
  HTMLSelect,
  TextArea,
  Callout,
  Intent,
  Card,
  Elevation,
  Tag,
  Spinner,
} from "@blueprintjs/core";
import { useCanvassSubmit } from "../hooks/useIntel";
import { queueItem } from "../lib/offlineStorage";
import type { SentimentLevel } from "../types";
import { SENTIMENT_OPTIONS } from "../types";
import SentimentBadge from "./SentimentBadge";
import GPSCaptureButton from "./GPSCaptureButton";
import MediaGallery from "./MediaGallery";
import OfflineStatusBar from "./OfflineStatusBar";

interface Props {
  campaignId: string;
}

export default function CanvassForm({ campaignId }: Props) {
  const [voterId, setVoterId] = useState("");
  const [voterName, setVoterName] = useState("");
  const [sentiment, setSentiment] = useState<SentimentLevel>("UNDECIDED");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    { type: "success" | "queued"; message: string } | null
  >(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { submit, submitting, error, clearErrors } = useCanvassSubmit({
    onSuccess: () => {
      setVoterId("");
      setVoterName("");
      setSentiment("UNDECIDED");
      setNotes("");
      setLatitude(null);
      setLongitude(null);
      setGpsAccuracy(null);
      setMediaUrls([]);
      setSubmitStatus({ type: "success", message: "Canvass entry submitted successfully." });
      setTimeout(() => setSubmitStatus(null), 4000);
    },
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isValid = voterId.trim().length > 0 && voterName.trim().length > 0;

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
      const maxSize = 10 * 1024 * 1024;
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
    clearErrors();
    setSubmitStatus(null);

    const payload = {
      id: `${campaignId}_${voterId.trim()}_${Date.now()}`,
      voter_id: voterId.trim(),
      voter_name: voterName.trim(),
      sentiment,
      notes: notes.trim(),
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
      gps_accuracy: gpsAccuracy ?? undefined,
      media_urls: mediaUrls,
      campaign_id: campaignId,
    };

    if (isOnline) {
      const success = await submit(payload);
      if (!success) {
        // If online submit fails, queue it
        await queueItem(payload, "canvass");
        setSubmitStatus({
          type: "queued",
          message: "Submit failed. Entry saved to offline queue.",
        });
        setTimeout(() => setSubmitStatus(null), 4000);
      }
    } else {
      await queueItem(payload, "canvass");
      setSubmitStatus({
        type: "queued",
        message: "You are offline. Entry queued for sync.",
      });
      setTimeout(() => setSubmitStatus(null), 4000);
      // Clear form after queueing
      setVoterId("");
      setVoterName("");
      setSentiment("UNDECIDED");
      setNotes("");
      setLatitude(null);
      setLongitude(null);
      setGpsAccuracy(null);
      setMediaUrls([]);
    }
  };

  return (
    <div style={{ padding: "16px 16px 32px" }}>
      <OfflineStatusBar />

      <Card elevation={Elevation.ONE} style={{ borderRadius: 0, marginTop: 16 }}>
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: 18,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>📋</span> Canvass Entry
        </h3>

        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 12 }}>
            {error}
          </Callout>
        )}

        {submitStatus && (
          <Callout
            intent={submitStatus.type === "success" ? Intent.SUCCESS : Intent.WARNING}
            icon={submitStatus.type === "success" ? "tick" : "offline"}
            style={{ marginBottom: 12 }}
          >
            {submitStatus.message}
          </Callout>
        )}

        {!isOnline && (
          <Callout intent={Intent.WARNING} icon="offline" style={{ marginBottom: 12 }}>
            You are currently offline. Entries will be queued and synced automatically when
            connectivity is restored.
          </Callout>
        )}

        {/* Voter selection */}
        <FormGroup label="Voter ID" labelFor="canvass-voter-id" labelInfo="(required)">
          <InputGroup
            id="canvass-voter-id"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            placeholder="Enter or scan voter ID"
            style={{
              borderRadius: 0,
              minHeight: 48,
              fontSize: 16,
            }}
            autoComplete="off"
          />
        </FormGroup>

        <FormGroup label="Voter Name" labelFor="canvass-voter-name" labelInfo="(required)">
          <InputGroup
            id="canvass-voter-name"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            placeholder="Voter full name"
            style={{
              borderRadius: 0,
              minHeight: 48,
              fontSize: 16,
            }}
            autoComplete="off"
          />
        </FormGroup>

        {/* Sentiment */}
        <FormGroup label="Sentiment" labelFor="canvass-sentiment">
          <HTMLSelect
            id="canvass-sentiment"
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value as SentimentLevel)}
            options={SENTIMENT_OPTIONS}
            fill
            style={{
              borderRadius: 0,
              minHeight: 48,
              fontSize: 16,
            }}
          />
          <div style={{ marginTop: 6 }}>
            <SentimentBadge sentiment={sentiment} />
          </div>
        </FormGroup>

        {/* Notes */}
        <FormGroup label="Notes" labelFor="canvass-notes">
          <TextArea
            id="canvass-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Conversation notes, observations, follow-up actions…"
            fill
            rows={5}
            style={{
              borderRadius: 0,
              fontSize: 16,
              resize: "vertical",
              minHeight: 120,
            }}
          />
        </FormGroup>

        {/* GPS */}
        <FormGroup label="GPS Location">
          <GPSCaptureButton onCapture={handleGPSSuccess} disabled={submitting} />
          {(latitude != null && longitude != null) && (
            <Tag minimal style={{ marginTop: 8, fontSize: 12 }}>
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
              {gpsAccuracy != null && ` (±${Math.round(gpsAccuracy)}m)`}
            </Tag>
          )}
        </FormGroup>

        {/* Photos */}
        <FormGroup label="Photos / Videos">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            capture="environment"
            onChange={handleFileChange}
            disabled={submitting}
            aria-label="Capture or select photos and videos"
            style={{
              marginBottom: 8,
              minHeight: 48,
              fontSize: 16,
            }}
          />
          {fileError && (
            <Callout intent={Intent.WARNING} icon="warning-sign" style={{ marginBottom: 8, fontSize: 12 }}>
              {fileError}
            </Callout>
          )}
          {mediaUrls.length > 0 && (
            <MediaGallery
              mediaUrls={mediaUrls}
              altText="Canvass media"
              onRemove={handleRemoveMedia}
            />
          )}
        </FormGroup>

        {/* Submit */}
        <Button
          intent={Intent.PRIMARY}
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          loading={submitting}
          icon={isOnline ? "send-message" : "offline"}
          fill
          style={{
            minHeight: 48,
            borderRadius: 0,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {submitting ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Spinner size={16} />
              Submitting…
            </span>
          ) : isOnline ? (
            "Submit Canvass Entry"
          ) : (
            "Queue for Offline Sync"
          )}
        </Button>
      </Card>
    </div>
  );
}
