import { NonIdealState, Button } from "@blueprintjs/core";

interface Props {
  metricName: string;
  onRetry: () => void;
}

/**
 * Error state for failed metric loads.
 * Displays a NonIdealState with error icon, descriptive title,
 * and a retry action button. Uses aria-live="assertive" for
 * screen-reader announcement of errors.
 */
export default function MetricErrorState({ metricName, onRetry }: Props) {
  return (
    <div aria-live="assertive" role="alert" style={{ padding: 24 }}>
      <NonIdealState
        icon="error"
        title={`Unable to load ${metricName}`}
        description="The data could not be fetched. This may be due to a network issue or server error."
        action={
          <Button intent="primary" icon="refresh" onClick={onRetry}>
            Retry
          </Button>
        }
      />
    </div>
  );
}
