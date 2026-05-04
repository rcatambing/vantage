import { NonIdealState, Icon } from "@blueprintjs/core";
import { useParams } from "react-router";
import { useCampaign } from "../../campaigns/hooks/useCampaign";

interface Props {
  children: React.ReactNode;
}

export default function ElectionOnlyGate({ children }: Props) {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const numericId = campaignId ? parseInt(campaignId, 10) : NaN;
  const { campaign, loading } = useCampaign(isNaN(numericId) ? -1 : numericId);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
        <Icon icon="refresh" className="bp5-icon-spin" />
      </div>
    );
  }

  if (!campaign || campaign.campaign_type !== "ELECTION") {
    return (
      <div style={{ padding: 24 }}>
        <NonIdealState
          icon="lock"
          title="Election campaigns only"
          description="The voter registry is only available for Election-type campaigns."
        />
      </div>
    );
  }

  return <>{children}</>;
}
