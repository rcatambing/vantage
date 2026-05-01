import { useState, useMemo } from "react";
import {
  Button,
  Intent,
  Tag,
  Callout,
  Spinner,
  Tabs,
  Tab,
  HTMLSelect,
  Classes,
} from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import TurnoutHistoryTable from "./components/TurnoutHistoryTable";
import TurnoutUploadWizard from "./components/TurnoutUploadWizard";
import { useM07Estimate, type M07EstimateFilters } from "./hooks/useM07Estimate";
import type { ConfidenceTier, AvailabilityStatus, ElectionType, M07EstimateItem } from "./types";

const PANEL_ID = "m07-TEP";
const PANEL_NAME = "Voter Turnout Estimate";

const ELECTION_TYPES: ElectionType[] = ["NATIONAL", "LOCAL", "BARANGAY", "SPECIAL"];

const CONFIDENCE_COLOR: Record<ConfidenceTier, string> = {
  HIGH: "#198038",
  MEDIUM: "#946200",
  LOW: "#da1e28",
};

const CONFIDENCE_PATTERN: Record<ConfidenceTier, string> = {
  HIGH: "none",
  MEDIUM:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0) 0, rgba(255,255,255,0) 4px, rgba(0,0,0,0.14) 4px, rgba(0,0,0,0.14) 5px)",
  LOW:
    "repeating-linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0) 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)",
};

const CONFIDENCE_INTENT: Record<ConfidenceTier, Intent> = {
  HIGH: Intent.SUCCESS,
  MEDIUM: Intent.WARNING,
  LOW: Intent.DANGER,
};

const AVAILABILITY_INTENT: Record<AvailabilityStatus, Intent> = {
  AVAILABLE: Intent.SUCCESS,
  LOW_CONFIDENCE: Intent.WARNING,
  UNAVAILABLE: Intent.DANGER,
};

const fmtPct = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const fmtNum = new Intl.NumberFormat("en-PH");
const fmtDate = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" });

function isStale(dataAsOf: string): boolean {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(dataAsOf) < sevenDaysAgo;
}

interface Props {
  campaignId: string;
}

