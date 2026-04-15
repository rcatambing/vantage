import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Callout,
  Classes,
  Drawer,
  FormGroup,
  InputGroup,
  Intent,
  Tag,
  TextArea,
} from "@blueprintjs/core";
import { useOfficeMutations } from "../hooks/useOfficeMutations";
import { CapabilitiesTagInput } from "./CapabilitiesTagInput";
import { OfficeStatusTag } from "./OfficeStatusTag";
import { OfficeTypeBadge } from "./OfficeTypeBadge";
import { appToaster } from "../../../toaster";
import type { Office } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  office: Office;
}

export function OfficeEditDrawer({ isOpen, onClose, onSaved, office }: Props) {
  const { update, submitting, error, clearError } = useOfficeMutations();

  const [officeName, setOfficeName] = useState(office.office_name);
  const [description, setDescription] = useState(office.description ?? "");
  const [capabilities, setCapabilities] = useState<string[]>(office.capabilities ?? []);
  const [streetAddress, setStreetAddress] = useState(office.street_address ?? "");
  const [barangay, setBarangay] = useState(office.barangay ?? "");
  const [cityMunicipality, setCityMunicipality] = useState(office.city_municipality ?? "");
  const [province, setProvince] = useState(office.province ?? "");
  const [zipCode, setZipCode] = useState(office.zip_code ?? "");
  const [operatingHours, setOperatingHours] = useState(office.operating_hours ?? "");
  const [capacity, setCapacity] = useState(
    office.capacity != null ? String(office.capacity) : ""
  );
  const [notes, setNotes] = useState(office.notes ?? "");
  const [openedDate, setOpenedDate] = useState(office.opened_date ?? "");
  const [closedDate, setClosedDate] = useState(office.closed_date ?? "");

  useEffect(() => {
    if (isOpen) {
      setOfficeName(office.office_name);
      setDescription(office.description ?? "");
      setCapabilities(office.capabilities ?? []);
      setStreetAddress(office.street_address ?? "");
      setBarangay(office.barangay ?? "");
      setCityMunicipality(office.city_municipality ?? "");
      setProvince(office.province ?? "");
      setZipCode(office.zip_code ?? "");
      setOperatingHours(office.operating_hours ?? "");
      setCapacity(office.capacity != null ? String(office.capacity) : "");
      setNotes(office.notes ?? "");
      setOpenedDate(office.opened_date ?? "");
      setClosedDate(office.closed_date ?? "");
      clearError();
    }
  }, [isOpen, office, clearError]);

  const handleSave = useCallback(async () => {
    const result = await update(office.id, {
      office_name: officeName.trim() || undefined,
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
      closed_date: closedDate || undefined,
    });
    if (result) {
      const toaster = await appToaster;
      toaster.show({
        message: "Office updated.",
        intent: Intent.SUCCESS,
        icon: "tick",
      });
      onSaved();
      onClose();
    }
  }, [
    office.id,
    update,
    officeName,
    description,
    capabilities,
    streetAddress,
    barangay,
    cityMunicipality,
    province,
    zipCode,
    operatingHours,
    capacity,
    notes,
    openedDate,
    closedDate,
    onSaved,
    onClose,
  ]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Office"
      icon="edit"
      size="480px"
      position="right"
    >
      <div className={Classes.DRAWER_BODY} style={{ padding: 20, overflowY: "auto" }}>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        {/* Read-only fields */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <OfficeTypeBadge type={office.office_type} />
          <OfficeStatusTag status={office.status} />
          {office.office_code && <Tag minimal>{office.office_code}</Tag>}
        </div>

        <FormGroup label="Office Name" labelInfo="(required)">
          <InputGroup
            value={officeName}
            onChange={(e) => setOfficeName(e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Description">
          <TextArea
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
          />
        </FormGroup>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Barangay" style={{ flex: 1 }}>
            <InputGroup
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="City / Municipality" style={{ flex: 1 }}>
            <InputGroup
              value={cityMunicipality}
              onChange={(e) => setCityMunicipality(e.target.value)}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Province" style={{ flex: 1 }}>
            <InputGroup
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="ZIP Code" style={{ flex: 1 }}>
            <InputGroup
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Operating Hours" style={{ flex: 1 }}>
            <InputGroup
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Capacity" style={{ flex: 1 }}>
            <InputGroup
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Date Opened" style={{ flex: 1 }}>
            <InputGroup
              type="date"
              value={openedDate}
              onChange={(e) => setOpenedDate(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Date Closed" style={{ flex: 1 }}>
            <InputGroup
              type="date"
              value={closedDate}
              onChange={(e) => setClosedDate(e.target.value)}
            />
          </FormGroup>
        </div>

        <FormGroup label="Notes">
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fill
            rows={2}
          />
        </FormGroup>
      </div>

      <div className={Classes.DRAWER_FOOTER} style={{ padding: "12px 20px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button text="Cancel" onClick={onClose} />
        <Button
          intent={Intent.PRIMARY}
          text="Save Changes"
          onClick={handleSave}
          loading={submitting}
          disabled={!officeName.trim() || submitting}
        />
      </div>
    </Drawer>
  );
}
