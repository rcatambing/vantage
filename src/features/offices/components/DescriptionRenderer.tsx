import { NonIdealState } from "@blueprintjs/core";

interface Props {
  description: string | null;
}

export function DescriptionRenderer({ description }: Props) {
  if (!description || description.trim().length === 0) {
    return (
      <NonIdealState
        icon="document"
        title="No description"
        description="Add a description to provide context for this office."
      />
    );
  }

  return (
    <p
      style={{
        fontSize: 13,
        lineHeight: 1.7,
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {description}
    </p>
  );
}
