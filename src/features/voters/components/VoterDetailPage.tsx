import { useState } from "react";
import {
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
  Button,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Classes,
  Card,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { useVoter, useVoterMutations } from "../hooks/useVoters";
import {
  VOTER_STATUS_INTENT,
  VOTER_STATUS_LABEL,
  STATUS_OPTIONS,
  GENDER_OPTIONS,
} from "../types";
import type { VoterStatus, Gender } from "../types";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function VoterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { voter, loading, error, refetch } = useVoter(id);
  const mutations = useVoterMutations({ onSuccess: refetch });

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState(">");
  const [editGender, setEditGender] = useState<Gender>("MALE");
  const [editStatus, setEditStatus] = useState<VoterStatus>("REGISTERED");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 80,
        }}
      >
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !voter) {
    return (
      <NonIdealState
        icon="error"
        title="Voter not found"
        description={error ?? "The requested voter could not be loaded."}
        action={<Button text="Back" onClick={() => navigate(-1)} />}
      />
    );
  }

  const startEditing = () => {
    setEditName(voter.full_name);
    setEditAge(String(voter.age));
    setEditGender(voter.gender);
    setEditStatus(voter.status);
    setEditPhone(voter.phone ?? "");
    setEditEmail(voter.email ?? "");
    setEditing(true);
    mutations.clearErrors();
  };

  const cancelEditing = () => {
    setEditing(false);
    mutations.clearErrors();
  };

  const handleSave = async () => {
    const ageNum = parseInt(editAge, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      return;
    }
    const success = await mutations.update(voter.id, {
      full_name: editName.trim() || undefined,
      age: ageNum,
      gender: editGender,
      status: editStatus,
      phone: editPhone.trim() || null,
      email: editEmail.trim() || null,
    });
    if (success) setEditing(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Button
          minimal
          icon="arrow-left"
          text="Voters"
          onClick={() => navigate(-1)}
        />
        <Tag intent={VOTER_STATUS_INTENT[voter.status]} minimal>
          {VOTER_STATUS_LABEL[voter.status]}
        </Tag>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {!editing && (
            <Button small icon="edit" text="Edit" onClick={startEditing} />
          )}
        </div>
      </div>

      {mutations.error && (
        <Callout
          intent={Intent.DANGER}
          icon="error"
          style={{ marginBottom: 16 }}
        >
          {mutations.error}
        </Callout>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        {/* Left panel */}
        <div>
          {editing ? (
            <>
              <FormGroup label="Full Name">
                <InputGroup
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </FormGroup>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                }}
              >
                <FormGroup label="Age">
                  <InputGroup
                    type="number"
                    min={18}
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Gender">
                  <HTMLSelect
                    fill
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as Gender)}
                    options={GENDER_OPTIONS}
                  />
                </FormGroup>
                <FormGroup label="Status">
                  <HTMLSelect
                    fill
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as VoterStatus)}
                    options={STATUS_OPTIONS}
                  />
                </FormGroup>
              </div>
              <FormGroup label="Phone">
                <InputGroup
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  leftIcon="phone"
                />
              </FormGroup>
              <FormGroup label="Email">
                <InputGroup
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  leftIcon="envelope"
                />
              </FormGroup>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <Button
                  intent={Intent.PRIMARY}
                  text="Save"
                  onClick={handleSave}
                  loading={mutations.submitting}
                />
                <Button text="Cancel" onClick={cancelEditing} />
              </div>
            </>
          ) : (
            <>
              <h2
                style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 600 }}
              >
                {voter.full_name}
              </h2>

              {/* Affiliations */}
              <section style={{ marginTop: 24 }}>
                <h4
                  className="bp5-heading"
                  style={{ fontSize: 14, marginBottom: 12 }}
                >
                  Affiliations
                </h4>
                {voter.affiliations.length === 0 ? (
                  <p
                    className={Classes.TEXT_MUTED}
                    style={{ fontSize: 13 }}
                  >
                    No affiliations recorded.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {voter.affiliations.map((aff, idx) => (
                      <Tag key={idx} minimal>
                        {aff.type}: {aff.value}
                      </Tag>
                    ))}
                  </div>
                )}
              </section>

              {/* Signals */}
              <section style={{ marginTop: 32 }}>
                <h4
                  className="bp5-heading"
                  style={{ fontSize: 14, marginBottom: 12 }}
                >
                  Signals
                </h4>
                {voter.signals.length === 0 ? (
                  <p
                    className={Classes.TEXT_MUTED}
                    style={{ fontSize: 13 }}
                  >
                    No signals recorded.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {voter.signals.map((sig, idx) => (
                      <Card
                        key={idx}
                        style={{
                          padding: 12,
                          background: "var(--cds-layer-01, #262626)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: 13 }}>{sig.type}</span>
                          <Tag
                            intent={
                              sig.strength >= 0.7
                                ? Intent.SUCCESS
                                : sig.strength >= 0.4
                                  ? Intent.WARNING
                                  : Intent.NONE
                            }
                            minimal
                          >
                            {Math.round(sig.strength * 100)}%
                          </Tag>
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            height: 4,
                            background: "var(--cds-border-subtle, #393939)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${sig.strength * 100}%`,
                              height: "100%",
                              background:
                                sig.strength >= 0.7
                                  ? "#24a148"
                                  : sig.strength >= 0.4
                                    ? "#f1c21b"
                                    : "#525252",
                              transition: "width 200ms ease",
                            }}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Right rail */}
        <div>
          <div
            style={{
              padding: 16,
              background: "var(--cds-layer-01, #262626)",
            }}
          >
            <h4
              className="bp5-heading"
              style={{ fontSize: 12, marginBottom: 12 }}
            >
              Details
            </h4>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                AGE
              </div>
              <div style={{ fontSize: 13 }}>
                {voter.age} ({voter.age_group})
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                GENDER
              </div>
              <div style={{ fontSize: 13 }}>{voter.gender}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                DISTRICT
              </div>
              <div style={{ fontSize: 13 }}>{voter.district_name}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                PHONE
              </div>
              <div style={{ fontSize: 13 }}>
                {voter.phone ?? (
                  <span className={Classes.TEXT_MUTED}>None</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                EMAIL
              </div>
              <div style={{ fontSize: 13 }}>
                {voter.email ?? (
                  <span className={Classes.TEXT_MUTED}>None</span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 11, marginBottom: 4 }}
              >
                LAST CONTACT
              </div>
              <div style={{ fontSize: 13 }}>
                {formatDate(voter.last_contact)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
