import { useState } from "react";
import { Tag, Callout } from "@blueprintjs/core";
import ScreenLayout from "../templates/ScreenLayout";
import Panel from "../components/Panel";
import { useMetricM01 } from "../features/analytics/hooks/useMetricM01";
import type { MetricFilters } from "../features/analytics/types";
import VoterCountKpiCard from "../features/analytics/components/M01/VoterCountKpiCard";
import VoterCountBarChart from "../features/analytics/components/M01/VoterCountBarChart";
import VoterCountHeatmap from "../features/analytics/components/M01/VoterCountHeatmap";
import VoterCountFilters from "../features/analytics/components/M01/VoterCountFilters";
import RegistrationRatePanel from "../features/analytics/components/M02/RegistrationRatePanel";
import AgeDemographicsPanel from "../features/analytics/components/M03/AgeDemographicsPanel";
import GenderDemographicsPanel from "../features/analytics/components/M04/GenderDemographicsPanel";

function KpiPanel() {
  const [filters, setFilters] = useState<MetricFilters>({});
  const { data, loading, error } = useMetricM01(filters);
  const total = data?.summary?.total_registered ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <VoterCountFilters filters={filters} onChange={setFilters} />
      {error && (
        <Callout intent="danger" compact>
          {error}
        </Callout>
      )}
      <VoterCountKpiCard total={total} loading={loading} />
    </div>
  );
}

function BarChartPanel() {
  const [filters, setFilters] = useState<MetricFilters>({});
  const { data, loading, error } = useMetricM01(filters);

  const handleBarClick = (districtId: number) => {
    setFilters((prev) => ({ ...prev, district_id: districtId }));
  };

  const clearDistrictFilter = () => {
    setFilters((prev) => {
      const { district_id, ...rest } = prev;
      return rest;
    });
  };

  const selectedDistrict = data?.data?.find((d) => d.district_id === filters.district_id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <VoterCountFilters filters={filters} onChange={setFilters} />
      {filters.district_id && (
        <Tag onRemove={clearDistrictFilter} intent="primary">
          District: {selectedDistrict?.district_name ?? filters.district_id}
        </Tag>
      )}
      {error && (
        <Callout intent="danger" compact>
          {error}
        </Callout>
      )}
      <VoterCountBarChart
        data={data?.data ?? []}
        loading={loading}
        onBarClick={handleBarClick}
      />
    </div>
  );
}

function HeatmapPanel() {
  const [filters, setFilters] = useState<MetricFilters>({});
  const { data, loading, error } = useMetricM01(filters);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <VoterCountFilters filters={filters} onChange={setFilters} />
      {error && (
        <Callout intent="danger" compact>
          {error}
        </Callout>
      )}
      <VoterCountHeatmap data={data?.data ?? []} loading={loading} />
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <ScreenLayout
      id="analytics-dashboard"
      name="Analytics Dashboard"
      description="Voter registration metrics with interactive visualizations."
    >
      <Panel id="m01-kpi" name="M01 — Registered Voter Count" size="wide-small">
        <KpiPanel />
      </Panel>

      <Panel id="m01-bar-chart" name="M01 — Voters by District" size="wide-large">
        <BarChartPanel />
      </Panel>

      <Panel id="m01-heatmap" name="M01 — Geographic Distribution" size="wide-large">
        <HeatmapPanel />
      </Panel>

      <Panel id="m02-registration-rate" name="M02 — Voter Registration Rate" size="wide-large">
        <RegistrationRatePanel />
      </Panel>

      <Panel id="m03-age-demographics" name="M03 — Age Demographics" size="wide-large">
        <AgeDemographicsPanel />
      </Panel>

      <Panel id="m04-gender-demographics" name="M04 — Gender Demographics" size="wide-large">
        <GenderDemographicsPanel />
      </Panel>
    </ScreenLayout>
  );
}
