import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import CandidateBarChart from "./components/CandidateBarChart";
import { useM25 } from "./hooks/useM25";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

// Demo default — in a real deployment this would come from campaign configuration
const OUR_CANDIDATE = "Candidate A";
const CANDIDATES = "Candidate A,Candidate B,Candidate C,Undecided";

interface Props {
  campaignId: string;
  onRemove?: () => void;
  ourCandidate?: string;
  candidates?: string;
}

export default function M25Panel({
  campaignId,
  onRemove,
  ourCandidate = OUR_CANDIDATE,
  candidates = CANDIDATES,
}: Props) {
  const { data, loading, error, refetch } = useM25(campaignId, ourCandidate, candidates);

  // Find top opponent (first in rankings who is not ours)
  const topOpponent = data?.rankings.find((r) => r.candidate !== ourCandidate);

  return (
    <Panel
      id="m25"
      name="M25 — Head-to-Head Matchup"
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
          Select a campaign to view head-to-head matchup data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {/* KPI strip — our candidate + top opponent side by side */}
          <div
            style={{
              height: 72,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderBottom: "1px solid #393939",
              gap: 32,
            }}
          >
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.our_share_pct != null ? `${data.our_share_pct}%` : "—"}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                {ourCandidate}
              </div>
            </div>
            {topOpponent && (
              <div>
                <div style={{ fontSize: 28, fontWeight: 400, color: GRAY_50, lineHeight: 1 }}>
                  {topOpponent.share_pct != null ? `${topOpponent.share_pct}%` : "—"}
                </div>
                <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                  {topOpponent.candidate}
                </div>
              </div>
            )}
            <div style={{ marginLeft: "auto", fontSize: 11, color: "#6f6f6f" }}>
              {data.total_responses.toLocaleString()} responses
            </div>
          </div>

          {/* Candidate bar chart */}
          {data.rankings.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <CandidateBarChart rankings={data.rankings} ourCandidate={ourCandidate} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No matchup response data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
