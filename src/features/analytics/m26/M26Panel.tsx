import { Spinner, NonIdealState, Button, Classes, Tooltip, Icon } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import { MarginRangeBar, MarginTrendLine } from "./components/MarginRangeChart";
import { useM26 } from "./hooks/useM26";

const BLUE_40 = "#78a9ff";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

// Demo defaults — in production these come from campaign configuration
const OUR_CANDIDATE = "Candidate A";
const OPPONENT_CANDIDATE = "Candidate B";

interface Props {
  campaignId: string;
  onRemove?: () => void;
  ourCandidate?: string;
  opponentCandidate?: string;
}

export default function M26Panel({
  campaignId,
  onRemove,
  ourCandidate = OUR_CANDIDATE,
  opponentCandidate = OPPONENT_CANDIDATE,
}: Props) {
  const { data, loading, error, refetch } = useM26(campaignId, ourCandidate, opponentCandidate);

  const hasMoe = data?.margin_of_error != null;
  const pollsWithMoe = data?.trend.filter((t) => t.margin_of_error != null).length ?? 0;
  const totalPolls = data?.trend.length ?? 0;

  const marginColor =
    data?.margin == null ? GRAY_50 : data.margin > 0 ? BLUE_40 : data.margin < 0 ? RED_40 : GRAY_50;

  return (
    <Panel
      id="m26"
      name="M26 — Margin of Victory / Defeat"
      size="medium"
      onRemove={onRemove}
      actions={<Button icon="refresh" minimal small onClick={refetch} title="Refresh" />}
    >
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
          <Spinner size={24} />
        </div>
      )}
      {!loading && error && (
        <NonIdealState icon="error" title="Failed to load" description={error} />
      )}
      {!loading && !error && !campaignId && (
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view margin of victory data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {/* KPI strip */}
          <div
            style={{
              height: 72,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderBottom: "1px solid #393939",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{ fontSize: 32, fontWeight: 400, color: marginColor, lineHeight: 1 }}
              >
                {data.margin != null
                  ? `${data.margin > 0 ? "+" : ""}${data.margin}%`
                  : "—"}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                margin ({Math.round(data.confidence_level * 100)}% CI
                {hasMoe ? ` ±${data.margin_of_error}%` : ""})
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>
                <span style={{ color: BLUE_40 }}>{ourCandidate}:</span>{" "}
                {data.our_share_pct != null ? `${data.our_share_pct}%` : "—"}
              </div>
              <div>
                <span style={{ color: GRAY_50 }}>{opponentCandidate}:</span>{" "}
                {data.opponent_share_pct != null ? `${data.opponent_share_pct}%` : "—"}
              </div>
            </div>
            {/* Data quality summary */}
            {totalPolls > 0 && (
              <div style={{ marginLeft: "auto", fontSize: 11, color: GRAY_50 }}>
                <Tooltip
                  content={`${pollsWithMoe} of ${totalPolls} polls have confidence intervals`}
                  placement="top"
                >
                  <span style={{ cursor: "help" }}>
                    <Icon
                      icon={pollsWithMoe === totalPolls ? "tick-circle" : "warning-sign"}
                      color={pollsWithMoe === totalPolls ? "#42be65" : "#f1c21b"}
                      size={14}
                    />
                  </span>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Range bar */}
          <div style={{ padding: "12px 16px 0" }}>
            <MarginRangeBar
              margin={data.margin}
              lowerBound={data.lower_bound}
              upperBound={data.upper_bound}
              hasMoe={hasMoe}
              ourCandidate={ourCandidate}
              opponentCandidate={opponentCandidate}
            />
            {!hasMoe && (
              <div style={{ fontSize: 11, color: "#f1c21b", marginTop: 4 }}>
                Margin of error unavailable — poll sample size not recorded.
              </div>
            )}
          </div>

          {/* Trend line (only when ≥2 polls) */}
          {data.trend.length >= 2 && (
            <div style={{ padding: "0 16px 8px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 4 }}>
                Margin trend across polls
              </div>
              <MarginTrendLine
                trend={data.trend}
                ourCandidate={ourCandidate}
                opponentCandidate={opponentCandidate}
              />
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
