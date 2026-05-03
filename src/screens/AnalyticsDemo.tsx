import { useState } from "react";
import { InputGroup, FormGroup, Button } from "@blueprintjs/core";
import {
  AgeDemographicsChart,
  GenderDemographicsPanel,
  ObjectiveCompletionGauge,
  PersuadableSegmentPanel,
  RegistrationRateMap,
  RegistrationTrendChart,
  VoterCountPanel,
  VoterDensityMap,
} from "../features/analytics/voterMetrics/VoterMetricPanels";
import TurnoutEstimatePanel from "../features/analytics/m07/TurnoutEstimatePanel";
import TaskCompletionPanel from "../features/analytics/m10/TaskCompletionPanel";
import TaskOverduePanel from "../features/analytics/m11/TaskOverduePanel";
import MilestoneProgressPanel from "../features/analytics/m12/MilestoneProgressPanel";
import PhaseAdherencePanel from "../features/analytics/m13/PhaseAdherencePanel";
import ActiveCampaignPanel from "../features/analytics/m15/ActiveCampaignPanel";
import ObjectiveTaskRatioPanel from "../features/analytics/m16/ObjectiveTaskRatioPanel";
import M17Panel from "../features/analytics/m17/M17Panel";
import M18Panel from "../features/analytics/m18/M18Panel";
import M19Panel from "../features/analytics/m19/M19Panel";
import M20Panel from "../features/analytics/m20/M20Panel";
import M21Panel from "../features/analytics/m21/M21Panel";
import M22Panel from "../features/analytics/m22/M22Panel";
import M23Panel from "../features/analytics/m23/M23Panel";
import M24Panel from "../features/analytics/m24/M24Panel";
import M25Panel from "../features/analytics/m25/M25Panel";
import M26Panel from "../features/analytics/m26/M26Panel";
import M27Panel from "../features/analytics/m27/M27Panel";
import M28Panel from "../features/analytics/m28/M28Panel";
import M29Panel from "../features/analytics/m29/M29Panel";
import M30Panel from "../features/analytics/m30/M30Panel";
import M31Panel from "../features/analytics/m31/M31Panel";
import M32Panel from "../features/analytics/m32/M32Panel";
import M33Panel from "../features/analytics/m33/M33Panel";
import M34Panel from "../features/analytics/m34/M34Panel";
import M36Panel from "../features/analytics/m36/M36Panel";
import M37Panel from "../features/analytics/m37/M37Panel";
import M38Panel from "../features/analytics/m38/M38Panel";
import M39Panel from "../features/analytics/m39/M39Panel";
import M40Panel from "../features/analytics/m40/M40Panel";
import M51Panel from "../features/analytics/m51/M51Panel";
import M35Panel from "../features/analytics/m35/M35Panel";
import M41Panel from "../features/analytics/m41/M41Panel";
import M42Panel from "../features/analytics/m42/M42Panel";
import M43Panel from "../features/analytics/m43/M43Panel";
import M44Panel from "../features/analytics/m44/M44Panel";

const DEFAULT_CAMPAIGN_ID = "1";

