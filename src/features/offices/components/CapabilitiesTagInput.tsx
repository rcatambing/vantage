import { Tag, TagInput } from "@blueprintjs/core";

interface Props {
  values: string[];
  onChange?: (values: string[]) => void;
  readOnly?: boolean;
}

export function CapabilitiesTagInput({ values, onChange, readOnly = false }: Props) {
  if (readOnly) {
    if (values.length === 0) {
      return <span style={{ fontSize: 13, color: "var(--cds-text-secondary, #525252)" }}>—</span>;
    }
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {values.map((v) => (
          <Tag key={v} minimal>
            {v}
          </Tag>
        ))}
      </div>
    );
  }

  return (
    <TagInput
      values={values}
      onChange={(newValues) => onChange?.(newValues as string[])}
      addOnBlur
      placeholder="Add capability…"
      fill
    />
  );
}
