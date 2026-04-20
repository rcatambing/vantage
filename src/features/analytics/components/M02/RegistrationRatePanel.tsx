import { useState } from "react";
import { Callout, Classes } from "@blueprintjs/core";
import { useMetricM02 } from "../../hooks/useMetricM02";
import type { MetricM02Filters } from "../../types";
import RegistrationRateFilters from "./RegistrationRateFilters";
import RegistrationRateKpiCard from "./RegistrationRateKpiCard";
import RegistrationRateHeatmap from "./RegistrationRateHeatmap";
import RegistrationRateGenderLineChart from "./RegistrationRateGenderLineChart";
import RegistrationRateAgeLineChart from "./RegistrationRateAgeLineChart";

export default function RegistrationRatePanel() {
  const [filters, setFilters] = useState<MetricM02Filters>({});
  const { data, loading, error } = useMetricM02(filters);
  const rawRate = data?.summary?.overall_rate;
  const overallRate = Number.isFinite(rawRate) ? rawRate! : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <RegistrationRateFilters filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <Callout intent="danger" title="Failed to load metric">
          {error}
        </Callout>
      )}

      <div style={{ background: "var(--cds-layer-02)", padding: 16, borderRadius: 0 }}>
        <RegistrationRateKpiCard overallRate={overallRate} loading={loading} />
      </div>

      <RegistrationRateHeatmap data={data?.data ?? []} loading={loading} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <RegistrationRateGenderLineChart
          data={data?.trends?.gender ?? []}
          loading={loading}
        />

        <RegistrationRateAgeLineChart
          data={data?.trends?.age_bracket ?? []}
          loading={loading}
        />
      </div>
    </div>
  );
}
