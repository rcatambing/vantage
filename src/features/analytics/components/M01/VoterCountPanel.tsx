import { useState } from "react";
import { Card, Callout, Tag, Classes } from "@blueprintjs/core";
import { useMetricM01 } from "../../hooks/useMetricM01";
import type { MetricFilters } from "../../types";
import VoterCountFilters from "./VoterCountFilters";
import VoterCountKpiCard from "./VoterCountKpiCard";
import VoterCountBarChart from "./VoterCountBarChart";
import VoterCountHeatmap from "./VoterCountHeatmap";

export default function VoterCountPanel() {
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

  const total = data?.summary?.total_registered ?? 0;
  const selectedDistrict = data?.data?.find((d) => d.district_id === filters.district_id);

  return (
    <Card
      style={{
        padding: 24,
        background: "var(--cds-layer-01)",
        borderRadius: 0,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <h3
            className={Classes.HEADING}
            style={{ margin: 0, marginBottom: 16, fontSize: 20, fontWeight: 600 }}
          >
            M01 — Registered Voter Count
          </h3>
          <VoterCountFilters filters={filters} onChange={setFilters} />
          {filters.district_id && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <Tag
                onRemove={clearDistrictFilter}
                intent="primary"
              >
                District: {selectedDistrict?.district_name ?? filters.district_id}
              </Tag>
            </div>
          )}
        </div>

        {error && (
          <Callout intent="danger" title="Failed to load metric">
            {error}
          </Callout>
        )}

        <div style={{ background: "var(--cds-layer-02)", padding: 16, borderRadius: 0 }}>
          <VoterCountKpiCard total={total} loading={loading} />
        </div>

        <VoterCountBarChart
          data={data?.data ?? []}
          loading={loading}
          onBarClick={handleBarClick}
        />

        <VoterCountHeatmap data={data?.data ?? []} loading={loading} />
      </div>
    </Card>
  );
}
