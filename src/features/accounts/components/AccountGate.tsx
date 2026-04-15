import React from "react";
import { NonIdealState, Spinner } from "@blueprintjs/core";
import { useParams } from "react-router";
import { useCampaign } from "../../campaigns/hooks/useCampaign";
import type { CampaignType } from "../../campaigns/types";
import { getDemoCampaignType } from "../demoData";

interface Props {
  children: React.ReactNode;
  allowedTypes: CampaignType[];
  deniedMessage: string;
}

export function AccountGate({ children, allowedTypes, deniedMessage }: Props) {
  const { campaignId } = useParams<{ campaignId: string }>();
  const numericId = parseInt(campaignId ?? "", 10);
  const { campaign, loading } = useCampaign(isNaN(numericId) ? -1 : numericId);
  const demoCampaignType = getDemoCampaignType(campaignId);
  const effectiveCampaignType = campaign?.campaign_type ?? demoCampaignType;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (!effectiveCampaignType) {
    return (
      <NonIdealState
        icon="warning-sign"
        title="Campaign unavailable"
        description="Unable to load campaign context for this page."
      />
    );
  }

  if (!allowedTypes.includes(effectiveCampaignType)) {
    return (
      <NonIdealState
        icon="lock"
        title="Not available for this campaign type"
        description={deniedMessage}
      />
    );
  }

  return <>{children}</>;
}
