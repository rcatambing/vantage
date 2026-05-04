import { Tag } from "@blueprintjs/core";
import type { DistrictType } from "../types";

const TYPE_COLORS: Record<DistrictType, string> = {
  PROVINCE: "#0f62fe",
  CITY: "#009d9a",
  BARANGAY: "#8d8d8d",
};

interface Props {
  type: DistrictType;
}

/**
 * Maps district type to a colored pill tag.
 * PROVINCE → blue, CITY → teal, BARANGAY → gray.
 */
export default function DistrictTypeTag({ type }: Props) {
  return (
    <Tag
      minimal
      style={{
        backgroundColor: TYPE_COLORS[type] ?? "#8d8d8d",
        color: "#fff",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: 0.3,
        textTransform: "uppercase",
      }}
    >
      {type}
    </Tag>
  );
}
