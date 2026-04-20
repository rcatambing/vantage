import { Spinner } from "@blueprintjs/core";
import KpiCard from "../../../../widgets/KpiCard";

interface Props {
  total: number;
  loading?: boolean;
}

export default function VoterCountKpiCard({ total, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 80 }}>
        <Spinner size={24} />
      </div>
    );
  }

  const formatted = new Intl.NumberFormat("en-PH").format(total);

  return (
    <KpiCard
      label="Total Registered Voters"
      value={formatted}
      icon="people"
    />
  );
}
