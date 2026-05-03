import { Button } from "@blueprintjs/core";
import type { ReactNode } from "react";
import Panel from "./Panel";
import AsyncBoundary from "./AsyncBoundary";
import type { PanelSize } from "../types";

interface AnalyticsPanelProps {
  id: string;
  name: string;
  size: PanelSize;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onRemove?: () => void;
  children: ReactNode;
}

/**
 * Wrapper around Panel + AsyncBoundary for analytics metric panels.
 * Eliminates the repeated loading/error/data markup across all metric modules.
 *
 * @example
 * <AnalyticsPanel
 *   id="m07-TEP"
 *   name="Voter Turnout Estimate"
 *   size="large"
 *   loading={loading}
 *   error={error}
 *   onRefresh={refetch}
 *   onRemove={onRemove}
 * >
 *   <Chart data={data} />
 * </AnalyticsPanel>
 */
export default function AnalyticsPanel({
  id,
  name,
  size,
  loading,
  error,
  onRefresh,
  onRemove,
  children,
}: AnalyticsPanelProps) {
  return (
    <Panel
      id={id}
      name={name}
      size={size}
      onRemove={onRemove}
      actions={
        <Button icon="refresh" minimal small onClick={onRefresh} title="Refresh" />
      }
    >
      <AsyncBoundary loading={loading} error={error} onRetry={onRefresh}>
        {children}
      </AsyncBoundary>
    </Panel>
  );
}
