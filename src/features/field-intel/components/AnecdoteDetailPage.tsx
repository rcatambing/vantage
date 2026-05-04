import { useParams } from "react-router";
import {
  Button,
  Spinner,
  Callout,
  Intent,
  Tag,
  Card,
  Elevation,
  Icon,
} from "@blueprintjs/core";
import { useAnecdote } from "../hooks/useIntel";
import ClassificationTag from "./ClassificationTag";
import MediaGallery from "./MediaGallery";

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

export default function AnecdoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { anecdote, loading, error, refetch } = useAnecdote(id);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
        <Spinner />
      </div>
    );
  }

  if (error || !anecdote) {
    return (
      <div style={{ padding: 24 }}>
        <Callout intent={Intent.DANGER} icon="error" title="Error">
          {error ?? "Anecdote not found."}
        </Callout>
        <Button icon="refresh" text="Retry" onClick={refetch} style={{ marginTop: 12 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600 }}>
            {anecdote.title}
          </h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <ClassificationTag classification={anecdote.classification} />
            <Tag minimal style={{ fontSize: 12 }}>
              <Icon icon="person" size={12} style={{ marginRight: 4 }} />
              {anecdote.author_name}
            </Tag>
            {anecdote.district_name && (
              <Tag minimal style={{ fontSize: 12 }}>
                <Icon icon="map-marker" size={12} style={{ marginRight: 4 }} />
                {anecdote.district_name}
              </Tag>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button minimal small icon="refresh" text="Refresh" onClick={refetch} />
        </div>
      </div>

      {/* Content */}
      <Card elevation={Elevation.ONE} style={{ marginBottom: 20, borderRadius: 0 }}>
        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
            fontSize: 14,
            color: "var(--cds-text-primary)",
          }}
        >
          {anecdote.content}
        </div>
      </Card>

      {/* Metadata */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <Card elevation={Elevation.ZERO} style={{ borderRadius: 0 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--cds-text-secondary)", marginBottom: 4 }}>
            Created
          </div>
          <div style={{ fontSize: 13 }}>{formatDate(anecdote.created_at)}</div>
        </Card>
        <Card elevation={Elevation.ZERO} style={{ borderRadius: 0 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--cds-text-secondary)", marginBottom: 4 }}>
            Updated
          </div>
          <div style={{ fontSize: 13 }}>{formatDate(anecdote.updated_at)}</div>
        </Card>
        <Card elevation={Elevation.ZERO} style={{ borderRadius: 0 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--cds-text-secondary)", marginBottom: 4 }}>
            Campaign
          </div>
          <div style={{ fontSize: 13 }}>{anecdote.campaign_id}</div>
        </Card>
      </div>

      {/* Location */}
      {(anecdote.latitude != null && anecdote.longitude != null) && (
        <Card elevation={Elevation.ZERO} style={{ marginBottom: 20, borderRadius: 0 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--cds-text-secondary)", marginBottom: 8 }}>
            Location
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              flexWrap: "wrap",
            }}
          >
            <Icon icon="locate" size={14} color="var(--cds-interactive)" />
            <span>
              Lat: {anecdote.latitude.toFixed(6)}, Lng: {anecdote.longitude.toFixed(6)}
            </span>
            {anecdote.gps_accuracy != null && (
              <Tag minimal style={{ fontSize: 11 }}>
                ±{Math.round(anecdote.gps_accuracy)}m accuracy
              </Tag>
            )}
          </div>
          {/* Placeholder map */}
          <div
            style={{
              marginTop: 12,
              height: 200,
              background: "var(--cds-layer-01)",
              border: "1px solid var(--cds-border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--cds-text-secondary)",
              fontSize: 13,
            }}
          >
            <Icon icon="map" size={32} style={{ marginRight: 8, opacity: 0.5 }} />
            Map view placeholder
          </div>
        </Card>
      )}

      {/* Media */}
      {anecdote.media_urls.length > 0 && (
        <Card elevation={Elevation.ZERO} style={{ marginBottom: 20, borderRadius: 0 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--cds-text-secondary)", marginBottom: 8 }}>
            Media ({anecdote.media_urls.length})
          </div>
          <MediaGallery mediaUrls={anecdote.media_urls} altText={anecdote.title} />
        </Card>
      )}

      {/* Comments placeholder */}
      <Card elevation={Elevation.ZERO} style={{ borderRadius: 0 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--cds-text-secondary)", marginBottom: 8 }}>
          Comments
        </div>
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "var(--cds-text-secondary)",
            fontSize: 13,
          }}
        >
          <Icon icon="chat" size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
          <div>Comments section coming soon.</div>
        </div>
      </Card>
    </div>
  );
}
