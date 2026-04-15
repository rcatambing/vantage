import { useState, useCallback } from "react";
import {
  Button,
  Callout,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Intent,
  TextArea,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import { useOfficeMutations } from "../hooks/useOfficeMutations";
import { CapabilitiesTagInput } from "./CapabilitiesTagInput";
import { appToaster } from "../../../toaster";
import type { OfficeType } from "../types";

const OFFICE_TYPE_OPTIONS: { value: OfficeType; label: string }[] = [
  { value: "HQ", label: "Headquarters" },
  { value: "FIELD_OFFICE", label: "Field Office" },
  { value: "BRANCH", label: "Branch" },
  { value: "SATELLITE", label: "Satellite Site" },
  { value: "WAREHOUSE", label: "Warehouse" },
  { value: "CONTACT_POINT", label: "Contact Point" },
  { value: "OTHER", label: "Other" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function OfficeCreateDialog({ isOpen, onClose, onCreated }: Props) {
  const navigate = useNavigate();
  const { create, submitting, error, clearError } = useOfficeMutations();

  const [officeName, setOfficeName] = useState("");
  const [officeCode, setOfficeCode] = useState("");
  const [officeType, setOfficeType] = useState<OfficeType>("FIELD_OFFICE");
  const [description, setDescription] = useState("");
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [streetAddress, setStreetAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");
  const [openedDate, setOpenedDate] = useState("");

  const isValid = officeName.trim().length > 0;

  const handleClose = useCallback(() => {
    setOfficeName("");
    setOfficeCode("");
    setOfficeType("FIELD_OFFICE");
    setDescription("");
    setCapabilities([]);
    setStreetAddress("");
    setBarangay("");
    setCityMunicipality("");
    setProvince("");
    setZipCode("");
    setOperatingHours("");
    setCapacity("");
    setNotes("");
    setOpenedDate("");
    clearError();
    onClose();
  }, [onClose, clearError]);

  const handleSubmit = async () => {
    if (!isValid) return;
    const result = await create({
      office_name: officeName.trim(),
      office_type: officeType,
      office_code: officeCode.trim() || undefined,
      description: description.trim() || undefined,
      capabilities: capabilities.length > 0 ? capabilities : undefined,
      street_address: streetAddress.trim() || undefined,
      barangay: barangay.trim() || undefined,
      city_municipality: cityMunicipality.trim() || undefined,
      province: province.trim() || undefined,
      zip_code: zipCode.trim() || undefined,
      operating_hours: operatingHours.trim() || undefined,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      notes: notes.trim() || undefined,
      opened_date: openedDate || undefined,
    });
    if (result) {
      const toaster = await appToaster;
      toaster.show({
        message: `Office "${result.office_name}" created.`,
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      onCreated?.();
      handleClose();
      navigate(`/offices/${result.id}`);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="New Office"
      icon="office"
      style={{ width: 600 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Office Name" labelInfo="(required)">
          <InputGroup
            placeholder="e.g. North Luzon Field Office"
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
            autoFocus
          />
        </FormGroup>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Office Type" labelInfo="(required)" style={{ flex: 1 }}>
            <HTMLSelect
              value={officeType}
              onChange={(e) => setOfficeType(e.target.value as OfficeType)}
              options={OFFICE_TYPE_OPTIONS}
              fill
            />
          </FormGroup>
          <FormGroup label="Office Code" style={{ flex: 1 }}>
            <InputGroup
              placeholder="e.g. NL-FO-01"
              value={officeCode}
              onChange={(e) => setOfficeCode(e.target.value)}
            />
          </FormGroup>
        </div>

        <FormGroup label="Description">
          <TextArea
            placeholder="Brief description of this office's role…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fill
            rows={3}
          />
        </FormGroup>

        <FormGroup label="Capabilities">
          <CapabilitiesTagInput values={capabilities} onChange={setCapabilities} />
        </FormGroup>

        <FormGroup label="Street Address">
          <InputGroup
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Street address"
          />
        </FormGroup>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Barangay" style={{ flex: 1 }}>
            <InputGroup
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              placeholder="Barangay"
            />
          </FormGroup>
          <FormGroup label="City / Municipality" style={{ flex: 1 }}>
            <InputGroup
              value={cityMunicipality}
              onChange={(e) => setCityMunicipality(e.target.value)}
              placeholder="City or municipality"
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Province" style={{ flex: 1 }}>
            <InputGroup
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Province"
            />
          </FormGroup>
          <FormGroup label="ZIP Code" style={{ flex: 1 }}>
            <InputGroup
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="ZIP code"
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Operating Hours" style={{ flex: 1 }}>
            <InputGroup
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              placeholder="e.g. Mon–Fri 8am–5pm"
            />
          </FormGroup>
          <FormGroup label="Capacity" style={{ flex: 1 }}>
            <InputGroup
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Max staff capacity"
            />
          </FormGroup>
        </div>

        <FormGroup label="Date Opened">
          <InputGroup
            type="date"
            value={openedDate}
            onChange={(e) => setOpenedDate(e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Notes">
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fill
            rows={2}
            placeholder="Internal notes…"
          />
        </FormGroup>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} className={Classes.DIALOG_CLOSE_BUTTON} />
            <Button
              intent={Intent.PRIMARY}
              text="Create Office"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!isValid || submitting}
            />
          </>
        }
      />
    </Dialog>
  );
}