export default function TurnoutEstimatePanel({ campaignId }: Props) {
  const [isWizardOpen, setWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"estimate" | "history">("estimate");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const [filters, setFilters] = useState<M07EstimateFilters>({});
  const { data, loading, error, refetch } = useM07Estimate(campaignId, filters);

  const availableCycles = data?.meta?.available_cycles ?? [];

  const aggregateRate = useMemo(() => {
    if (!data?.items?.length) return null;
    const available = data.items.filter(
      (i) => i.availability_status !== "UNAVAILABLE" && i.turnout_estimate_rate != null
    );
    if (!available.length) return null;
    const sum = available.reduce((acc, i) => acc + (i.turnout_estimate_rate ?? 0), 0);
    return sum / available.length;
  }, [data]);

  const oldestDataAsOf = useMemo(() => {
    if (!data?.items?.length) return null;
    return data.items.reduce<string | null>((oldest, item) => {
      if (!oldest) return item.data_as_of;
      return item.data_as_of < oldest ? item.data_as_of : oldest;
    }, null);
  }, [data]);

  const dataIsStale = oldestDataAsOf ? isStale(oldestDataAsOf) : false;

  const uploadAction = (
    <Button
      icon="upload"
      small
      minimal
      text="Upload Historical Data"
      aria-label="Upload historical turnout data"
      onClick={() => setWizardOpen(true)}
    />
  );

  return (
    <>
      <Panel id={PANEL_ID} name={PANEL_NAME} size="large" actions={uploadAction}>
        <Tabs
          id="m07-tabs"
          selectedTabId={activeTab}
          onChange={(id) => setActiveTab(id as "estimate" | "history")}
          renderActiveTabPanelOnly
          animate={false}
          aria-label="Turnout estimate views"
        >
          <Tab
            id="estimate"
            title="Estimate"
            panel={
              <EstimateView
                data={data?.items ?? []}
                loading={loading}
                error={error}
                filters={filters}
                availableCycles={availableCycles}
                aggregateRate={aggregateRate}
                oldestDataAsOf={oldestDataAsOf}
                dataIsStale={dataIsStale}
                onFilterChange={(next) => setFilters((f) => ({ ...f, ...next }))}
                onRetry={refetch}
              />
            }
          />
          <Tab
            id="history"
            title="Historical Data"
            panel={
              <TurnoutHistoryTable
                key={historyRefreshKey}
                campaignId={campaignId}
              />
            }
          />
        </Tabs>
      </Panel>

      <TurnoutUploadWizard
        isOpen={isWizardOpen}
        campaignId={campaignId}
        onClose={() => setWizardOpen(false)}
        onSuccess={() => {
          setHistoryRefreshKey((k) => k + 1);
          setWizardOpen(false);
        }}
      />
    </>
  );
}

/* ─── Estimate tab view ──────────────────────────────────────────────────── */

interface EstimateViewProps {
  data: M07EstimateItem[];
  loading: boolean;
  error: string | null;
  filters: M07EstimateFilters;
  availableCycles: number[];
  aggregateRate: number | null;
  oldestDataAsOf: string | null;
  dataIsStale: boolean;
  onFilterChange: (next: Partial<M07EstimateFilters>) => void;
  onRetry: () => void;
}

function EstimateView({
  data,
  loading,
  error,
  filters,
  availableCycles,
  aggregateRate,
  oldestDataAsOf,
  dataIsStale,
  onFilterChange,
  onRetry,
}: EstimateViewProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
      {/* Filter bar */}
      <div
        role="search"
        aria-label="Estimate filters"
        style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
      >
        <HTMLSelect
          aria-label="Election type"
          value={filters.election_type ?? ""}
          onChange={(e) =>
            onFilterChange({ election_type: (e.target.value as ElectionType) || undefined })
          }
          style={{ fontSize: 12 }}
        >
          <option value="">All election types</option>
          {ELECTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </HTMLSelect>

        {availableCycles.length > 0 && (
          <HTMLSelect
            aria-label="Election cycle"
            value={filters.election_cycle?.toString() ?? ""}
            onChange={(e) =>
              onFilterChange({
                election_cycle: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            style={{ fontSize: 12 }}
          >
            <option value="">Latest cycle</option>
            {availableCycles.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </HTMLSelect>
        )}

        <Button
          icon="refresh"
          minimal
          small
          aria-label="Refresh turnout estimate"
          onClick={onRetry}
        />

        {oldestDataAsOf && (
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 11, marginLeft: "auto" }}>
            Data as of {fmtDate.format(new Date(oldestDataAsOf))}
          </span>
        )}
      </div>

      {dataIsStale && (
        <Tag intent={Intent.WARNING} icon="time" minimal aria-label="Data may be outdated">
          Data may be outdated (last updated &gt;7 days ago)
        </Tag>
      )}

      {/* KPI summary */}
      {loading && (
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0" }}>
          <SkeletonBlock width={120} height={48} />
          <SkeletonBlock width={200} height={48} />
        </div>
      )}

      <div role="alert" aria-live="assertive" aria-atomic="true">
        {error && !loading && (
          <Callout intent={Intent.DANGER} icon="error" title="Failed to load estimate">
            {error}{" "}
            <Button minimal small text="Retry" onClick={onRetry} />
          </Callout>
        )}
      </div>

      {!loading && !error && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* KPI card */}
          <div
            style={{
              minWidth: 140,
              padding: 12,
              background: "var(--cds-layer-02, #f4f4f4)",
              borderRadius: 2,
            }}
            aria-label="Campaign average turnout estimate"
          >
            {aggregateRate != null ? (
              <>
                <div style={{ fontSize: 28, fontWeight: 300 }}>
                  {fmtPct.format(aggregateRate)}%
                </div>
                <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Avg Turnout Estimate
                </div>
                <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, marginTop: 4 }}>
                  {fmtNum.format(data.filter((i) => i.availability_status !== "UNAVAILABLE").length)} districts
                </div>
              </>
            ) : (
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>No data available</div>
            )}
          </div>

          {/* Confidence legend */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}
            aria-label="Confidence tier summary"
          >
            {(["HIGH", "MEDIUM", "LOW"] as ConfidenceTier[]).map((tier) => {
              const count = data.filter((i) => i.confidence_tier === tier).length;
              return (
                <div key={tier} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Tag minimal intent={CONFIDENCE_INTENT[tier]} style={{ fontSize: 11, width: 64, textAlign: "center" }}>
                    {tier}
                  </Tag>
                  <span>{count} district{count !== 1 ? "s" : ""}</span>
                </div>
              );
            })}
            {data.filter((i) => i.availability_status === "UNAVAILABLE").length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Tag minimal intent={Intent.NONE} style={{ fontSize: 11, width: 64 }}>
                  NO DATA
                </Tag>
                <span>
                  {data.filter((i) => i.availability_status === "UNAVAILABLE").length} district
                  {data.filter((i) => i.availability_status === "UNAVAILABLE").length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bar chart */}
      {!loading && !error && data.length === 0 && (
        <Callout intent={Intent.NONE} icon="info-sign">
          No turnout estimate data found. Try adjusting the election type or cycle filter, or
          upload historical data.
        </Callout>
      )}

      {!loading && !error && data.length > 0 && (
        <TurnoutBarChart items={data} />
      )}
    </div>
  );
}

/* ─── Turnout bar chart ──────────────────────────────────────────────────── */

function TurnoutBarChart({ items }: { items: M07EstimateItem[] }) {
  const maxRate = 100; // rates are percentages, cap at 100

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: 120 }}
      role="figure"
      aria-label={`Turnout estimate bar chart, ${items.length} districts`}
    >
      <table
        aria-label="Turnout estimate data table"
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
        <thead>
          <tr>
            <th>District</th>
            <th>Rate</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`sr-${item.district_id}`}>
              <td>{item.district_id}</td>
              <td>{item.turnout_estimate_rate == null ? "No data" : `${fmtPct.format(item.turnout_estimate_rate)}%`}</td>
              <td>{item.availability_status === "UNAVAILABLE" ? "UNAVAILABLE" : item.confidence_tier}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          flex: 1,
          minHeight: 100,
          paddingBottom: 4,
        }}
      >
        {items.map((item) => {
          const noData = item.availability_status === "UNAVAILABLE";
          const rate = item.turnout_estimate_rate;
          const barHeightPct = noData || rate == null ? 0 : (rate / maxRate) * 100;
          const color = CONFIDENCE_COLOR[item.confidence_tier];
          const label = noData
            ? `District ${item.district_id}: No data`
            : `District ${item.district_id}: ${fmtPct.format(rate!)}% (${item.confidence_tier} confidence)`;

          return (
            <div
              key={item.district_id}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch", minWidth: 8 }}
            >
              {noData ? (
                <div
                  aria-label={label}
                  title={label}
                  style={{
                    flex: 1,
                    minHeight: 24,
                    background:
                      "repeating-linear-gradient(45deg, #e8e8e8, #e8e8e8 5px, #f4f4f4 5px, #f4f4f4 10px)",
                    border: "1px dashed #c6c6c6",
                  }}
                />
              ) : (
                <div
                  aria-label={label}
                  title={label}
                  style={{
                    alignSelf: "flex-end",
                    width: "100%",
                    height: `${barHeightPct}%`,
                    minHeight: 4,
                    backgroundColor: color,
                    backgroundImage: CONFIDENCE_PATTERN[item.confidence_tier],
                    transition: "height 0.3s ease",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 10, flexWrap: "wrap" }}
        aria-label="Chart legend"
      >
        {(["HIGH", "MEDIUM", "LOW"] as ConfidenceTier[]).map((tier) => (
          <div key={tier} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                backgroundColor: CONFIDENCE_COLOR[tier],
                backgroundImage: CONFIDENCE_PATTERN[tier],
                borderRadius: 1,
              }}
            />
            <span>
              {tier === "HIGH" ? "High" : tier === "MEDIUM" ? "Medium" : "Low"} confidence
            </span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              background:
                "repeating-linear-gradient(45deg, #e8e8e8, #e8e8e8 3px, #f4f4f4 3px, #f4f4f4 6px)",
              border: "1px dashed #c6c6c6",
            }}
          />
          <span>No data</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Loading skeleton ───────────────────────────────────────────────────── */

function SkeletonBlock({ width, height }: { width: number; height: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        background: "var(--cds-skeleton-01, #e8e8e8)",
        borderRadius: 2,
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

// Re-export types used by consumers
export type { M07EstimateFilters };
export { AVAILABILITY_INTENT };
