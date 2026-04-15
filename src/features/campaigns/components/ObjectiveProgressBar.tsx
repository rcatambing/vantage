import { ProgressBar, Intent } from "@blueprintjs/core";

interface Props {
  /** 0–100 progress value from the server (BR-023) */
  value: number;
}

function progressIntent(value: number): Intent {
  if (value < 30) return Intent.DANGER;
  if (value < 70) return Intent.WARNING;
  return Intent.SUCCESS;
}

export default function ObjectiveProgressBar({ value }: Props) {
  const normalized = Math.min(1, Math.max(0, value / 100));
  return (
    <ProgressBar
      value={normalized}
      intent={progressIntent(value)}
      animate={false}
      stripes={false}
    />
  );
}
