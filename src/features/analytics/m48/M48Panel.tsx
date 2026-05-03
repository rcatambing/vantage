import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import { useM48 } from "./hooks/useM48";

const BLUE_60 = "#0f62fe";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M48Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM48(campaignId);

  return (
    <Panel
      id="m48"
      name="M48 — Feed Engagement Quality"
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
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
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
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Engagement Score</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: BLUE_60 }}>{data.score_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Avg Rating</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.avg_post_rating ?? "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Comments / Post</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.comments_per_post ?? "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Posts</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_posts}</div>
            </div>
          </div>
          {data.top_posts.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--cds-text-secondary)" }}>Top Rated Posts</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th style={{ textAlign: "right" }}>Rating</th>
                    <th style={{ textAlign: "right" }}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_posts.map((post) => (
                    <tr key={post.post_id}>
                      <td>{post.title}</td>
                      <td>{post.author}</td>
                      <td style={{ textAlign: "right" }}>{post.avg_rating ?? "—"}</td>
                      <td style={{ textAlign: "right" }}>{post.comment_count}</td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
