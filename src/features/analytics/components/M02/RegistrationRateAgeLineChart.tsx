import type { MetricM02AgeTrendRow } from "../../types";
import RegistrationRateLineChart, {
  type RegistrationRateTrendSeries,
} from "./RegistrationRateLineChart";

interface Props {
  data: MetricM02AgeTrendRow[];
  loading?: boolean;
}

const AGE_ORDER = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const AGE_COLORS: Record<string, string> = {
  "18-24": "#0043ce",
  "25-34": "#00a3a4",
  "35-44": "#198038",
  "45-54": "#ff832b",
  "55-64": "#da1e28",
  "65+": "#8a3ffc",
};

export default function RegistrationRateAgeLineChart({ data, loading }: Props) {
  const series: RegistrationRateTrendSeries[] = [...data]
    .sort((a, b) => {
      const left = AGE_ORDER.indexOf(a.age_bracket);
      const right = AGE_ORDER.indexOf(b.age_bracket);
      return (left < 0 ? Number.MAX_SAFE_INTEGER : left) - (right < 0 ? Number.MAX_SAFE_INTEGER : right);
    })
    .map((row) => ({
      label: row.age_bracket,
      color: AGE_COLORS[row.age_bracket] ?? "#78a9ff",
      points: row.series,
    }));

  return (
    <RegistrationRateLineChart
      title="Age Bracket Trend by Year"
      data={series}
      loading={loading}
    />
  );
}
