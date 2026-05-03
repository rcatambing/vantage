import { useState } from "react";
import {
  Tabs,
  Tab,
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Button,
  HTMLSelect,
  NumericInput,
} from "@blueprintjs/core";
import { useParams } from "react-router";
import {
  useVoterComposites,
  usePersuasionFunnel,
  useDistrictReadiness,
  useSocioeconomicSummary,
} from "../hooks";
import VoterCompositeTable from "./VoterCompositeTable";
import PersuasionFunnelChart from "./PersuasionFunnelChart";
import DistrictReadinessHeatmap from "./DistrictReadinessHeatmap";
import SocioeconomicSummaryTable from "./SocioeconomicSummaryTable";
import ComputationJobPanel from "./ComputationJobPanel";
import type { PersuasionStage } from "../types";

const PERSUASION_STAGES: PersuasionStage[] = [
  "STRONG_SUPPORTER",
  "LEAN_SUPPORTER",
  "PERSUADABLE",
  "LEAN_OPPONENT",
  "STRONG_OPPONENT",
  "UNKNOWN",
];

export default function IntelligenceOverviewPage() {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Filters
  const [districtId, setDistrictId] = useState("");
  const [stage, setStage] = useState<PersuasionStage | "">("");
  const [minCwss, setMinCwss] = useState<number | undefined>(undefined);
  const [maxCwss, setMaxCwss] = useState<number | undefined>(undefined);
  const [minFreshness, setMinFreshness] = useState<number | undefined>(undefined);

  const [voterPage, setVoterPage] = useState(1);
  const [socioPage, setSocioPage] = useState(1);

  const voterParams = {
    district_id: districtId || undefined,
    persuasion_stage: stage || undefined,
    min_cwss: minCwss,
    max_cwss: maxCwss,
    min_freshness: minFreshness,
    page: voterPage,
    page_size: 25,
  };

  const {
    data: voterData,
    loading: voterLoading,
    error: voterError,
  } = useVoterComposites(campaignId, voterParams);

  const {
    data: funnelData,
    loading: funnelLoading,
    error: funnelError,
  } = usePersuasionFunnel(campaignId, {});

  const {
    data: readinessData,
    loading: readinessLoading,
    error: readinessError,
  } = useDistrictReadiness(campaignId, {});

  const {
    data: socioData,
    loading: socioLoading,
    error: socioError,
  } = useSocioeconomicSummary(campaignId, {
    page: socioPage,
    page_size: 25,
  });

  const loading =
    voterLoading || funnelLoading || readinessLoading || socioLoading;
  const error = voterError || funnelError || readinessError || socioError;

  // Role-gated job controls (stub: always visible for now; wire to auth context later)
  const canRunJobs = true;

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
          Intelligence Dashboard
        </h2>
        {campaignId && (
          <span
            style={{
              fontSize: 12,
              color: "var(--cds-text-secondary, #525252)",
            }}
          >
            Campaign {campaignId}
          </span>
        )}
      </div>

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 60,
          }}
        >
          <Spinner size={20} />
        </div>
      )}

      {error && (
        <Callout
          intent={Intent.DANGER}
          icon="error"
          title="Could not load intelligence data"
          style={{ marginBottom: 16 }}
        >
          {error}
        </Callout>
      )}

      {!loading && !error && (
        <>
          <Tabs
            selectedTabId={selectedTab}
            onChange={(id) => {
              setSelectedTab(id as string);
            }}
          >
            <Tab id="overview" title="Overview" panel={<OverviewPanel />} />
            <Tab
              id="funnel"
              title="Funnel"
              panel={
                <FunnelPanel
                  data={funnelData}
                  loading={funnelLoading}
                  error={funnelError}
                />
              }
            />
            <Tab
              id="readiness"
              title="Readiness"
              panel={
                <ReadinessPanel
                  data={readinessData}
                  loading={readinessLoading}
                  error={readinessError}
                />
              }
            />
            <Tab
              id="socioeconomic"
              title="Socioeconomic"
              panel={
                <SocioeconomicPanel
                  data={socioData}
                  loading={socioLoading}
                  error={socioError}
                  page={socioPage}
                  onPageChange={setSocioPage}
                />
              }
            />
          </Tabs>

          <div style={{ marginTop: 24 }}>
            <ComputationJobPanel
              campaignId={campaignId}
              canRunJobs={canRunJobs}
            />
          </div>
        </>
      )}
    </div>
  );

  function OverviewPanel() {
    return (
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <HTMLSelect
            value={districtId}
            onChange={(e) => {
              setDistrictId(e.currentTarget.value);
              setVoterPage(1);
            }}
            style={{ minWidth: 140 }}
          >
            <option value="">All Districts</option>
            {/* District options populated dynamically in production */}
          </HTMLSelect>

          <HTMLSelect
            value={stage}
            onChange={(e) => {
              setStage(e.currentTarget.value as PersuasionStage | "");
              setVoterPage(1);
            }}
            style={{ minWidth: 140 }}
          >
            <option value="">All Stages</option>
            {PERSUASION_STAGES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </HTMLSelect>

          <NumericInput
            placeholder="Min CWSS"
            min={0}
            max={100}
            value={minCwss ?? ""}
            onValueChange={(v) => {
              setMinCwss(Number.isNaN(v) ? undefined : v);
              setVoterPage(1);
            }}
            style={{ width: 100 }}
          />
          <NumericInput
            placeholder="Max CWSS"
            min={0}
            max={100}
            value={maxCwss ?? ""}
            onValueChange={(v) => {
              setMaxCwss(Number.isNaN(v) ? undefined : v);
              setVoterPage(1);
            }}
            style={{ width: 100 }}
          />
          <NumericInput
            placeholder="Min Freshness"
            min={0}
            max={100}
            value={minFreshness ?? ""}
            onValueChange={(v) => {
              setMinFreshness(Number.isNaN(v) ? undefined : v);
              setVoterPage(1);
            }}
            style={{ width: 120 }}
          />
        </div>

        {voterLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Spinner size={20} />
          </div>
        )}

        {voterError && (
          <Callout intent={Intent.DANGER} icon="error" title="Could not load voters">
            {voterError}
          </Callout>
        )}

        {!voterLoading && !voterError && voterData && voterData.items.length === 0 && (
          <NonIdealState
            icon="search"
            title="No voters"
            description="Adjust filters to see results."
          />
        )}

        {!voterLoading && !voterError && voterData && voterData.items.length > 0 && (
          <>
            <VoterCompositeTable rows={voterData.items} />
            {voterData.total > voterData.page_size && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <Button
                  small
                  minimal
                  disabled={voterData.page <= 1}
                  text="Previous"
                  onClick={() => setVoterPage((p) => p - 1)}
                />
                <span
                  style={{
                    fontSize: 12,
                    lineHeight: "30px",
                    color: "var(--cds-text-secondary, #525252)",
                  }}
                >
                  Page {voterData.page} of{" "}
                  {Math.ceil(voterData.total / voterData.page_size)}
                </span>
                <Button
                  small
                  minimal
                  disabled={voterData.page * voterData.page_size >= voterData.total}
                  text="Next"
                  onClick={() => setVoterPage((p) => p + 1)}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

function FunnelPanel({
  data,
  loading,
  error,
}: {
  data: import("../types").PersuasionFunnelRow[] | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spinner size={20} />
      </div>
    );
  }
  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error" title="Could not load funnel">
        {error}
      </Callout>
    );
  }
  if (!data || data.length === 0) {
    return (
      <NonIdealState
        icon="chart"
        title="No funnel data"
        description="Funnel data is not available for this campaign."
      />
    );
  }
  return <PersuasionFunnelChart rows={data} />;
}

function ReadinessPanel({
  data,
  loading,
  error,
}: {
  data: import("../types").DistrictReadinessRow[] | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spinner size={20} />
      </div>
    );
  }
  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error" title="Could not load readiness">
        {error}
      </Callout>
    );
  }
  if (!data || data.length === 0) {
    return (
      <NonIdealState
        icon="heatmap"
        title="No readiness data"
        description="District readiness data is not available."
      />
    );
  }
  return <DistrictReadinessHeatmap rows={data} />;
}

