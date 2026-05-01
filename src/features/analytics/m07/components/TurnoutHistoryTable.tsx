import { HTMLTable, HTMLSelect, InputGroup, Button, Tag, Intent, Spinner, Callout, Classes } from "@blueprintjs/core";
import type { ElectionType, TurnoutSource, ConfidenceTier, FallbackLevel } from "../types";
import { useM07History } from "../hooks/useM07History";

const ELECTION_TYPES: ElectionType[] = ["NATIONAL", "LOCAL", "BARANGAY", "SPECIAL"];

const CONFIDENCE_INTENT: Record<ConfidenceTier, Intent> = {
  HIGH: Intent.SUCCESS,
  MEDIUM: Intent.WARNING,
  LOW: Intent.DANGER,
};

const FALLBACK_LABELS: Record<FallbackLevel, string> = {
  EXACT_CYCLE: "Exact Cycle",
  PRIOR_CYCLE: "Prior Cycle",
  PARENT_DISTRICT: "Parent District",
  NATIONAL_DEFAULT: "National Default",
  NONE: "None",
};

const fmtPct = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const fmtDate = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" });

interface Props {
  campaignId: string;
}

export default function TurnoutHistoryTable({ campaignId }: Props) {
  const { items, total, totalPages, loading, error, filters, applyFilters, goToPage, refetch } =
    useM07History(campaignId);

  const handleElectionType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyFilters({ election_type: (e.target.value as ElectionType) || undefined });
  };

  const handleYearFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    applyFilters({ year_from: isNaN(v) ? undefined : v });
  };

  const handleYearTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    applyFilters({ year_to: isNaN(v) ? undefined : v });
  };

  const handleDistrictId = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFilters({ district_id: e.target.value || undefined });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <span
        id="m07-provenance-coming-soon"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Provenance detail drawer is coming soon.
      </span>
      {/* Filter bar */}
      <div
        role="search"
        aria-label="Historical data filters"
        style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
      >
        <HTMLSelect
          aria-label="Election type filter"
          value={filters.election_type ?? ""}
          onChange={handleElectionType}
          style={{ fontSize: 12 }}
        >
          <option value="">All election types</option>
          {ELECTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </HTMLSelect>

        <InputGroup
          aria-label="Year from"
          placeholder="Year from"
          type="number"
          style={{ width: 100, fontSize: 12 }}
          defaultValue={filters.year_from?.toString() ?? ""}
          onBlur={handleYearFrom}
        />
        <InputGroup
          aria-label="Year to"
          placeholder="Year to"
          type="number"
          style={{ width: 100, fontSize: 12 }}
          defaultValue={filters.year_to?.toString() ?? ""}
          onBlur={handleYearTo}
        />
        <InputGroup
          aria-label="District ID filter"
          placeholder="District ID"
          style={{ width: 220, fontSize: 12 }}
          defaultValue={filters.district_id ?? ""}
          onBlur={handleDistrictId}
        />

        <Button icon="refresh" minimal small aria-label="Refresh history" onClick={refetch} />
        <span className={Classes.TEXT_MUTED} style={{ fontSize: 11, marginLeft: "auto" }}>
          {total} record{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Content */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <Spinner size={24} aria-label="Loading historical data" />
        </div>
      )}

      {error && !loading && (
        <Callout intent={Intent.DANGER} icon="error" title="Failed to load history">
          {error}{" "}
          <Button minimal small text="Retry" onClick={refetch} />
        </Callout>
      )}

      {!loading && !error && items.length === 0 && (
        <Callout intent={Intent.NONE} icon="info-sign">
          No historical turnout records found. Upload a CSV or XLSX file to add data.
        </Callout>
      )}

      {!loading && !error && items.length > 0 && (
        <div style={{ flex: 1, overflow: "auto" }}>
          <HTMLTable
            striped
            interactive
            bordered
            compact
            style={{ width: "100%", fontSize: 12 }}
            aria-label="Historical turnout data"
          >
            <thead>
              <tr>
                <th scope="col">District</th>
                <th scope="col">Election Type</th>
                <th scope="col">Cycle Year</th>
                <th scope="col">Turnout Rate</th>
                <th scope="col">Cycle Count</th>
                <th scope="col">Source</th>
                <th scope="col">Quality Score</th>
                <th scope="col">Fallback</th>
                <th scope="col">As-of</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const qualityScore = row.quality_score;
                const confidenceTier: ConfidenceTier =
                  qualityScore == null
                    ? "LOW"
                    : qualityScore >= 75
                    ? "HIGH"
                    : qualityScore >= 40
                    ? "MEDIUM"
                    : "LOW";

                return (
                  <tr key={row.id}>
                    <td>
                      <code style={{ fontSize: 11 }}>{row.district_id}</code>
                    </td>
                    <td>{row.election_type}</td>
                    <td>{row.election_cycle_year}</td>
                    <td>
                      <Tag
                        minimal
                        intent={CONFIDENCE_INTENT[confidenceTier]}
                        aria-label={`${fmtPct.format(row.turnout_rate)}%, ${confidenceTier} confidence`}
                      >
                        {fmtPct.format(row.turnout_rate)}%
                      </Tag>
                    </td>
                    <td>{row.turnout_count?.toLocaleString("en-PH") ?? "—"}</td>
                    <td>
                      <SourceBadge source={row.historical_turnout_source} />
                    </td>
                    <td>
                      {qualityScore != null ? (
                        <Tag minimal intent={CONFIDENCE_INTENT[confidenceTier]}>
                          {fmtPct.format(qualityScore)}
                        </Tag>
                      ) : (
                        <span className={Classes.TEXT_MUTED}>—</span>
                      )}
                    </td>
                    <td>
                      {row.revision_reason ? (
                        <span className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
                          {FALLBACK_LABELS[row.revision_reason as FallbackLevel] ?? row.revision_reason}
                        </span>
                      ) : (
                        <span className={Classes.TEXT_MUTED}>—</span>
                      )}
                    </td>
                    <td>
                      {row.source_observed_at
                        ? fmtDate.format(new Date(row.source_observed_at))
                        : <span className={Classes.TEXT_MUTED}>—</span>}
                    </td>
                    <td>
                      <Button
                        minimal
                        small
                        icon="eye-open"
                        text="Provenance"
                        aria-label={`View provenance for district ${row.district_id}`}
                        aria-disabled="true"
                        aria-describedby="m07-provenance-coming-soon"
                        onClick={(event) => {
                          event.preventDefault();
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </HTMLTable>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{ display: "flex", gap: 4, justifyContent: "flex-end", alignItems: "center" }}
          aria-label="Pagination"
        >
          <Button
            minimal
            small
            icon="chevron-left"
            disabled={filters.page <= 1}
            aria-label="Previous page"
            onClick={() => goToPage(filters.page - 1)}
          />
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
            Page {filters.page} of {totalPages}
          </span>
          <Button
            minimal
            small
            icon="chevron-right"
            disabled={filters.page >= totalPages}
            aria-label="Next page"
            onClick={() => goToPage(filters.page + 1)}
          />
        </div>
      )}
    </div>
  );
}

function SourceBadge({ source }: { source: TurnoutSource }) {
  const intentMap: Record<TurnoutSource, Intent> = {
    OFFICIAL: Intent.SUCCESS,
    PARTNER: Intent.PRIMARY,
    ANALYST_INPUT: Intent.WARNING,
    ROLLED_UP: Intent.NONE,
  };
  return (
    <Tag minimal intent={intentMap[source]}>
      {source.replace(/_/g, " ")}
    </Tag>
  );
}
