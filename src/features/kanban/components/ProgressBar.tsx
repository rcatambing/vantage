import { ProgressBar as BpProgressBar, Intent } from "@blueprintjs/core";

interface ProgressBarProps {
  percent: number;
  milestoneCount: number;
  milestoneCompleted: number;
  compact?: boolean;
}

function getIntent(percent: number): Intent {
  if (percent >= 66) return Intent.SUCCESS;
  if (percent >= 33) return Intent.PRIMARY;
  return Intent.NONE;
}

export default function ProgressBar({ percent, milestoneCount, milestoneCompleted, compact }: ProgressBarProps) {
  if (milestoneCount === 0) {
    if (compact) {
      return <span className="kanban-card-progress-text">No milestones</span>;
    }
    return null;
  }

  const value = percent / 100;
  const intent = getIntent(percent);

  if (compact) {
    return (
      <div className="kanban-card-progress">
        <BpProgressBar value={value} intent={intent} stripes={false} animate={false} />
        <span className="kanban-card-progress-text">
          {milestoneCompleted}/{milestoneCount}
        </span>
      </div>
    );
  }

  return (
    <div className="kanban-progress-full">
      <BpProgressBar value={value} intent={intent} stripes={false} animate={false} />
      <div className="kanban-progress-full-text">
        {percent}% ({milestoneCompleted} of {milestoneCount} milestones)
      </div>
    </div>
  );
}
