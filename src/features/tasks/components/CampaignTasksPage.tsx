import { useState } from "react";
import {
  Button,
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
  HTMLSelect,
  InputGroup,
  Checkbox,
  ControlGroup,
} from "@blueprintjs/core";
import { useParams } from "react-router";
import type { TasksQueryParams, TaskStatus } from "../types";
import { useTasks } from "../hooks/useTasks";
import TaskListTable from "./TaskListTable";
import TaskCreateDialog from "./TaskCreateDialog";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "BLOCKED", label: "Blocked" },
];

export default function CampaignTasksPage() {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const [createOpen, setCreateOpen] = useState(false);
  const [params, setParams] = useState<TasksQueryParams>({
    campaign_id: campaignId,
    page: 1,
    page_size: 25,
  });

  const { data, loading, error } = useTasks(params);

  const hasFilters =
    params.status || params.assignee_id || params.is_overdue;

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
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Tasks</h2>
        {data && (
          <Tag minimal intent={Intent.NONE} style={{ fontSize: 12 }}>
            {data.total}
          </Tag>
        )}
        <div style={{ marginLeft: "auto" }}>
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="New Task"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ marginBottom: 16 }}>
        <ControlGroup fill={false} style={{ gap: 8, flexWrap: "wrap" }}>
          <HTMLSelect
            value={params.status ?? ""}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                status: (e.target.value as TaskStatus) || undefined,
                page: 1,
              }))
            }
            options={STATUS_OPTIONS}
            style={{ width: 150 }}
          />
          <InputGroup
            placeholder="Assignee ID…"
            value={params.assignee_id ?? ""}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                assignee_id: e.target.value || undefined,
                page: 1,
              }))
            }
            leftIcon="user"
            small
            style={{ width: 160 }}
          />
          <Checkbox
            checked={params.is_overdue ?? false}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                is_overdue: e.target.checked || undefined,
                page: 1,
              }))
            }
            label="Overdue only"
            style={{ margin: "0 8px" }}
          />
          {hasFilters && (
            <Button
              small
              minimal
              icon="filter-remove"
              text="Clear"
              onClick={() =>
                setParams({
                  campaign_id: campaignId,
                  page: 1,
                  page_size: 25,
                })
              }
            />
          )}
        </ControlGroup>
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
          title="Could not load tasks"
          style={{ marginBottom: 16 }}
        >
          {error}
        </Callout>
      )}

      {!loading && !error && data && data.items.length === 0 && (
        <NonIdealState
          icon="clipboard"
          title="No tasks"
          description="Create the first task for this campaign."
          action={
            <Button
              intent={Intent.PRIMARY}
              text="New Task"
              onClick={() => setCreateOpen(true)}
            />
          }
        />
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <>
          <TaskListTable tasks={data.items} />

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

      <TaskCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultCampaignId={campaignId}
      />
    </div>
  );
}
