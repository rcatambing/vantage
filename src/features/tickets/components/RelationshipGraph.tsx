import { useState } from "react";
import { Tag, Intent, Button, HTMLSelect, FormGroup } from "@blueprintjs/core";
import { useNavigate } from "react-router";
import type { TicketRelationship, TicketRelationshipKind } from "../types";
import { useTicketMutations } from "../hooks/useTicketMutations";

interface Props {
  ticketId: string;
  relationships: TicketRelationship[];
  onMutate: () => void;
}

const KIND_LABEL: Record<TicketRelationshipKind, string> = {
  DEPENDS: "Depends on",
  DUPLICATES: "Duplicates",
  RELATES_TO: "Relates to",
  CLONES: "Clones",
};

const KIND_OPTIONS: { value: TicketRelationshipKind; label: string }[] = [
  { value: "DEPENDS", label: "Depends on" },
  { value: "DUPLICATES", label: "Duplicates" },
  { value: "RELATES_TO", label: "Relates to" },
  { value: "CLONES", label: "Clones" },
];

export default function RelationshipGraph({
  ticketId,
  relationships,
  onMutate,
}: Props) {
  const navigate = useNavigate();
  const { addRelationship, removeRelationship } = useTicketMutations({
    onSuccess: onMutate,
  });

  const [adding, setAdding] = useState(false);
  const [newKind, setNewKind] = useState<TicketRelationshipKind>("RELATES_TO");
  const [targetTicketId, setTargetTicketId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (relationships.length === 0 && !adding) {
    return (
      <section style={{ marginTop: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h4 className="bp5-heading" style={{ fontSize: 14, margin: 0 }}>
            Related Tickets
          </h4>
          <Button
            small
            minimal
            icon="plus"
            text="Add"
            onClick={() => setAdding(true)}
          />
        </div>
        <p
          className="bp5-text-muted"
          style={{ fontSize: 13, fontStyle: "italic" }}
        >
          No relationships yet.
        </p>
      </section>
    );
  }

  // Group by kind
  const grouped = relationships.reduce<
    Record<string, TicketRelationship[]>
  >((acc, rel) => {
    const key = rel.kind;
    if (!acc[key]) acc[key] = [];
    acc[key].push(rel);
    return acc;
  }, {});

  const handleAdd = async () => {
    const targetId = targetTicketId.trim();
    if (!targetId) return;
    setSubmitting(true);
    const success = await addRelationship(ticketId, {
      kind: newKind,
      related_ticket_id: targetId,
    });
    setSubmitting(false);
    if (success) {
      setTargetTicketId("");
      setAdding(false);
    }
  };

  const handleRemove = async (relId: string) => {
    await removeRelationship(ticketId, relId);
  };

  return (
    <section style={{ marginTop: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <h4 className="bp5-heading" style={{ fontSize: 14, margin: 0 }}>
          Related Tickets
        </h4>
        {!adding && (
          <Button
            small
            minimal
            icon="plus"
            text="Add"
            onClick={() => setAdding(true)}
          />
        )}
      </div>

      {adding && (
        <div
          style={{
            padding: 12,
            background: "var(--cds-layer-01, #262626)",
            marginBottom: 12,
          }}
        >
          <FormGroup label="Relationship kind" style={{ marginBottom: 8 }}>
            <HTMLSelect
              value={newKind}
              onChange={(e) =>
                setNewKind(e.target.value as TicketRelationshipKind)
              }
              options={KIND_OPTIONS}
              fill
            />
          </FormGroup>
          <FormGroup label="Target ticket ID" style={{ marginBottom: 8 }}>
            <input
              type="text"
              value={targetTicketId}
              onChange={(e) => setTargetTicketId(e.target.value)}
              placeholder="Enter ticket ID…"
              style={{
                width: "100%",
                padding: "6px 10px",
                fontSize: 13,
                background: "var(--cds-field-01, #393939)",
                border: "none",
                borderBottom: "1px solid var(--cds-border-strong, #525252)",
                color: "var(--cds-text-primary, #f4f4f4)",
                outline: "none",
              }}
            />
          </FormGroup>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button
              small
              minimal
              text="Cancel"
              onClick={() => {
                setAdding(false);
                setTargetTicketId("");
              }}
            />
            <Button
              small
              intent={Intent.PRIMARY}
              text="Add Relationship"
              onClick={handleAdd}
              loading={submitting}
              disabled={!targetTicketId.trim()}
            />
          </div>
        </div>
      )}

      {Object.entries(grouped).map(([kind, rels]) => (
        <div key={kind} style={{ marginBottom: 12 }}>
          <Tag minimal style={{ marginBottom: 4 }}>
            {KIND_LABEL[kind as TicketRelationshipKind] ?? kind}
          </Tag>
          <ul
            className="bp5-list bp5-list-unstyled"
            style={{ margin: "4px 0 0 8px" }}
          >
            {rels.map((rel) => (
              <li
                key={rel.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 0",
                  fontSize: 13,
                }}
              >
                <span
                  style={{ cursor: "pointer", flex: 1 }}
                  onClick={() =>
                    navigate(`/tickets/${rel.related_ticket_id}`)
                  }
                  role="link"
                  aria-label={`Open related ticket ${rel.related_ticket_number}`}
                >
                  <code style={{ marginRight: 6 }}>
                    {rel.related_ticket_number}
                  </code>
                  {rel.related_ticket_title}
                </span>
                <Button
                  icon="cross"
                  minimal
                  small
                  intent={Intent.DANGER}
                  onClick={() => handleRemove(rel.id)}
                  aria-label={`Remove relationship with ${rel.related_ticket_number}`}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
