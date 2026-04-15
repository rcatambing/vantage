import { Tag, Tooltip } from "@blueprintjs/core";

interface Props {
  isDerived: boolean;
  affiliationName?: string;
}

export function DerivedSignalBadge({ isDerived, affiliationName }: Props) {
  if (!isDerived) {
    return (
      <Tag minimal intent="none" style={{ borderRadius: 0, fontSize: 11, letterSpacing: "0.08em" }}>
        MANUAL
      </Tag>
    );
  }
  return (
    <Tooltip
      content={`Auto-derived from affiliation: ${affiliationName ?? "unknown"}`}
    >
      <Tag minimal intent="primary" style={{ borderRadius: 0, fontSize: 11, letterSpacing: "0.08em" }}>
        AUTO
      </Tag>
    </Tooltip>
  );
}
