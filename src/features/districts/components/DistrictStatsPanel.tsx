import { Card, Elevation, ProgressBar } from "@blueprintjs/core";
import KpiCard from "../../../widgets/KpiCard";
import type { DistrictStatistics } from "../types";

interface Props {
  stats: DistrictStatistics;
}

/**
 * Statistics panel for a district.
 * Card grid with population, voters, turnout estimate,
 * age distribution (BarChart placeholder), and gender distribution (DonutChart placeholder).
 * Uses KpiCard widget.
 */
export default function DistrictStatsPanel({ stats }: Props) {
  const fmtNum = new Intl.NumberFormat("en-PH");
  const fmtPct = new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const turnout = stats.turnout_estimate ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        <Card elevation={Elevation.ZERO} style={{ background: "var(--cds-layer-01)", borderRadius: 0 }}>
          <KpiCard
            label="Population"
            value={fmtNum.format(stats.population_count)}
            icon="people"
          />
        </Card>

        <Card elevation={Elevation.ZERO} style={{ background: "var(--cds-layer-01)", borderRadius: 0 }}>
          <KpiCard
            label="Registered Voters"
            value={fmtNum.format(stats.voter_count)}
            icon="id-number"
          />
        </Card>

        <Card elevation={Elevation.ZERO} style={{ background: "var(--cds-layer-01)", borderRadius: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="kpi-label">Turnout Estimate</div>
            <div className="kpi-value">{fmtPct.format(turnout)}%</div>
            <ProgressBar
              value={turnout / 100}
              intent={turnout >= 70 ? "success" : turnout >= 50 ? "warning" : "danger"}
              stripes={false}
            />
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        <Card elevation={Elevation.ZERO} style={{ background: "var(--cds-layer-01)", borderRadius: 0, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Age Distribution</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(stats.age_distribution).map(([age, count]) => {
              const max = Math.max(...Object.values(stats.age_distribution));
              const pct = max > 0 ? count / max : 0;
              return (
                <div key={age} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 40, fontSize: 11, textAlign: "right" }}>{age}</div>
                  <div style={{ flex: 1, height: 16, background: "var(--cds-layer-02)" }}>
                    <div
                      style={{
                        width: `${pct * 100}%`,
                        height: "100%",
                        background: "var(--cds-interactive)",
                      }}
                    />
                  </div>
                  <div style={{ width: 50, fontSize: 11, textAlign: "right" }}>{fmtNum.format(count)}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card elevation={Elevation.ZERO} style={{ background: "var(--cds-layer-01)", borderRadius: 0, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Gender Distribution</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(stats.gender_distribution).map(([gender, count]) => {
              const total = Object.values(stats.gender_distribution).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? count / total : 0;
              return (
                <div key={gender} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 60, fontSize: 11, textTransform: "capitalize" }}>{gender.toLowerCase()}</div>
                  <div style={{ flex: 1, height: 16, background: "var(--cds-layer-02)" }}>
                    <div
                      style={{
                        width: `${pct * 100}%`,
                        height: "100%",
                        background: gender.toLowerCase() === "male" ? "#0f62fe" : gender.toLowerCase() === "female" ? "#ff7eb6" : "#8d8d8d",
                      }}
                    />
                  </div>
                  <div style={{ width: 50, fontSize: 11, textAlign: "right" }}>{fmtNum.format(count)}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
