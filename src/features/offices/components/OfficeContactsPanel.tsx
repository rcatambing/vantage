import { useState } from "react";
import {
  Button,
  Callout,
  Icon,
  Intent,
  NonIdealState,
  Spinner,
  Tag,
} from "@blueprintjs/core";
import { useOfficeContacts } from "../hooks/useOfficeContacts";
import { useOfficeContactMutations } from "../hooks/useOfficeContactMutations";
import { ContactCreateDialog } from "./ContactCreateDialog";
import type { OfficeContact } from "../types";
import { CONTACT_CHANNEL_ICON, CONTACT_CHANNEL_LABEL } from "../types";
import { appToaster } from "../../../toaster";

interface Props {
  officeId: string;
}

export function OfficeContactsPanel({ officeId }: Props) {
  const { contacts, loading, error, refetch } = useOfficeContacts(officeId);
  const mutations = useOfficeContactMutations(refetch);

  const [addOpen, setAddOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error" title="Failed to load contacts">
        {error}
      </Callout>
    );
  }

  async function handleRemove(contact: OfficeContact) {
    setRemovingId(contact.id);
    const ok = await mutations.remove(officeId, contact.id);
    setRemovingId(null);
    if (ok) {
      const toaster = await appToaster;
      toaster.show({ message: "Contact removed.", intent: Intent.NONE, icon: "trash" });
    }
  }

  async function handleSetPrimary(contact: OfficeContact) {
    const result = await mutations.setPrimary(officeId, contact.id);
    if (result) {
      const toaster = await appToaster;
      toaster.show({ message: "Primary contact updated.", intent: Intent.SUCCESS, icon: "tick" });
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 13 }}>Contact Channels</span>
        <Button
          small
          icon="plus"
          text="Add Contact"
          onClick={() => setAddOpen(true)}
        />
      </div>

      {contacts.length === 0 ? (
        <NonIdealState
          icon="phone"
          title="No contacts"
          description="Add a phone, email, or social media contact."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {contacts.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                border: "1px solid var(--cds-border-subtle, #e0e0e0)",
                background: c.is_primary
                  ? "var(--cds-layer-01, #f4f4f4)"
                  : undefined,
              }}
            >
              <Icon icon={CONTACT_CHANNEL_ICON[c.contact_type] as never} size={14} />
              <span style={{ fontSize: 12, color: "var(--cds-text-secondary, #525252)", minWidth: 56 }}>
                {CONTACT_CHANNEL_LABEL[c.contact_type]}
              </span>
              <span style={{ fontSize: 13, flex: 1, fontWeight: 500 }}>{c.value}</span>
              {c.label && (
                <span style={{ fontSize: 11, color: "var(--cds-text-secondary, #525252)" }}>
                  {c.label}
                </span>
              )}
              {c.is_primary && (
                <Tag minimal intent={Intent.SUCCESS} style={{ fontSize: 10 }}>
                  Primary
                </Tag>
              )}
              <div style={{ display: "flex", gap: 4 }}>
                {!c.is_primary && (
                  <Button
                    small
                    minimal
                    text="Set Primary"
                    onClick={() => handleSetPrimary(c)}
                    loading={mutations.submitting}
                  />
                )}
                <Button
                  small
                  minimal
                  icon="trash"
                  intent={Intent.DANGER}
                  onClick={() => handleRemove(c)}
                  loading={removingId === c.id}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactCreateDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        officeId={officeId}
        onCreated={() => {
          setAddOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
