import { useState } from "react";
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Callout,
} from "@blueprintjs/core";
import { useVoterMutations } from "../hooks/useVoters";
import type { Voter, Gender, VoterStatus } from "../types";
import { GENDER_OPTIONS, STATUS_OPTIONS } from "../types";

interface Props {
  voter: Voter;
  onSaved: () => void;
  onCancel: () => void;
}

export default function VoterEditForm({ voter, onSaved, onCancel }: Props) {
  const [fullName, setFullName] = useState(voter.full_name);
  const [age, setAge] = useState(String(voter.age));
  const [gender, setGender] = useState<Gender>(voter.gender);
  const [districtId, setDistrictId] = useState(voter.district_id);
  const [status, setStatus] = useState<VoterStatus>(voter.status);
  const [phone, setPhone] = useState(voter.phone ?? "");
  const [email, setEmail] = useState(voter.email ?? "");

  const { update, submitting, error, clearErrors } = useVoterMutations({
    onSuccess: onSaved,
  });

  const ageNum = parseInt(age, 10);
  const ageError = age && (isNaN(ageNum) || ageNum < 18)
    ? "Age must be 18 or older."
    : null;

  const isValid =
    fullName.trim().length > 0 &&
    districtId.trim().length > 0 &&
    !isNaN(ageNum) &&
    ageNum >= 18;

  const handleSubmit = async () => {
    if (!isValid) return;
    clearErrors();
    const success = await update(voter.id, {
      full_name: fullName.trim(),
      age: ageNum,
      gender,
      district_id: districtId.trim(),
      status,
      phone: phone.trim() || null,
      email: email.trim() || null,
    });
    if (success) onSaved();
  };

  return (
    <div>
      {error && (
        <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
          {error}
        </Callout>
      )}

      <FormGroup label="Full Name">
        <InputGroup
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </FormGroup>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
        }}
      >
        <FormGroup label="Age" helperText={ageError ?? undefined} intent={ageError ? Intent.DANGER : Intent.NONE}>
          <InputGroup
            type="number"
            min={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Gender">
          <HTMLSelect
            fill
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            options={GENDER_OPTIONS}
          />
        </FormGroup>
        <FormGroup label="Status">
          <HTMLSelect
            fill
            value={status}
            onChange={(e) => setStatus(e.target.value as VoterStatus)}
            options={STATUS_OPTIONS}
          />
        </FormGroup>
      </div>

      <FormGroup label="District ID">
        <InputGroup
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Phone">
        <InputGroup
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          leftIcon="phone"
        />
      </FormGroup>

      <FormGroup label="Email">
        <InputGroup
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon="envelope"
        />
      </FormGroup>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Button
          intent={Intent.PRIMARY}
          text="Save"
          onClick={handleSubmit}
          loading={submitting}
          disabled={!isValid}
        />
        <Button text="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
}
