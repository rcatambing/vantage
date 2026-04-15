import { useState } from "react";
import {
  Button,
  Callout,
  Intent,
  NonIdealState,
  Spinner,
  Switch,
  Tag,
} from "@blueprintjs/core";
import { useNavigate, useSearchParams } from "react-router";
import { useResourceList } from "../hooks/useResourceList";
import { ResourceFilterBar } from "./ResourceFilterBar";
import { ResourceListTable } from "./ResourceListTable";
import { ResourceCreateDialog } from "./ResourceCreateDialog";
import type { ResourceStatus, ResourceType, ResourceCondition } from "../types";
import { ACTIVE_RESOURCE_STATUSES } from "../types";

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const showAll = searchParams.get("show_all") === "true";

  const [search, setSearch] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState<ResourceType | "">("");
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "">("");
  const [conditionFilter, setConditionFilter] = useState<ResourceCondition | "">("");
  const [createOpen, setCreateOpen] = useState(false);

  const { items, total, loading, error, refetch } = useResourceList(
    statusFilter
      ? {
          status: statusFilter,
          resource_type: resourceTypeFilter || undefined,
          condition: conditionFilter || undefined,
          search: search || undefined,
        }
      : {
          resource_type: resourceTypeFilter || undefined,
          condition: conditionFilter || undefined,
          search: search || undefined,
        }
  );

  // Client-side status filter when no explicit status is selected and showAll is false
  const displayed =
    statusFilter || showAll
      ? items
      : items.filter((r) => ACTIVE_RESOURCE_STATUSES.includes(r.status));

  const toggleShowAll = (checked: boolean) => {
    setSearchParams(checked ? { show_all: "true" } : {});
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout
        intent={Intent.DANGER}
        icon="error"
        title="Failed to load resources"
        style={{ margin: 24 }}
      >
        {error}
        <br />
        <Button
          minimal
          intent={Intent.DANGER}
          text="Retry"
          onClick={refetch}
          style={{ marginTop: 8 }}
        />
      </Callout>
    );
  }

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
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Resources</h2>
        <Tag minimal style={{ fontSize: 12 }}>
          {displayed.length}
        </Tag>
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}
        >
          <Switch
            label="Show all statuses"
            checked={showAll}
            onChange={(e) => toggleShowAll((e.target as HTMLInputElement).checked)}
            inline
            style={{ marginBottom: 0 }}
          />
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="New Resource"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Filters */}
      <ResourceFilterBar
        search={search}
        onSearchChange={setSearch}
        resourceTypeFilter={resourceTypeFilter}
        onResourceTypeChange={setResourceTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        conditionFilter={conditionFilter}
        onConditionChange={setConditionFilter}
      />

      {/* Content */}
      {displayed.length === 0 ? (
        <NonIdealState
          icon="box"
          title={showAll ? "No resources found" : "No active resources"}
          description={
            showAll
              ? "Create the first resource to get started."
              : "All resources are inactive. Toggle the switch above to view them."
          }
          action={
            <Button
              icon="plus"
              intent={Intent.PRIMARY}
              text="New Resource"
              onClick={() => setCreateOpen(true)}
            />
          }
        />
      ) : (
        <ResourceListTable
          resources={displayed}
          onRowClick={(id) => navigate(`/resources/${id}`)}
        />
      )}

      <ResourceCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={refetch}
      />
    </div>
  );
}
