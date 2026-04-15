import { useState } from "react";
import {
  Button,
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
} from "@blueprintjs/core";
import { useParams } from "react-router";
import type { TicketsQueryParams } from "../types";
import { useTickets } from "../hooks/useTickets";
import TicketFilterBar from "./TicketFilterBar";
import TicketListTable from "./TicketListTable";
import TicketCreateDialog from "./TicketCreateDialog";

export default function TicketsPage() {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [createOpen, setCreateOpen] = useState(false);
  const [params, setParams] = useState<TicketsQueryParams>({
    campaign_id: campaignId,
    page: 1,
    page_size: 25,
  });

  const { data, loading, error } = useTickets(params);

  return (
    <div style={{ padding: 24 }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Tickets</h2>
        {data && (
          <Tag minimal intent={Intent.NONE} style={{ fontSize: 12 }}>
            {data.total}
          </Tag>
        )}
        <div style={{ marginLeft: "auto" }}>
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="New Ticket"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ marginBottom: 16 }}>
        <TicketFilterBar
          params={params}
          onChange={setParams}
          hideCampaignFilter={Boolean(campaignId)}
        />
      </div>

      {/* Content area */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 60,
          }}
        >
          <Spinner size={20} />
        </div>
      )}

      {error && (
        <Callout
          intent={Intent.DANGER}
          icon="error"
          title="Could not load tickets"
          style={{ marginBottom: 16 }}
        >
          {error}
        </Callout>
      )}

      {!loading && !error && data && data.items.length === 0 && (
        <NonIdealState
          icon="clipboard"
          title="No tickets"
          description="Create the first ticket for this campaign."
          action={
            <Button
              intent={Intent.PRIMARY}
              text="New Ticket"
              onClick={() => setCreateOpen(true)}
            />
          }
        />
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <>
          <TicketListTable tickets={data.items} />

          {/* Pagination */}
          {data.total > data.page_size && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 16,
              }}
            >
              <Button
                small
                minimal
                disabled={data.page <= 1}
                text="Previous"
                onClick={() =>
                  setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))
                }
              />
              <span
                style={{
                  fontSize: 12,
                  lineHeight: "30px",
                  color: "var(--cds-text-secondary, #525252)",
                }}
              >
                Page {data.page} of {Math.ceil(data.total / data.page_size)}
              </span>
              <Button
                small
                minimal
                disabled={data.page * data.page_size >= data.total}
                text="Next"
                onClick={() =>
                  setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))
                }
              />
            </div>
          )}
        </>
      )}

      <TicketCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultCampaignId={campaignId}
      />
    </div>
  );
}
