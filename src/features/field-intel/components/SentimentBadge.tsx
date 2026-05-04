import { Tag, Intent } from "@blueprintjs/core";
import type { SentimentLevel } from "../types";
import { SENTIMENT_LABEL } from "../types";

const SENTIMENT_INTENT: Record<SentimentLevel, Intent> = {
  STRONG_SUPPORTER: Intent.SUCCESS,
  SUPPORTER: Intent.PRIMARY,
  UNDECIDED: Intent.NONE,
  OPPOSED: Intent.WARNING,
  STRONG_OPPONENT: Intent.DANGER,
};

interface Props {
  sentiment: SentimentLevel;
}

export default function SentimentBadge({ sentiment }: Props) {
  return (
    <Tag
      intent={SENTIMENT_INTENT[sentiment]}
      minimal
      style={{
        borderRadius: 24,
        padding: "2px 12px",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {SENTIMENT_LABEL[sentiment]}
    </Tag>
  );
}
