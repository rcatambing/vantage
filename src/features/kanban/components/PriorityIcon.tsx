import { Icon } from "@blueprintjs/core";

interface PriorityIconProps {
  priority: number;
  size?: number;
}

const PRIORITY_CONFIG: Record<number, { icon: "arrow-up" | "minus" | "arrow-down"; color: string; label: string }> = {
  3: { icon: "arrow-up", color: "#DE350B", label: "High" },
  2: { icon: "minus", color: "#FF8B00", label: "Medium" },
  1: { icon: "arrow-down", color: "#0065FF", label: "Low" },
};

export default function PriorityIcon({ priority, size = 14 }: PriorityIconProps) {
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;

  return (
    <Icon
      icon={config.icon}
      size={size}
      color={config.color}
      title={`${config.label} priority`}
    />
  );
}
