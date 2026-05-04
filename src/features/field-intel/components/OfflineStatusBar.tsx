import { useState, useEffect } from "react";
import {
  Button,
  Spinner,
  Tag,
  Intent,
  Icon,
} from "@blueprintjs/core";
import { useOfflineQueue } from "../hooks/useIntel";

export default function OfflineStatusBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { queue, sync, syncing, syncError } = useOfflineQueue();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const queueCount = queue.length;
  const showBar = !isOnline || queueCount > 0 || syncing || syncError;

  if (!showBar) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 16px",
        background: isOnline ? "var(--cds-layer-02)" : "var(--cds-support-error)",
        borderBottom: "1px solid var(--cds-border-subtle)",
        fontSize: 13,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon
          icon={isOnline ? "globe" : "offline"}
          size={14}
          color={isOnline ? "var(--cds-support-success)" : "#fff"}
        />
        <span style={{ fontWeight: 500, color: isOnline ? undefined : "#fff" }}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {queueCount > 0 && (
        <Tag minimal intent={Intent.WARNING} style={{ fontSize: 12 }}>
          {queueCount} {queueCount === 1 ? "item" : "items"} queued
        </Tag>
      )}

      {syncError && (
        <Tag minimal intent={Intent.DANGER} style={{ fontSize: 12 }}>
          Sync failed
        </Tag>
      )}

      {isOnline && queueCount > 0 && (
        <Button
          small
          intent={Intent.PRIMARY}
          onClick={sync}
          disabled={syncing}
          style={{ minHeight: 32, borderRadius: 0 }}
        >
          {syncing ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Spinner size={12} />
              Syncing…
            </span>
          ) : (
            "Sync now"
          )}
        </Button>
      )}
    </div>
  );
}