export default function AnalyticsDemo() {
  const [campaignId, setCampaignId] = useState(DEFAULT_CAMPAIGN_ID);
  const [inputValue, setInputValue] = useState(DEFAULT_CAMPAIGN_ID);

  function handleApply() {
    const trimmed = inputValue.trim();
    if (trimmed) setCampaignId(trimmed);
  }

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: 0 }}>
          Analytics Demo
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--cds-text-secondary)" }}>
          Live metric panels for M01-M16, including the newly added M01-M09 voter analytics visualizations.
        </p>
      </div>

      {/* Campaign selector */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          padding: "16px",
          background: "var(--cds-layer-01)",
          borderRadius: 2,
          maxWidth: 480,
        }}
      >
        <FormGroup
          label="Campaign ID"
          style={{ margin: 0, flex: 1 }}
          helperText={
            <span style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>
              Used by M01-M14 and M16 panels (M15 is portfolio-level)
            </span>
          }
        >
          <InputGroup
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="e.g. 1 or a UUID"
            small
            aria-label="Campaign ID"
            rightElement={
              <Button
                onClick={handleApply}
                intent="primary"
                small
                style={{ borderRadius: 0 }}
              >
                Apply
              </Button>
            }
          />
        </FormGroup>
      </div>

      {/* Metric panels */}
      <section aria-label="M01 - Registered Voter Count">
        <VoterCountPanel campaignId={campaignId} />
      </section>

      <section aria-label="M02 - Voter Registration Rate">
        <RegistrationRateMap campaignId={campaignId} />
      </section>

      <section aria-label="M03 - Demographic Breakdown Age">
        <AgeDemographicsChart campaignId={campaignId} />
      </section>

      <section aria-label="M04 - Demographic Breakdown Gender">
        <GenderDemographicsPanel campaignId={campaignId} />
      </section>

      <section aria-label="M05 - Voter Density by Barangay">
        <VoterDensityMap campaignId={campaignId} />
      </section>

      <section aria-label="M06 - New Voter Registration Trend">
        <RegistrationTrendChart campaignId={campaignId} />
      </section>

      <section aria-label="M07 - Voter Turnout Estimate">
        <TurnoutEstimatePanel campaignId={campaignId} />
      </section>

      <section aria-label="M08 - Persuadable Voter Segment">
        <PersuadableSegmentPanel campaignId={campaignId} />
      </section>

      <section aria-label="M09 - Objective Completion Rate">
        <ObjectiveCompletionGauge campaignId={campaignId} />
      </section>

      <section aria-label="M10 - Task Completion Rate">
        <TaskCompletionPanel campaignId={campaignId} />
      </section>

      <section aria-label="M11 - Task Overdue Rate">
        <TaskOverduePanel campaignId={campaignId} />
      </section>

      <section aria-label="M12 - Milestone Progress">
        <MilestoneProgressPanel campaignId={campaignId} />
      </section>

      <section aria-label="M13 - Campaign Phase Adherence">
        <PhaseAdherencePanel campaignId={campaignId} />
      </section>

      <section aria-label="M15 - Active Campaign Count">
        <ActiveCampaignPanel />
      </section>

      <section aria-label="M16 - Objective-to-Task Ratio">
        <ObjectiveTaskRatioPanel campaignId={campaignId} />
      </section>

      <section aria-label="M17 - Favorability Rating">
        <M17Panel campaignId={campaignId} />
      </section>

      <section aria-label="M18 - Unfavorability Rating">
        <M18Panel campaignId={campaignId} />
      </section>

      <section aria-label="M19 - Net Favorability">
        <M19Panel campaignId={campaignId} />
      </section>

      <section aria-label="M20 - Issue Salience Ranking">
        <M20Panel campaignId={campaignId} />
      </section>

      <section aria-label="M21 - Sentiment Trend Over Time">
        <M21Panel campaignId={campaignId} />
      </section>

      <section aria-label="M22 - Regional Sentiment Variance">
        <M22Panel campaignId={campaignId} />
      </section>

      <section aria-label="M23 - Poll Completion Rate">
        <M23Panel campaignId={campaignId} />
      </section>

      <section aria-label="M24 - Poll Response Rate">
        <M24Panel campaignId={campaignId} />
      </section>

      <section aria-label="M25 - Head-to-Head Matchup">
        <M25Panel campaignId={campaignId} />
      </section>

      <section aria-label="M26 - Margin of Victory Defeat">
        <M26Panel campaignId={campaignId} />
      </section>

      <section aria-label="M27 - Staff Headcount by Type">
        <M27Panel campaignId={campaignId} />
      </section>

      <section aria-label="M28 - Staff Assignment Coverage">
        <M28Panel campaignId={campaignId} />
      </section>

      <section aria-label="M29 - Task Completion Rate per Staff">
        <M29Panel campaignId={campaignId} />
      </section>

      <section aria-label="M30 - Average Task Completion Rating">
        <M30Panel campaignId={campaignId} />
      </section>

      <section aria-label="M31 - Staff Evaluation Score">
        <M31Panel campaignId={campaignId} />
      </section>

      <section aria-label="M32 - Intel Submission Rate">
        <M32Panel campaignId={campaignId} />
      </section>

      <section aria-label="M33 - Area Assignment Utilization">
        <M33Panel campaignId={campaignId} />
      </section>

      <section aria-label="M34 - Volunteer Retention Rate">
        <M34Panel campaignId={campaignId} />
      </section>

      <section aria-label="M36 - Barangay Support Index">
        <M36Panel campaignId={campaignId} />
      </section>

      <section aria-label="M37 - Battleground District Identification">
        <M37Panel campaignId={campaignId} />
      </section>

      <section aria-label="M38 - Geographic Coverage Gap">
        <M38Panel campaignId={campaignId} />
      </section>

      <section aria-label="M39 - Regional Intel Density">
        <M39Panel campaignId={campaignId} />
      </section>

      <section aria-label="M40 - District Readiness Score">
        <M40Panel campaignId={campaignId} />
      </section>

      <section aria-label="M51 - Staff-to-Voter Ratio">
        <M51Panel campaignId={campaignId} />
      </section>

      <section aria-label="M35 - District Voter Penetration">
        <M35Panel campaignId={campaignId} />
      </section>

      <section aria-label="M41 - Voter Contact Rate">
        <M41Panel campaignId={campaignId} />
      </section>

      <section aria-label="M42 - Touchpoints per Voter">
        <M42Panel campaignId={campaignId} />
      </section>

      <section aria-label="M43 - Door-to-Door Canvass Rate">
        <M43Panel campaignId={campaignId} />
      </section>

      <section aria-label="M44 - Rally/Event Attendance">
        <M44Panel campaignId={campaignId} />
      </section>
    </div>
  );
}
