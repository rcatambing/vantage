import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import type { ReactNode } from "react";

interface AsyncBoundaryProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: ReactNode;
  /** Optional custom loading element. Defaults to centered Spinner. */
  loadingElement?: ReactNode;
  /** Optional custom error element. Defaults to NonIdealState. */
  errorElement?: ReactNode;
}

/**
 * Shared loading / error / data boundary.
 * Eliminates the repeated Spinner + NonIdealState markup across panels.
 *
 * @example
 * <AsyncBoundary loading={loading} error={error} onRetry={refetch}>
 *   <Chart data={data} />
 * </AsyncBoundary>
 */
export default function AsyncBoundary({
  loading,
  error,
  onRetry,
  children,
  loadingElement,
  errorElement,
}: AsyncBoundaryProps) {
  if (loading) {
    return (
      <>
        {loadingElement ?? (
          <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
            <Spinner size={24} />
          </div>
        )}
      </>
    );
  }

  if (error) {
    return (
      <>
        {errorElement ?? (
          <NonIdealState
            icon="error"
            title="Failed to load"
            description={error}
            action={
              onRetry ? (
                <Button icon="refresh" intent="primary" onClick={onRetry}>
                  Retry
                </Button>
              ) : undefined
            }
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}
