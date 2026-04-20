import { useState } from "react";
import { Callout, RadioGroup, Radio, Classes } from "@blueprintjs/core";
import { useMetricM04 } from "../../hooks/useMetricM04";
import type { MetricM04Filters } from "../../types";
import GenderDemographicsFilters from "./GenderDemographicsFilters";
import GenderDonutChart from "./GenderDonutChart";
import GenderDistrictBarChart from "./GenderDistrictBarChart";

type VizMode = "donut" | "district";

const fmt = new Intl.NumberFormat("en-PH");

export default function GenderDemographicsPanel() {
  const [filters, setFilters] = useState<MetricM04Filters>({});
  const [vizMode, setVizMode] = useState<VizMode>("donut");
  const { data, loading, error } = useMetricM04(filters);

  const totalVoters = data?.summary?.total_voters ?? 0;
  const gendersCount = data?.summary?.genders_count ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <GenderDemographicsFilters filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <Callout intent="danger" title="Failed to load metric">
          {error}
        </Callout>
      )}

      <div style={{ background: "var(--cds-layer-02)", padding: 16, borderRadius: 0, display: "flex", gap: 32, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}>
            Total Voters
          </span>
          <span style={{ fontSize: 20, fontWeight: 600, minWidth: 64 }} className={loading ? Classes.SKELETON : undefined}>
            {!loading && fmt.format(totalVoters)}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.32px" }}>
            Gender Categories
          </span>
          <span style={{ fontSize: 20, fontWeight: 600, minWidth: 24 }} className={loading ? Classes.SKELETON : undefined}>
            {!loading && gendersCount}
          </span>
        </div>
      </div>

      <RadioGroup
        inline
        onChange={(e) => setVizMode((e.target as HTMLInputElement).value as VizMode)}
        selectedValue={vizMode}
        label="Visualization type"
      >
        <Radio label="Donut Chart" value="donut" />
        <Radio label="District Comparison" value="district" />
      </RadioGroup>

      {vizMode === "donut" ? (
        <GenderDonutChart data={data?.data ?? []} loading={loading} />
      ) : (
        <GenderDistrictBarChart data={data?.by_district ?? []} loading={loading} />
      )}
    </div>
  );
}
