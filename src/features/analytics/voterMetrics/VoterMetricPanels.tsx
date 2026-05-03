import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Button,
  Callout,
  Checkbox,
  Classes,
  HTMLSelect,
  InputGroup,
  Intent,
  Radio,
  RadioGroup,
  Spinner,
  Tag,
} from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import { apiFetch } from "../../../lib/api/client";

interface PanelProps {
  campaignId: string;
}

type QueryScalar = string | number | boolean;
type QueryValue = QueryScalar | QueryScalar[] | undefined | null;

function buildQueryString(params: Record<string, QueryValue>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && `${item}`.trim() !== "") {
          qs.append(key, `${item}`);
        }
      });
      return;
    }
    qs.set(key, `${value}`);
  });
  return qs.toString();
}

function parseCsvList(value: string): string[] {
  return value
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function toDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const fmtNum = new Intl.NumberFormat("en-PH");
const fmtPct = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function shortLabel(value: string, max = 16): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1)}...`;
}

function blueHeat(value: number, max: number): { background: string; textColor: string } {
  const ratio = max > 0 ? value / max : 0;
  const alpha = 0.2 + ratio * 0.7;
  return {
    background: `rgba(15, 98, 254, ${alpha.toFixed(3)})`,
    textColor: alpha >= 0.55 ? "#ffffff" : "var(--cds-text-primary)",
  };
}

const srOnlyTableStyle: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
  margin: -1,
  padding: 0,
};

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function usePanelFetch<T>(endpoint: string, params: Record<string, QueryValue>): FetchState<T> {
  const query = useMemo(() => buildQueryString(params), [params]);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const path = query ? `${endpoint}?${query}` : endpoint;
      const response = await apiFetch<T>(path);
      setData(response);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch metric data");
    } finally {
      setLoading(false);
    }
  }, [endpoint, query]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  const refetch = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  return { data, loading, error, refetch };
}

function LoadingState() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
      <Spinner size={16} />
      <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
        Loading metric data...
      </span>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Callout intent={Intent.DANGER} icon="error" title="Failed to load metric">
      {error}
      <Button small minimal style={{ marginLeft: 8 }} text="Retry" onClick={onRetry} />
    </Callout>
  );
}

interface SimplePoint {
  label: string;
  value: number;
}

function SimpleLineChart({
  points,
  stroke,
  fill,
  referenceIndex,
  referenceLabel,
  ariaLabel,
}: {
  points: SimplePoint[];
  stroke: string;
  fill: string;
  referenceIndex?: number;
  referenceLabel?: string;
  ariaLabel?: string;
}) {
  if (points.length === 0) {
    return (
      <Callout intent={Intent.NONE} icon="timeline-line-chart">
        No time-series data available for the selected filters.
      </Callout>
    );
  }

  const width = 640;
  const height = 220;
  const padX = 36;
  const padY = 24;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padY * 2;
  const maxValue = Math.max(1, ...points.map((point) => point.value));

  const xAt = (index: number) =>
    points.length === 1 ? padX + chartWidth / 2 : padX + (index / (points.length - 1)) * chartWidth;
  const yAt = (value: number) => padY + chartHeight - (value / maxValue) * chartHeight;

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xAt(index)} ${yAt(point.value)}`)
    .join(" ");

  const areaPath = `${linePath} L ${xAt(points.length - 1)} ${padY + chartHeight} L ${xAt(0)} ${
    padY + chartHeight
  } Z`;

  const referenceX =
    referenceIndex !== undefined && referenceIndex >= 0 && referenceIndex < points.length
      ? xAt(referenceIndex)
      : undefined;
  const peakPoint = points.reduce((currentPeak, point) =>
    point.value > currentPeak.value ? point : currentPeak
  , points[0]);

  const chartAriaLabel =
    ariaLabel ??
    `Trend chart from ${points[0].label} to ${points[points.length - 1].label}. Peak value ${fmtNum.format(
      peakPoint.value
    )} at ${peakPoint.label}.`;

  return (
    <div style={{ width: "100%" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 220 }} role="img" aria-label={chartAriaLabel}>
        <line x1={padX} y1={padY + chartHeight} x2={padX + chartWidth} y2={padY + chartHeight} stroke="#6f6f6f" />
        <path d={areaPath} fill={fill} opacity={0.28} />
        <path d={linePath} fill="none" stroke={stroke} strokeWidth={2.5} />

        {referenceX !== undefined && (
          <>
            <line
              x1={referenceX}
              y1={padY}
              x2={referenceX}
              y2={padY + chartHeight}
              stroke="#f1c21b"
              strokeDasharray="5 4"
              strokeWidth={1.5}
            />
            {referenceLabel && (
              <text x={referenceX + 6} y={padY + 14} fontSize={11} fill="#f1c21b">
                {referenceLabel}
              </text>
            )}
          </>
        )}

        {points.map((point, index) => (
          <circle key={`${point.label}-${index}`} cx={xAt(index)} cy={yAt(point.value)} r={3} fill={stroke} />
        ))}

        <text x={padX} y={padY + chartHeight + 18} fontSize={10} fill="#c6c6c6">
          {points[0].label}
        </text>
        {points.length > 1 && (
          <text x={padX + chartWidth} y={padY + chartHeight + 18} fontSize={10} fill="#c6c6c6" textAnchor="end">
            {points[points.length - 1].label}
          </text>
        )}
      </svg>

      <table aria-label="Line chart data" style={srOnlyTableStyle}>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={`line-row-${point.label}`}>
              <td>{point.label}</td>
              <td>{point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface YearSeries {
  label: string;
  color: string;
  points: Array<{ year: number; value: number }>;
}

function MultiSeriesYearChart({ title, series }: { title: string; series: YearSeries[] }) {
  if (series.length === 0) {
    return (
      <Callout intent={Intent.NONE} icon="timeline-line-chart">
        No trend data available for {title.toLowerCase()}.
      </Callout>
    );
  }

  const years = Array.from(
    new Set(series.flatMap((entry) => entry.points.map((point) => point.year)))
  ).sort((left, right) => left - right);

  if (years.length === 0) {
    return (
      <Callout intent={Intent.NONE} icon="timeline-line-chart">
        No trend data available for {title.toLowerCase()}.
      </Callout>
    );
  }

  const width = 640;
  const height = 220;
  const padX = 42;
  const padY = 24;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padY * 2;

  const allValues = series.flatMap((entry) => entry.points.map((point) => point.value));
  const maxValue = Math.max(1, ...allValues);

  const xAt = (year: number) => {
    if (years.length === 1) {
      return padX + chartWidth / 2;
    }
    const index = years.indexOf(year);
    return padX + (index / (years.length - 1)) * chartWidth;
  };
  const yAt = (value: number) => padY + chartHeight - (value / maxValue) * chartHeight;

  const chartAriaLabel = `${title}. Years ${years[0]} to ${years[years.length - 1]}. ${series.length} series.`;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: 12, color: "var(--cds-text-secondary)", marginBottom: 6 }}>{title}</div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 220 }} role="img" aria-label={chartAriaLabel}>
        <line x1={padX} y1={padY + chartHeight} x2={padX + chartWidth} y2={padY + chartHeight} stroke="#6f6f6f" />

        {series.map((entry) => {
          const pointMap = new Map<number, number>(entry.points.map((point) => [point.year, point.value]));
          const linePath = years
            .map((year, index) => {
              const value = pointMap.get(year) ?? 0;
              return `${index === 0 ? "M" : "L"} ${xAt(year)} ${yAt(value)}`;
            })
            .join(" ");

          return (
            <g key={entry.label}>
              <path d={linePath} fill="none" stroke={entry.color} strokeWidth={2.5} />
              {years.map((year) => {
                const value = pointMap.get(year) ?? 0;
                return <circle key={`${entry.label}-${year}`} cx={xAt(year)} cy={yAt(value)} r={2.7} fill={entry.color} />;
              })}
            </g>
          );
        })}

        <text x={padX} y={padY + chartHeight + 18} fontSize={10} fill="#c6c6c6">
          {years[0]}
        </text>
        {years.length > 1 && (
          <text x={padX + chartWidth} y={padY + chartHeight + 18} fontSize={10} fill="#c6c6c6" textAnchor="end">
            {years[years.length - 1]}
          </text>
        )}
      </svg>

      <table aria-label={`${title} data table`} style={srOnlyTableStyle}>
        <thead>
          <tr>
            <th>Series</th>
            <th>Year</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {series.flatMap((entry) =>
            entry.points.map((point) => (
              <tr key={`${title}-${entry.label}-${point.year}`}>
                <td>{entry.label}</td>
                <td>{point.year}</td>
                <td>{point.value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {series.map((entry) => (
          <div key={`${title}-${entry.label}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: entry.color }} />
            <span className={Classes.TEXT_MUTED}>{entry.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) {
    return (
      <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
        No trend points.
      </div>
    );
  }

  const width = 260;
  const height = 58;
  const maxValue = Math.max(1, ...values);

  const xAt = (index: number) =>
    values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
  const yAt = (value: number) => height - (value / maxValue) * (height - 8) - 4;

  const path = values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${xAt(index)} ${yAt(value)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: 60 }}
      role="img"
      aria-label={`Sparkline for 14-day completion trend. Peak daily completions ${fmtNum.format(maxValue)}.`}
    >
      <path d={path} fill="none" stroke="var(--cds-button-primary)" strokeWidth={2} />
      {values.map((value, index) => (
        <circle key={`spark-${index}`} cx={xAt(index)} cy={yAt(value)} r={2} fill="var(--cds-button-primary)" />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* M01                                                                         */
/* -------------------------------------------------------------------------- */

interface M01DistrictRow {
  district_id: number;
  district_name: string;
  district_type: string | null;
  registered_count: number;
}

interface M01Response {
  metric_id: string;
  computed_at: string;
  summary: {
    total_registered: number;
  };
  data: M01DistrictRow[];
}

export function VoterCountPanel({ campaignId }: PanelProps) {
  const [districtType, setDistrictType] = useState("");
  const [gender, setGender] = useState("");
  const [ageBracket, setAgeBracket] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

  const params = useMemo(
    () => ({
      campaign_id: campaignId,
      district_type: districtType || undefined,
      gender: gender || undefined,
      age_bracket: ageBracket || undefined,
      limit: 40,
    }),
    [campaignId, districtType, gender, ageBracket]
  );

  const { data, loading, error, refetch } = usePanelFetch<M01Response>("/analytics/metrics/M01", params);

  useEffect(() => {
    if (!data || data.data.length === 0) {
      setSelectedDistrictId(null);
      return;
    }
    const stillExists = data.data.some((row) => row.district_id === selectedDistrictId);
    if (!stillExists) {
      setSelectedDistrictId(data.data[0].district_id);
    }
  }, [data, selectedDistrictId]);

  const selectedDistrict = useMemo(
    () => data?.data.find((row) => row.district_id === selectedDistrictId) ?? null,
    [data, selectedDistrictId]
  );

  const maxRegistered = useMemo(
    () => Math.max(1, ...(data?.data ?? []).map((row) => row.registered_count)),
    [data]
  );

  return (
    <Panel
      id="m01-RVC"
      name="Registered Voter Count"
      size="large"
      actions={<Button icon="refresh" minimal small onClick={refetch} aria-label="Refresh metric data" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <HTMLSelect value={districtType} onChange={(event) => setDistrictType(event.target.value)}>
            <option value="">All district levels</option>
            <option value="PROVINCE">PROVINCE</option>
            <option value="CITY">CITY</option>
            <option value="BARANGAY">BARANGAY</option>
          </HTMLSelect>

          <HTMLSelect value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="">All genders</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="LGBT">LGBT</option>
            <option value="PREFER_NOT_TO_SAY">PREFER_NOT_TO_SAY</option>
          </HTMLSelect>

          <HTMLSelect value={ageBracket} onChange={(event) => setAgeBracket(event.target.value)}>
            <option value="">All age brackets</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
            <option value="65+">65+</option>
          </HTMLSelect>
        </div>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            <div
              style={{
                padding: 12,
                borderLeft: "3px solid var(--cds-button-primary)",
                background: "var(--cds-layer-02)",
                borderRadius: 2,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 300 }}>{fmtNum.format(data.summary.total_registered)}</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, textTransform: "uppercase" }}>
                Total registered voters
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, marginBottom: 6, color: "var(--cds-text-secondary)" }}>
                Registered voters by district (bar chart)
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, minHeight: 172, overflowX: "auto", paddingBottom: 4 }}>
                {data.data.slice(0, 12).map((row) => {
                  const ratio = row.registered_count / maxRegistered;
                  const isSelected = row.district_id === selectedDistrictId;
                  return (
                    <button
                      key={row.district_id}
                      type="button"
                      onClick={() => setSelectedDistrictId(row.district_id)}
                      style={{
                        background: "transparent",
                        border: 0,
                        color: "inherit",
                        cursor: "pointer",
                        minWidth: 74,
                        minHeight: 44,
                        padding: 0,
                      }}
                      aria-label={`Drill into ${row.district_name}`}
                    >
                      <div
                        style={{
                          height: `${Math.max(10, ratio * 136)}px`,
                          borderRadius: 2,
                          background: isSelected ? "#0f62fe" : "#4589ff",
                          opacity: isSelected ? 1 : 0.7,
                          border: isSelected ? "1px solid #ffffff" : "1px solid transparent",
                        }}
                      />
                      <div style={{ fontSize: 10, marginTop: 6 }} className={Classes.TEXT_MUTED}>
                        {shortLabel(row.district_name, 12)}
                      </div>
                      <div style={{ fontSize: 10 }}>{fmtNum.format(row.registered_count)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, marginBottom: 6, color: "var(--cds-text-secondary)" }}>
                Choropleth-style heatmap (click cell to drilldown)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: 6 }}>
                {data.data.map((row) => {
                  const selected = row.district_id === selectedDistrictId;
                  const heatStyle = blueHeat(row.registered_count, maxRegistered);
                  return (
                    <button
                      key={`heat-${row.district_id}`}
                      type="button"
                      onClick={() => setSelectedDistrictId(row.district_id)}
                      style={{
                        border: selected ? "1px solid #ffffff" : "1px solid var(--cds-border-subtle)",
                        borderRadius: 2,
                        padding: 8,
                        minHeight: 72,
                        textAlign: "left",
                        background: heatStyle.background,
                        cursor: "pointer",
                        color: heatStyle.textColor,
                      }}
                      aria-label={`Select ${row.district_name}`}
                    >
                      <div style={{ fontSize: 10, fontWeight: 600 }}>{shortLabel(row.district_name, 11)}</div>
                      <div style={{ fontSize: 11, marginTop: 4 }}>{fmtNum.format(row.registered_count)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDistrict && (
              <div style={{ padding: 10, border: "1px solid var(--cds-border-subtle)", borderRadius: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Drilldown:</span>
                  <Tag minimal intent={Intent.PRIMARY}>{selectedDistrict.district_type ?? "N/A"}</Tag>
                  <span>{selectedDistrict.district_name}</span>
                </div>
                <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 6 }}>
                  Registered voters: {fmtNum.format(selectedDistrict.registered_count)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* M02                                                                         */
/* -------------------------------------------------------------------------- */

interface M02TrendPoint {
  year: number;
  registered: number;
}

interface M02GenderSeries {
  gender: string;
  series: M02TrendPoint[];
}

interface M02AgeSeries {
  age_bracket: string;
  series: M02TrendPoint[];
}

interface M02DistrictRow {
  district_id: number;
  district_name: string;
  district_type: string | null;
  city_class: string | null;
  registered: number;
  population: number;
  rate: number;
  income_bracket: string | null;
}

interface M02Response {
  metric_id: string;
  computed_at: string;
  summary: {
    overall_rate: number;
    total_registered: number;
    total_population: number;
  };
  data: M02DistrictRow[];
  trends: {
    gender: M02GenderSeries[];
    age_bracket: M02AgeSeries[];
  };
}

export function RegistrationRateMap({ campaignId }: PanelProps) {
  const [districtHierarchy, setDistrictHierarchy] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [genderInput, setGenderInput] = useState("");
  const [ageFilter, setAgeFilter] = useState<string[]>([]);
  const [genderFilter, setGenderFilter] = useState<string[]>([]);

  const params = useMemo(
    () => ({
      campaign_id: campaignId,
      district_hierarchy: districtHierarchy || undefined,
      age_bracket: ageFilter.length ? ageFilter : undefined,
      gender: genderFilter.length ? genderFilter : undefined,
      limit: 40,
    }),
    [campaignId, districtHierarchy, ageFilter, genderFilter]
  );

  const { data, loading, error, refetch } = usePanelFetch<M02Response>("/analytics/metrics/M02", params);

  const maxRate = useMemo(
    () => Math.max(1, ...(data?.data ?? []).map((row) => row.rate)),
    [data]
  );

  const genderSeries = useMemo<YearSeries[]>(() => {
    const palette = ["#0f62fe", "#4589ff", "#78a9ff", "#a6c8ff"];
    return (data?.trends.gender ?? []).map((entry, index) => ({
      label: entry.gender,
      color: palette[index % palette.length],
      points: entry.series.map((point) => ({ year: point.year, value: point.registered })),
    }));
  }, [data]);

  const ageSeries = useMemo<YearSeries[]>(() => {
    const palette = ["#8a3ffc", "#be95ff", "#d4bbff", "#e8daff", "#6929c4", "#491d8b"];
    return (data?.trends.age_bracket ?? []).map((entry, index) => ({
      label: entry.age_bracket,
      color: palette[index % palette.length],
      points: entry.series.map((point) => ({ year: point.year, value: point.registered })),
    }));
  }, [data]);

  return (
    <Panel
      id="m02-VRR"
      name="Voter Registration Rate"
      size="large"
      actions={<Button icon="refresh" minimal small onClick={refetch} aria-label="Refresh metric data" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <HTMLSelect value={districtHierarchy} onChange={(event) => setDistrictHierarchy(event.target.value)}>
            <option value="">All district levels</option>
            <option value="PROVINCE">PROVINCE</option>
            <option value="CITY">CITY</option>
            <option value="BARANGAY">BARANGAY</option>
          </HTMLSelect>
          <InputGroup
            value={ageInput}
            onChange={(event) => setAgeInput(event.target.value)}
            placeholder="Age filter CSV e.g. 18-24,25-34"
            aria-label="Age brackets filter, comma-separated"
            small
            style={{ width: 240 }}
          />
          <InputGroup
            value={genderInput}
            onChange={(event) => setGenderInput(event.target.value)}
            placeholder="Gender filter CSV e.g. MALE,FEMALE"
            aria-label="Gender filter, comma-separated"
            small
            style={{ width: 240 }}
          />
          <Button
            icon="filter"
            minimal
            small
            onClick={() => {
              setAgeFilter(parseCsvList(ageInput));
              setGenderFilter(parseCsvList(genderInput));
            }}
            text="Apply"
          />
        </div>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: 12,
                  minWidth: 180,
                  borderLeft: "3px solid #0f62fe",
                  background: "var(--cds-layer-02)",
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 300 }}>{fmtPct.format(data.summary.overall_rate)}%</div>
                <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, textTransform: "uppercase" }}>
                  Overall registration rate
                </div>
              </div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                Registered: {fmtNum.format(data.summary.total_registered)} / Population: {fmtNum.format(data.summary.total_population)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, marginBottom: 6, color: "var(--cds-text-secondary)" }}>
                Barangay choropleth-style saturation heatmap
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))", gap: 6 }}>
                {data.data.map((row) => {
                  const heatStyle = blueHeat(row.rate, maxRate);
                  return (
                    <div
                      key={`m02-${row.district_id}`}
                      style={{
                        border: "1px solid var(--cds-border-subtle)",
                        borderRadius: 2,
                        minHeight: 76,
                        padding: 8,
                        background: heatStyle.background,
                        color: heatStyle.textColor,
                      }}
                      title={row.district_name}
                      aria-label={`${row.district_name} ${fmtPct.format(row.rate)} percent registration`}
                    >
                      <div style={{ fontSize: 10, fontWeight: 600 }}>{shortLabel(row.district_name, 13)}</div>
                      <div style={{ fontSize: 12, marginTop: 3 }}>{fmtPct.format(row.rate)}%</div>
                      <div style={{ fontSize: 10 }}>{fmtNum.format(row.registered)} / {fmtNum.format(row.population)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <MultiSeriesYearChart title="Line Graph - Gender by Election Years" series={genderSeries} />
            <MultiSeriesYearChart title="Line Graph - Age Bracket by Election Years" series={ageSeries} />
          </>
        )}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* M03                                                                         */
/* -------------------------------------------------------------------------- */

interface M03AgeBucket {
  age_bracket: string;
  count: number;
  percentage: number;
}

interface M03DistrictBucket {
  district_id: number;
  district_name: string;
  district_type: string | null;
  age_brackets: M03AgeBucket[];
}

interface M03GenderPyramidRow {
  age_bracket: string;
  male: number;
  female: number;
  other: number;
}

interface M03Response {
  metric_id: string;
  computed_at: string;
  summary: {
    total_voters: number;
    age_brackets_count: number;
  };
  data: M03AgeBucket[];
  by_district: M03DistrictBucket[];
  by_gender: M03GenderPyramidRow[];
}

const AGE_COLORS = ["#0f62fe", "#4589ff", "#78a9ff", "#a6c8ff", "#d0e2ff", "#8d8d8d"];

export function AgeDemographicsChart({ campaignId }: PanelProps) {
  const [districtHierarchy, setDistrictHierarchy] = useState("");
  const [gender, setGender] = useState("");
  const [voterStatus, setVoterStatus] = useState("");
  const [mode, setMode] = useState<"stacked" | "pyramid">("stacked");

  const params = useMemo(
    () => ({
      campaign_id: campaignId,
      district_hierarchy: districtHierarchy || undefined,
      gender: gender ? [gender] : undefined,
      voter_status: voterStatus ? [voterStatus] : undefined,
      limit: 30,
    }),
    [campaignId, districtHierarchy, gender, voterStatus]
  );

  const { data, loading, error, refetch } = usePanelFetch<M03Response>("/analytics/metrics/M03", params);

  const districtRows = useMemo(() => (data?.by_district ?? []).slice(0, 8), [data]);
  const pyramidRows = data?.by_gender ?? [];
  const pyramidMax = Math.max(1, ...pyramidRows.map((row) => Math.max(row.male, row.female + row.other)));

  return (
    <Panel
      id="m03-ADB"
      name="Demographic Breakdown - Age"
      size="medium"
      actions={<Button icon="refresh" minimal small onClick={refetch} aria-label="Refresh metric data" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <HTMLSelect value={districtHierarchy} onChange={(event) => setDistrictHierarchy(event.target.value)}>
            <option value="">All district levels</option>
            <option value="PROVINCE">PROVINCE</option>
            <option value="CITY">CITY</option>
            <option value="BARANGAY">BARANGAY</option>
          </HTMLSelect>
          <HTMLSelect value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="">All genders</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="LGBT">LGBT</option>
            <option value="PREFER_NOT_TO_SAY">PREFER_NOT_TO_SAY</option>
          </HTMLSelect>
          <HTMLSelect value={voterStatus} onChange={(event) => setVoterStatus(event.target.value)}>
            <option value="">Registered only</option>
            <option value="REGISTERED">REGISTERED</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DECEASED">DECEASED</option>
          </HTMLSelect>
        </div>

        <RadioGroup
          inline
          selectedValue={mode}
          onChange={(event) => setMode((event.target as HTMLInputElement).value as "stacked" | "pyramid")}
        >
          <Radio value="stacked" label="Stacked bars" />
          <Radio value="pyramid" label="Population pyramid" />
        </RadioGroup>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && data && mode === "stacked" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {districtRows.map((district) => {
              const total = Math.max(1, district.age_brackets.reduce((sum, bucket) => sum + bucket.count, 0));
              return (
                <div key={`m03-dist-${district.district_id}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                    <span>{shortLabel(district.district_name, 24)}</span>
                    <span className={Classes.TEXT_MUTED}>{fmtNum.format(total)}</span>
                  </div>
                  <div style={{ display: "flex", height: 18, borderRadius: 2, overflow: "hidden" }}>
                    {district.age_brackets.map((bucket, index) => {
                      const widthPct = (bucket.count / total) * 100;
                      return (
                        <div
                          key={`${district.district_id}-${bucket.age_bracket}`}
                          style={{ width: `${widthPct}%`, background: AGE_COLORS[index % AGE_COLORS.length] }}
                          title={`${bucket.age_bracket}: ${fmtNum.format(bucket.count)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {(data.data ?? []).map((bucket, index) => (
                <div key={`legend-age-${bucket.age_bracket}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10 }}>
                  <span style={{ width: 10, height: 10, background: AGE_COLORS[index % AGE_COLORS.length] }} />
                  <span className={Classes.TEXT_MUTED}>{bucket.age_bracket}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && data && mode === "pyramid" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pyramidRows.map((row) => {
              const maleWidth = (row.male / pyramidMax) * 100;
              const femaleWidth = (row.female / pyramidMax) * 100;
              const otherWidth = (row.other / pyramidMax) * 100;
              return (
                <div
                  key={`pyr-${row.age_bracket}`}
                  style={{ display: "grid", gridTemplateColumns: "1fr 86px 1fr", alignItems: "center", gap: 6 }}
                >
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: `${maleWidth}%`, height: 14, background: "#0f62fe", borderRadius: "2px 0 0 2px" }} />
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11 }} className={Classes.TEXT_MUTED}>
                    {row.age_bracket}
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: `${femaleWidth}%`, height: 14, background: "#4589ff" }} />
                    <div style={{ width: `${otherWidth}%`, height: 14, background: "#8d8d8d", borderRadius: "0 2px 2px 0" }} />
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 12, fontSize: 10 }} className={Classes.TEXT_MUTED}>
              <span>Left: Male</span>
              <span>Right: Female + Other</span>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* M04                                                                         */
/* -------------------------------------------------------------------------- */

interface M04GenderRow {
  gender: string;
  count: number;
  percentage: number;
}

interface M04DistrictRow {
  district_id: number;
  district_name: string;
  district_type: string | null;
  genders: M04GenderRow[];
}

interface M04Response {
  metric_id: string;
  computed_at: string;
  summary: {
    total_voters: number;
    genders_count: number;
  };
  data: M04GenderRow[];
  by_district: M04DistrictRow[];
}

const GENDER_COLORS: Record<string, string> = {
  MALE: "#0f62fe",
  FEMALE: "#4589ff",
  LGBT: "#8a3ffc",
  PREFER_NOT_TO_SAY: "#8d8d8d",
};

function getGenderCount(genders: M04GenderRow[], key: string): number {
  return genders.find((entry) => entry.gender === key)?.count ?? 0;
}

export function GenderDemographicsPanel({ campaignId }: PanelProps) {
  const [districtHierarchy, setDistrictHierarchy] = useState("");
  const [ageBracket, setAgeBracket] = useState("");
  const [voterStatus, setVoterStatus] = useState("");

  const params = useMemo(
    () => ({
      campaign_id: campaignId,
      district_hierarchy: districtHierarchy || undefined,
      age_bracket: ageBracket ? [ageBracket] : undefined,
      voter_status: voterStatus ? [voterStatus] : undefined,
      limit: 40,
    }),
    [campaignId, districtHierarchy, ageBracket, voterStatus]
  );

  const { data, loading, error, refetch } = usePanelFetch<M04Response>("/analytics/metrics/M04", params);

  const total = useMemo(() => (data?.data ?? []).reduce((sum, row) => sum + row.count, 0), [data]);

  const donutGradient = useMemo(() => {
    if (!data || total <= 0) {
      return "conic-gradient(#6f6f6f 0deg 360deg)";
    }

    let angle = 0;
    const segments = data.data.map((row) => {
      const start = angle;
      angle += (row.count / total) * 360;
      const color = GENDER_COLORS[row.gender] ?? "#8d8d8d";
      return `${color} ${start}deg ${angle}deg`;
    });
    return `conic-gradient(${segments.join(",")})`;
  }, [data, total]);

  const districtComparison = useMemo(() => {
    if (!data) {
      return [] as Array<{ district_name: string; female_share: number; total: number }>;
    }

    return data.by_district
      .map((district) => {
        const female = getGenderCount(district.genders, "FEMALE");
        const districtTotal = district.genders.reduce((sum, entry) => sum + entry.count, 0);
        return {
          district_name: district.district_name,
          female_share: districtTotal > 0 ? (female / districtTotal) * 100 : 0,
          total: districtTotal,
        };
      })
      .sort((left, right) => right.female_share - left.female_share)
      .slice(0, 10);
  }, [data]);

  return (
    <Panel
      id="m04-GDP"
      name="Demographic Breakdown - Gender"
      size="medium"
      actions={<Button icon="refresh" minimal small onClick={refetch} aria-label="Refresh metric data" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <HTMLSelect value={districtHierarchy} onChange={(event) => setDistrictHierarchy(event.target.value)}>
            <option value="">All district levels</option>
            <option value="PROVINCE">PROVINCE</option>
            <option value="CITY">CITY</option>
            <option value="BARANGAY">BARANGAY</option>
          </HTMLSelect>
          <HTMLSelect value={ageBracket} onChange={(event) => setAgeBracket(event.target.value)}>
            <option value="">All age brackets</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
            <option value="65+">65+</option>
          </HTMLSelect>
          <HTMLSelect value={voterStatus} onChange={(event) => setVoterStatus(event.target.value)}>
            <option value="">Registered only</option>
            <option value="REGISTERED">REGISTERED</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DECEASED">DECEASED</option>
          </HTMLSelect>
        </div>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ width: 136, height: 136, borderRadius: "50%", background: donutGradient, position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 24,
                    borderRadius: "50%",
                    background: "var(--cds-layer-01)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 300 }}>{fmtNum.format(total)}</div>
                  <div className={Classes.TEXT_MUTED} style={{ fontSize: 10 }}>
                    voters
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {data.data.map((row) => (
                  <div key={`m04-legend-${row.gender}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: GENDER_COLORS[row.gender] ?? "#8d8d8d",
                      }}
                    />
                    <span>{row.gender}</span>
                    <span className={Classes.TEXT_MUTED}>
                      {fmtNum.format(row.count)} ({fmtPct.format(row.percentage)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, marginBottom: 6, color: "var(--cds-text-secondary)" }}>
                Horizontal comparison (sorted by female share)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {districtComparison.map((row) => (
                  <div key={`m04-bar-${row.district_name}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                      <span>{shortLabel(row.district_name, 24)}</span>
                      <span className={Classes.TEXT_MUTED}>{fmtPct.format(row.female_share)}% female</span>
                    </div>
                    <div style={{ height: 14, background: "var(--cds-layer-02)", borderRadius: 2, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${row.female_share}%`,
                          height: "100%",
                          background: "#4589ff",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* M05                                                                         */
/* -------------------------------------------------------------------------- */

interface M05Row {
  district_id: number;
  district_name: string;
  voter_count: number;
  land_area_sqkm: number;
  density_per_sqkm: number;
}

interface M05Response {
  metric_id: string;
  computed_at: string;
  data_provenance: string;
  applied_year: number;
  available_years: number[];
  summary: {
    total_barangays: number;
    total_voters: number;
  };
  data: M05Row[];
}

export function VoterDensityMap({ campaignId }: PanelProps) {
  const [year, setYear] = useState("");
  const [densityThreshold, setDensityThreshold] = useState(0);

  const params = useMemo(
    () => ({
      campaign_id: campaignId,
      year: year ? Number.parseInt(year, 10) : undefined,
      limit: 80,
    }),
    [campaignId, year]
  );

  const { data, loading, error, refetch } = usePanelFetch<M05Response>("/analytics/metrics/M05", params);

  const maxDensity = useMemo(
    () => Math.max(1, ...(data?.data ?? []).map((row) => row.density_per_sqkm)),
    [data]
  );

  const filteredRows = useMemo(
    () => (data?.data ?? []).filter((row) => row.density_per_sqkm >= densityThreshold),
    [data, densityThreshold]
  );

  const topTen = useMemo(
    () => [...(data?.data ?? [])].sort((left, right) => right.density_per_sqkm - left.density_per_sqkm).slice(0, 10),
    [data]
  );

  return (
    <Panel
      id="m05-VDB"
      name="Voter Density by Barangay"
      size="large"
      actions={<Button icon="refresh" minimal small onClick={refetch} aria-label="Refresh metric data" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <HTMLSelect value={year} onChange={(event) => setYear(event.target.value)}>
            <option value="">Applied year ({data?.applied_year ?? "latest"})</option>
            {(data?.available_years ?? []).map((value) => (
              <option key={`year-${value}`} value={value.toString()}>
                {value}
              </option>
            ))}
          </HTMLSelect>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            Density threshold
            <input
              type="range"
              min={0}
              max={Math.ceil(maxDensity)}
              step={0.5}
              value={densityThreshold}
              onChange={(event) => setDensityThreshold(Number.parseFloat(event.target.value))}
            />
            <span className={Classes.TEXT_MUTED}>{fmtPct.format(densityThreshold)}/km²</span>
          </label>

          {data && (
            <Tag minimal intent={Intent.PRIMARY}>
              Provenance: {data.data_provenance}
            </Tag>
          )}
        </div>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            <div
              style={{
                padding: 12,
                borderLeft: "3px solid #0f62fe",
                background: "var(--cds-layer-02)",
                borderRadius: 2,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 300 }}>{fmtNum.format(data.summary.total_voters)}</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, textTransform: "uppercase" }}>
                Total voters across {fmtNum.format(data.summary.total_barangays)} barangays
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, marginBottom: 6, color: "var(--cds-text-secondary)" }}>
                Choropleth map proxy (barangay density blocks)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))", gap: 6 }}>
                {filteredRows.map((row) => {
                  const heatStyle = blueHeat(row.density_per_sqkm, maxDensity);
                  return (
                    <div
                      key={`m05-cell-${row.district_id}`}
                      style={{
                        border: "1px solid var(--cds-border-subtle)",
                        borderRadius: 2,
                        padding: 8,
                        minHeight: 74,
                        background: heatStyle.background,
                        color: heatStyle.textColor,
                      }}
                      title={row.district_name}
                      aria-label={`${row.district_name} ${fmtPct.format(row.density_per_sqkm)} voters per square kilometer`}
                    >
                      <div style={{ fontSize: 10, fontWeight: 600 }}>{shortLabel(row.district_name, 12)}</div>
                      <div style={{ fontSize: 12, marginTop: 3 }}>{fmtPct.format(row.density_per_sqkm)}/km²</div>
                      <div style={{ fontSize: 10 }}>{fmtNum.format(row.voter_count)} voters</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, marginBottom: 6, color: "var(--cds-text-secondary)" }}>
                Top-10 density labels
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 6 }}>
                {topTen.map((row, index) => (
                  <div key={`m05-top-${row.district_id}`} style={{ border: "1px solid var(--cds-border-subtle)", borderRadius: 2, padding: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                      <span>#{index + 1} {shortLabel(row.district_name, 18)}</span>
                      <span>{fmtPct.format(row.density_per_sqkm)}/km²</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* M06                                                                         */
/* -------------------------------------------------------------------------- */

interface M06TrendRow {
  bucket: string;
  new_registrations: number;
}

interface M06Response {
  metric_id: string;
  computed_at: string;
  summary: {
    total_new_registrations: number;
    bucket_count: number;
  };
  trend: M06TrendRow[];
}

export function RegistrationTrendChart({ campaignId }: PanelProps) {
  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setDate(today.getDate() - 90);

  const [granularity, setGranularity] = useState<"week" | "month">("week");
  const [fromDate, setFromDate] = useState(toDateInput(defaultFrom));
  const [toDate, setToDate] = useState(toDateInput(today));

  const params = useMemo(
    () => ({
      campaign_id: campaignId,
      granularity,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }),
    [campaignId, granularity, fromDate, toDate]
  );

  const { data, loading, error, refetch } = usePanelFetch<M06Response>("/analytics/metrics/M06", params);

  const points = useMemo<SimplePoint[]>(
    () => (data?.trend ?? []).map((row) => ({ label: row.bucket, value: row.new_registrations })),
    [data]
  );

  return (
    <Panel
      id="m06-NVRT"
      name="New Voter Registration Trend"
      size="medium"
      actions={<Button icon="refresh" minimal small onClick={refetch} aria-label="Refresh metric data" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <HTMLSelect value={granularity} onChange={(event) => setGranularity(event.target.value as "week" | "month")}>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </HTMLSelect>

          <label style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
            From
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              style={{
                background: "var(--cds-field-01)",
                color: "var(--cds-text-primary)",
                border: "1px solid var(--cds-border-subtle)",
                padding: "2px 6px",
              }}
            />
          </label>

          <label style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
            To
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              style={{
                background: "var(--cds-field-01)",
                color: "var(--cds-text-primary)",
                border: "1px solid var(--cds-border-subtle)",
                padding: "2px 6px",
              }}
            />
          </label>
        </div>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            <div
              style={{
                padding: 12,
                borderLeft: "3px solid #0f62fe",
                background: "var(--cds-layer-02)",
                borderRadius: 2,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 300 }}>{fmtNum.format(data.summary.total_new_registrations)}</div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, textTransform: "uppercase" }}>
                New registrations in selected period
              </div>
            </div>

            <SimpleLineChart
              points={points}
              stroke="#0f62fe"
              fill="#0f62fe"
              ariaLabel="New voter registration trend chart across selected period"
            />
          </>
        )}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* M08                                                                         */
/* -------------------------------------------------------------------------- */

interface M08DistrictRow {
  district_id: number;
  district_name: string;
  district_type: string | null;
  persuadable_count: number;
  registered_count: number;
  percent_of_registered: number;
}

interface M08Response {
  metric_id: string;
  computed_at: string;
  summary: {
    persuadable_voters: number;
    total_registered: number;
    percent_of_registered: number;
    cwss_range: {
      low: number;
      high: number;
    };
  };
  data: M08DistrictRow[];
}

function splitPersuasionTiers(persuadableCount: number, districtShare: number) {
  const share = Math.max(0, Math.min(100, districtShare));
  const high = Math.round(persuadableCount * (0.2 + (share / 100) * 0.35));
  const medium = Math.round((persuadableCount - high) * 0.55);
  const low = Math.max(0, persuadableCount - high - medium);
  return { high, medium, low };
}

export function PersuadableSegmentPanel({ campaignId }: PanelProps) {
  const [lowInput, setLowInput] = useState("30");
  const [highInput, setHighInput] = useState("70");
  const [range, setRange] = useState({ low: 30, high: 70 });
  const [validationError, setValidationError] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      campaign_id: campaignId,
      cwss_low: range.low,
      cwss_high: range.high,
      limit: 40,
    }),
    [campaignId, range]
  );

  const { data, loading, error, refetch } = usePanelFetch<M08Response>("/analytics/metrics/M08", params);

  const maxPersuadable = useMemo(
    () => Math.max(1, ...(data?.data ?? []).map((row) => row.persuadable_count)),
    [data]
  );

  return (
    <Panel
      id="m08-PVS"
      name="Persuadable Voter Segment"
      size="large"
      actions={<Button icon="refresh" minimal small onClick={refetch} aria-label="Refresh metric data" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <InputGroup
            value={lowInput}
            onChange={(event) => setLowInput(event.target.value)}
            placeholder="CWSS low"
            aria-label="CWSS lower bound"
            small
            style={{ width: 110 }}
          />
          <InputGroup
            value={highInput}
            onChange={(event) => setHighInput(event.target.value)}
            placeholder="CWSS high"
            aria-label="CWSS upper bound"
            small
            style={{ width: 110 }}
          />
          <Button
            icon="filter"
            minimal
            small
            text="Apply"
            onClick={() => {
              const parsedLow = Number.parseInt(lowInput, 10);
              const parsedHigh = Number.parseInt(highInput, 10);
              if (!Number.isFinite(parsedLow) || !Number.isFinite(parsedHigh)) {
                setValidationError("CWSS bounds must be whole numbers.");
                return;
              }
              if (parsedLow >= parsedHigh) {
                setValidationError("CWSS low must be lower than CWSS high.");
                return;
              }
              setValidationError(null);
              setRange({ low: parsedLow, high: parsedHigh });
            }}
          />
          <Tag minimal intent={Intent.PRIMARY}>
            Applied range: {range.low} - {range.high}
          </Tag>
        </div>

        {validationError && (
          <Callout intent={Intent.DANGER} icon="error" title="Invalid CWSS range">
            {validationError}
          </Callout>
        )}

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: 12,
                  borderLeft: "3px solid #0f62fe",
                  background: "var(--cds-layer-02)",
                  borderRadius: 2,
                  minWidth: 220,
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 300 }}>{fmtNum.format(data.summary.persuadable_voters)}</div>
                <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, textTransform: "uppercase" }}>
                  Persuadable voters ({fmtPct.format(data.summary.percent_of_registered)}% of registered)
                </div>
              </div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                Registered base: {fmtNum.format(data.summary.total_registered)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, marginBottom: 6, color: "var(--cds-text-secondary)" }}>
                Stacked bar chart - persuasion tier mix per district
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.data.slice(0, 12).map((row) => {
                  const tiers = splitPersuasionTiers(row.persuadable_count, row.percent_of_registered);
                  const unit = 100 / maxPersuadable;
                  return (
                    <div key={`m08-${row.district_id}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                        <span>{shortLabel(row.district_name, 22)}</span>
                        <span className={Classes.TEXT_MUTED}>{fmtNum.format(row.persuadable_count)}</span>
                      </div>
                      <div style={{ display: "flex", height: 16, borderRadius: 2, overflow: "hidden", background: "var(--cds-layer-02)" }}>
                        <div style={{ width: `${tiers.high * unit}%`, background: "#0f62fe" }} title={`High: ${tiers.high}`} />
                        <div style={{ width: `${tiers.medium * unit}%`, background: "#78a9ff" }} title={`Medium: ${tiers.medium}`} />
                        <div style={{ width: `${tiers.low * unit}%`, background: "#8d8d8d" }} title={`Low: ${tiers.low}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8, fontSize: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, background: "#0f62fe" }} />High</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, background: "#78a9ff" }} />Medium</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, background: "#8d8d8d" }} />Low</span>
                <span className={Classes.TEXT_MUTED}>Tier split is estimated from district persuadable share.</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* M09                                                                         */
/* -------------------------------------------------------------------------- */

interface M09SparkPoint {
  date: string;
  completed_on_day: number;
}

interface M09Response {
  metric_id: string;
  computed_at: string;
  summary: {
    total_objectives: number;
    completed: number;
    denominator: number;
    completion_rate: number;
  };
  by_status: Record<string, number>;
  sparkline_14d: M09SparkPoint[];
}

function ObjectiveGauge({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 80;
  const circumference = Math.PI * radius;
  const progress = (clamped / 100) * circumference;

  return (
    <svg viewBox="0 0 200 120" style={{ width: 220, height: 132 }} role="img" aria-label={`Objective completion gauge ${fmtPct.format(clamped)} percent`}>
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--cds-layer-03)" strokeWidth={16} strokeLinecap="round" />
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="var(--cds-button-primary)"
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
      />
      <text x="100" y="88" textAnchor="middle" style={{ fontSize: 24, fontWeight: 300, fill: "var(--cds-text-primary)" }}>
        {fmtPct.format(clamped)}%
      </text>
    </svg>
  );
}

export function ObjectiveCompletionGauge({ campaignId }: PanelProps) {
  const [includeCancelled, setIncludeCancelled] = useState(false);

  const params = useMemo(
    () => ({
      campaign_id: campaignId,
      include_cancelled: includeCancelled,
    }),
    [campaignId, includeCancelled]
  );

  const { data, loading, error, refetch } = usePanelFetch<M09Response>("/analytics/metrics/M09", params);

  const sparkValues = useMemo(() => (data?.sparkline_14d ?? []).map((point) => point.completed_on_day), [data]);

  return (
    <Panel
      id="m09-OCR"
      name="Objective Completion Rate"
      size="small"
      actions={<Button icon="refresh" minimal small onClick={refetch} aria-label="Refresh metric data" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Checkbox
          checked={includeCancelled}
          onChange={(event) => setIncludeCancelled(event.currentTarget.checked)}
          label="Include cancelled objectives"
        />

        {loading && <LoadingState />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ObjectiveGauge percent={data.summary.completion_rate} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className={Classes.TEXT_MUTED}>Completed</span>
              <span>{fmtNum.format(data.summary.completed)} / {fmtNum.format(data.summary.denominator)}</span>
            </div>

            <div style={{ borderTop: "1px solid var(--cds-border-subtle)", paddingTop: 8 }}>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, marginBottom: 4 }}>
                14-day trend sparkline
              </div>
              <Sparkline values={sparkValues} />
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(data.by_status).map(([status, count]) => (
                <Tag key={`m09-status-${status}`} minimal>
                  {status}: {fmtNum.format(count)}
                </Tag>
              ))}
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
