import { Tag } from "@blueprintjs/core";
import { useNavigate } from "react-router";
import type { TicketRelationship, TicketRelationshipKind } from "../types";

interface Props {
  relationships: TicketRelationship[];
}

const KIND_LABEL: Record<TicketRelationshipKind, string> = {
  DEPENDS: "Depends on",
  DUPLICATES: "Duplicates",
  RELATES_TO: "Relates to",
  CLONES: "Clones",
};

export default function RelationshipGraph({ relationships }: Props) {
  const navigate = useNavigate();

  if (relationships.length === 0) return null;

  // Group by kind
  const grouped = relationships.reduce<
    Record<string, TicketRelationship[]>
  >((acc, rel) => {
    const key = rel.kind;
    if (!acc[key]) acc[key] = [];
    acc[key].push(rel);
    return acc;
  }, {});

  return (
    <section>
      <h4
        className="bp5-heading"
        style={{ fontSize: 14, marginBottom: 8 }}
      >
        Related Tickets
      </h4>
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
                  cursor: "pointer",
                  padding: "4px 0",
                  fontSize: 13,
                }}
                onClick={() => navigate(`/tickets/${rel.related_ticket_id}`)}
              >
                <code style={{ marginRight: 6 }}>
                  {rel.related_ticket_number}
                </code>
                {rel.related_ticket_title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
