import type { MetricM02GenderTrendRow } from "../../types";
import RegistrationRateLineChart, {
  type RegistrationRateTrendSeries,
} from "./RegistrationRateLineChart";

interface Props {
  data: MetricM02GenderTrendRow[];
  loading?: boolean;
}

const GENDER_ORDER = ["MALE", "FEMALE", "LGBT", "PREFER_NOT_TO_SAY"];
const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  LGBT: "LGBT+",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const GENDER_COLORS: Record<string, string> = {
  MALE: "#78a9ff",
  FEMALE: "#da1e28",
  LGBT: "#8a3ffc",
  PREFER_NOT_TO_SAY: "#6f6f6f",
};

export default function RegistrationRateGenderLineChart({ data, loading }: Props) {
  const series: RegistrationRateTrendSeries[] = [...data]
    .sort((a, b) => {
      const left = GENDER_ORDER.indexOf(a.gender);
      const right = GENDER_ORDER.indexOf(b.gender);
      return (left < 0 ? Number.MAX_SAFE_INTEGER : left) - (right < 0 ? Number.MAX_SAFE_INTEGER : right);
    })
    .map((row) => ({
      label: GENDER_LABELS[row.gender] ?? row.gender,
      color: GENDER_COLORS[row.gender] ?? "#78a9ff",
      points: row.series,
    }));

  return (
    <RegistrationRateLineChart
      title="Gender Trend by Year"
      data={series}
      loading={loading}
    />
  );
}