function SocioeconomicPanel({
  data,
  loading,
  error,
  page,
  onPageChange,
}: {
  data: import("../types").PagedResponse<import("../types").SocioeconomicSummaryRow> | null;
  loading: boolean;
  error: string | null;
  page: number;
  onPageChange: (p: number) => void;
}) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spinner size={20} />
      </div>
    );
  }
  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error" title="Could not load socioeconomic data">
        {error}
      </Callout>
    );
  }
  if (!data || data.items.length === 0) {
    return (
      <NonIdealState
        icon="properties"
        title="No socioeconomic data"
        description="Socioeconomic summary data is not available."
      />
    );
  }
  return (
    <>
      <SocioeconomicSummaryTable rows={data.items} />
      {data.total > data.page_size && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          <Button
            small
            minimal
            disabled={data.page <= 1}
            text="Previous"
            onClick={() => onPageChange(page - 1)}
          />
          <span
            style={{
              fontSize: 12,
              lineHeight: "30px",
              color: "var(--cds-text-secondary, #525252)",
            }}
          >
            Page {data.page} of {Math.ceil(data.total / data.page_size)}
          </span>
          <Button
            small
            minimal
            disabled={data.page * data.page_size >= data.total}
            text="Next"
            onClick={() => onPageChange(page + 1)}
          />
        </div>
      )}
    </>
  );
}
