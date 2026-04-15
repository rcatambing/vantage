import { useState, useEffect, useCallback } from "react";
import { Button, Intent, NonIdealState, Spinner, Callout, Tag } from "@blueprintjs/core";
import { useNavigate } from "react-router";
import { listOfficeResources } from "../../resources/api/resourceApi";
import type { Resource } from "../../resources/types";
import { ResourceStatusTag } from "../../resources/components/ResourceStatusTag";
import { ResourceTypeBadge } from "../../resources/components/ResourceTypeBadge";
import { ResourceConditionTag } from "../../resources/components/ResourceConditionTag";
import { HTMLTable } from "@blueprintjs/core";

interface Props {
  officeId: string;
}

export function OfficeResourcesPanel({ officeId }: Props) {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResources = useCallback(() => {
    if (!officeId) return;
    setLoading(true);
    setError(null);
    listOfficeResources(officeId)
      .then(setResources)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load resources")
      )
      .finally(() => setLoading(false));
  }, [officeId]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  if (loading) return <Spinner />;
  if (error) return <Callout intent={Intent.DANGER} icon="error">{error}</Callout>;

  if (resources.length === 0) {
    return (
      <NonIdealState
        icon="box"
        title="No resources assigned"
        description="Assign resources to this office from the Resources page."
        action={
          <Button
            intent={Intent.PRIMARY}
            text="Go to Resources"
            onClick={() => navigate("/resources")}
          />
        }
      />
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Tag minimal>{resources.length} assigned</Tag>
        <div style={{ marginLeft: "auto" }}>
          <Button
            small
            minimal
            icon="share"
            text="Manage in Resources"
            onClick={() => navigate("/resources")}
          />
        </div>
      </div>
      <HTMLTable striped interactive bordered style={{ width: "100%", fontSize: 12 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Type</th>
            <th>Status</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r) => (
            <tr
              key={r.id}
              onClick={() => navigate(`/resources/${r.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td><span style={{ fontWeight: 600 }}>{r.resource_name}</span></td>
              <td style={{ color: "var(--cds-text-secondary, #525252)" }}>
                {r.resource_code ?? "—"}
              </td>
              <td><ResourceTypeBadge type={r.resource_type} /></td>
              <td><ResourceStatusTag status={r.status} /></td>
              <td><ResourceConditionTag condition={r.condition} /></td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  );
}
