import { useState } from "react";
import { Button } from "@blueprintjs/core";
import TeamListTable from "./TeamListTable";
import TeamCreateDialog from "./TeamCreateDialog";

export default function TeamsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: 10,
          borderBottom: "1px solid var(--cds-border-subtle)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Teams Directory
        </h2>
        <Button
          icon="add"
          intent="primary"
          onClick={() => setIsDialogOpen(true)}
          small
        >
          New Team
        </Button>
      </div>
      <TeamListTable refetchKey={refetchKey} />
      <TeamCreateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={() => setRefetchKey((k) => k + 1)}
      />
    </div>
  );
}
