import { useState } from "react";
import { Callout, RadioGroup, Radio, Classes } from "@blueprintjs/core";
import { useMetricM03 } from "../../hooks/useMetricM03";
import type { MetricM03Filters } from "../../types";
import AgeDemographicsFilters from "./AgeDemographicsFilters";
import AgeDemographicsBarChart from "./AgeDemographicsBarChart";
import AgeDemographicsPopulationPyramid from "./AgeDemographicsPopulationPyramid";

type VizMode = "bar" | "pyramid";

const fmt = new Intl.NumberFormat("en-PH");

export default function AgeDemographicsPanel() {
  const [filters, setFilters] = useState<MetricM03Filters>({});
  const [vizMode, setVizMode] = useState<VizMode>("bar");
  const { data, loading, error } = useMetricM03(filters);

  const totalVoters = data?.summary?.total_voters ?? 0;
  const activeBrackets = data?.summary?.age_brackets_count ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <AgeDemographicsFilters filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <Callout intent="danger" title="Failed to load metric">
          {error}
        </Callout>
      )}

      <div style={{ background: "var(--cds-layer-02)", padding: 16, borderRadius: 0, display: "flex", gap: 32, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}>
            Total Voters
          </span>
          <span style={{ fontSize: 20, fontWeight: 600, minWidth: 64 }} className={loading ? Classes.SKELETON : undefined}>
            {!loading && fmt.format(totalVoters)}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}>
            Active Brackets
          </span>
          <span style={{ fontSize: 20, fontWeight: 600, minWidth: 24 }} className={loading ? Classes.SKELETON : undefined}>
            {!loading && activeBrackets}
          </span>
        </div>
      </div>

      <RadioGroup
        inline
        onChange={(e) => setVizMode((e.target as HTMLInputElement).value as VizMode)}
        selectedValue={vizMode}
        label="Visualization type"
      >
        <Radio label="Bar Chart" value="bar" />
        <Radio label="Population Pyramid" value="pyramid" />
      </RadioGroup>

      {vizMode === "bar" ? (
        <AgeDemographicsBarChart data={data?.data ?? []} loading={loading} />
      ) : (
        <AgeDemographicsPopulationPyramid data={data?.by_gender ?? []} loading={loading} />
      )}
    </div>
  );
}
