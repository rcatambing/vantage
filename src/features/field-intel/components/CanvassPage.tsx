import { useParams } from "react-router";
import { NonIdealState, Card, Elevation, Tag, Icon } from "@blueprintjs/core";
import { useState } from "react";
import CanvassForm from "./CanvassForm";
import OfflineStatusBar from "./OfflineStatusBar";
import SentimentBadge from "./SentimentBadge";
import type { CanvassEntry } from "../types";

// Placeholder recent entries — in production this would come from an API hook
const PLACEHOLDER_ENTRIES: CanvassEntry[] = [
  {
    id: "c1",
    voter_id: "V-1001",
    voter_name: "Maria Santos",
    sentiment: "SUPPORTER",
    notes: "Positive response to education platform. Wants to volunteer.",
    latitude: 14.5995,
    longitude: 120.9842,
    gps_accuracy: 5,
    media_urls: [],
    campaign_id: "1",
    created_at: "2026-05-03T10:30:00Z",
  },
  {
    id: "c2",
    voter_id: "V-1002",
    voter_name: "Juan Dela Cruz",
    sentiment: "UNDECIDED",
    notes: "Concerned about traffic infrastructure. Needs more info.",
    latitude: null,
    longitude: null,
    gps_accuracy: null,
    media_urls: [],
    campaign_id: "1",
    created_at: "2026-05-03T09:15:00Z",
  },
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function CanvassPage() {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [entries] = useState<CanvassEntry[]>(PLACEHOLDER_ENTRIES);

  if (!campaignId) {
    return (
      <div style={{ padding: 24 }}>
        <NonIdealState
          icon="error"
          title="No Campaign Selected"
          description="Please select a campaign to begin canvassing."
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <OfflineStatusBar />

      <CanvassForm campaignId={campaignId} />

      {/* Recent entries */}
      <div style={{ marginTop: 24 }}>
        <h3
          style={{
            margin: "0 0 12px",
            fontSize: 16,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon icon="history" size={16} /> Recent Canvass Entries
        </h3>

        {entries.length === 0 ? (
          <NonIdealState
            icon="inbox"
            title="No entries yet"
            description="Submit your first canvass entry above."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {entries.map((entry) => (
              <Card key={entry.id} elevation={Elevation.ZERO} style={{ borderRadius: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong style={{ fontSize: 14 }}>{entry.voter_name}</strong>
                      <Tag minimal style={{ fontSize: 11 }}>
                        {entry.voter_id}
                      </Tag>
                      <SentimentBadge sentiment={entry.sentiment} />
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--cds-text-primary)",
                        lineHeight: 1.5,
                        marginBottom: 6,
                      }}
                    >
                      {entry.notes}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 11,
                        color: "var(--cds-text-secondary)",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>{formatDate(entry.created_at)}</span>
                      {entry.latitude != null && entry.longitude != null && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Icon icon="locate" size={11} />
                          GPS captured
                        </span>
                      )}
                      {entry.media_urls.length > 0 && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Icon icon="media" size={11} />
                          {entry.media_urls.length} media
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
