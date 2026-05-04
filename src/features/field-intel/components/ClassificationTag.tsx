import { Tag, Intent } from "@blueprintjs/core";
import type { IntelClassification } from "../types";
import { CLASSIFICATION_LABEL } from "../types";

const CLASSIFICATION_INTENT: Record<IntelClassification, Intent> = {
  PUBLIC: Intent.SUCCESS,
  INTERNAL: Intent.PRIMARY,
  CONFIDENTIAL: Intent.WARNING,
  SECRET: Intent.DANGER,
};

interface Props {
  classification: IntelClassification;
}

export default function ClassificationTag({ classification }: Props) {
  return (
    <Tag
      intent={CLASSIFICATION_INTENT[classification]}
      minimal
      style={{
        borderRadius: 24,
        padding: "2px 12px",
        fontSize: 12,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {CLASSIFICATION_LABEL[classification]}
    </Tag>
  );
}
