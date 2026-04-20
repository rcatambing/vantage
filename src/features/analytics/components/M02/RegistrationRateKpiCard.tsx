import { Spinner } from "@blueprintjs/core";
import KpiCard from "../../../../widgets/KpiCard";

interface Props {
  overallRate: number;
  loading?: boolean;
}

export default function RegistrationRateKpiCard({ overallRate, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 80 }}>
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <KpiCard
      label="Overall Registration Rate"
      value={`${overallRate.toFixed(1)}%`}
      icon="percentage"
    />
  );
}
