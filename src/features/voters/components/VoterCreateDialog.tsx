import { useState, useCallback } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Callout,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import { useVoterMutations } from "../hooks/useVoters";
import type { Gender, VoterStatus } from "../types";
import { GENDER_OPTIONS, STATUS_OPTIONS } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export default function VoterCreateDialog({ isOpen, onClose, campaignId }: Props) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");
  const [districtId, setDistrictId] = useState("");
  const [status, setStatus] = useState<VoterStatus>("REGISTERED");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const { create, submitting, error, clearErrors } = useVoterMutations({
    onSuccess: () => {
      handleClose();
    },
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

  const handleClose = useCallback(() => {
    setFullName("");
    setAge("");
    setGender("MALE");
    setDistrictId("");
    setStatus("REGISTERED");
    setPhone("");
    setEmail("");
    clearErrors();
    onClose();
  }, [onClose, clearErrors]);

  const handleSubmit = async () => {
    if (!isValid) return;
    const success = await create({
      full_name: fullName.trim(),
      age: ageNum,
      gender,
      district_id: districtId.trim(),
      status,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
    });
    if (success) {
      navigate(`/campaigns/${campaignId}/voters`);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="New Voter"
      icon="new-person"
      style={{ width: 520 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Full Name" helperText="Required">
          <InputGroup
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Juan dela Cruz"
          />
        </FormGroup>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <FormGroup label="Age" helperText={ageError ?? "Must be ≥ 18"} intent={ageError ? Intent.DANGER : Intent.NONE}>
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

        <FormGroup label="District ID" helperText="Required">
          <InputGroup
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            placeholder="e.g. D-001"
          />
        </FormGroup>

        <FormGroup label="Phone">
          <InputGroup
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon="phone"
            placeholder="+63 912 345 6789"
          />
        </FormGroup>

        <FormGroup label="Email">
          <InputGroup
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon="envelope"
            placeholder="juan@example.com"
          />
        </FormGroup>
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} />
            <Button
              intent={Intent.PRIMARY}
              text="Create Voter"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!isValid}
            />
          </>
        }
      />
    </Dialog>
  );
}
