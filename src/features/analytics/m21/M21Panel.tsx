import { useState } from "react";
import { Spinner, NonIdealState, Button, Classes, Tag } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import SentimentLineChart from "./components/SentimentLineChart";
import { useM21 } from "./hooks/useM21";

const BUCKET_OPTIONS = ["day", "week", "month"] as const;
type Bucket = (typeof BUCKET_OPTIONS)[number];

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M21Panel({ campaignId, onRemove }: Props) {
  const [bucket, setBucket] = useState<Bucket>("week");

  const { data, loading, error, refetch } = useM21(campaignId, bucket);

  const bucketActions = (
    <div style={{ display: "flex", gap: 4 }}>
      {BUCKET_OPTIONS.map((b) => (
        <Tag
          key={b}
          interactive
          minimal={bucket !== b}
          intent={bucket === b ? "primary" : "none"}
          onClick={() => setBucket(b)}
          style={{ cursor: "pointer", textTransform: "capitalize" }}
        >
          {b}
        </Tag>
      ))}
    </div>
  );

  return (
    <Panel
      id="m21"
      name="M21 — Sentiment Trend Over Time"
      size="large"
      onRemove={onRemove}
      actions={
        <>
          {bucketActions}
          <Button icon="refresh" minimal small onClick={refetch} title="Refresh" />
        </>
      }
    >
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
          <Spinner size={24} />
        </div>
      )}
      {!loading && error && (
        <NonIdealState
          icon="error"
          title="Failed to load"
          description={error}
        />
      )}
      {!loading && !error && !campaignId && (
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view sentiment trend data.
        </div>
      )}
      {!loading && !error && data && (
        <SentimentLineChart trend={data.trend} />
      )}
    </Panel>
  );
}
