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
  TagInput,
  TextArea,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import { useResourceMutations } from "../hooks/useResourceMutations";
import { appToaster } from "../../../toaster";
import type { ResourceType, ResourceCondition } from "../types";

const RESOURCE_TYPE_OPTIONS: { value: ResourceType; label: string }[] = [
  { value: "VEHICLE", label: "Vehicle" },
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "IT_ASSET", label: "IT Asset" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "SUPPLIES", label: "Supplies" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "OTHER", label: "Other" },
];

const RESOURCE_CONDITION_OPTIONS: { value: ResourceCondition; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
  { value: "NON_FUNCTIONAL", label: "Non-Functional" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function ResourceCreateDialog({ isOpen, onClose, onCreated }: Props) {
  const navigate = useNavigate();
  const { create, submitting, error, clearError } = useResourceMutations();

  const [resourceName, setResourceName] = useState("");
  const [resourceType, setResourceType] = useState<ResourceType>("EQUIPMENT");
  const [resourceCode, setResourceCode] = useState("");
  const [condition, setCondition] = useState<ResourceCondition>("NEW");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const isValid = resourceName.trim().length > 0;

  const handleClose = useCallback(() => {
    setResourceName("");
    setResourceType("EQUIPMENT");
    setResourceCode("");
    setCondition("NEW");
    setDescription("");
    setBrand("");
    setModel("");
    setSerialNumber("");
    setAcquisitionDate("");
    setWarrantyExpiry("");
    setAcquisitionCost("");
    setCurrentValue("");
    setTags([]);
    setNotes("");
    clearError();
    onClose();
  }, [onClose, clearError]);

  const handleSubmit = async () => {
    if (!isValid) return;
    const result = await create({
      resource_name: resourceName.trim(),
      resource_type: resourceType,
      resource_code: resourceCode.trim() || undefined,
      condition,
      description: description.trim() || undefined,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      serial_number: serialNumber.trim() || undefined,
      acquisition_date: acquisitionDate || undefined,
      warranty_expiry: warrantyExpiry || undefined,
      acquisition_cost: acquisitionCost ? parseFloat(acquisitionCost) : undefined,
      current_value: currentValue ? parseFloat(currentValue) : undefined,
      tags: tags.length > 0 ? tags : undefined,
      notes: notes.trim() || undefined,
    });
    if (result) {
      const toaster = await appToaster;
      toaster.show({
        message: `Resource "${result.resource_name}" created.`,
        intent: Intent.SUCCESS,
        icon: "tick",
        timeout: 4000,
      });
      onCreated?.();
      handleClose();
      navigate(`/resources/${result.id}`);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="New Resource"
      icon="box"
      style={{ width: 600 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Resource Name" labelInfo="(required)">
          <InputGroup
            placeholder="e.g. Campaign Van Unit 1"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            autoFocus
          />
        </FormGroup>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Resource Type" labelInfo="(required)" style={{ flex: 1 }}>
            <HTMLSelect
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as ResourceType)}
              options={RESOURCE_TYPE_OPTIONS}
              fill
            />
          </FormGroup>
          <FormGroup label="Resource Code" style={{ flex: 1 }}>
            <InputGroup
              placeholder="e.g. VH-001"
              value={resourceCode}
              onChange={(e) => setResourceCode(e.target.value)}
            />
          </FormGroup>
        </div>

        <FormGroup label="Condition">
          <HTMLSelect
            value={condition}
            onChange={(e) => setCondition(e.target.value as ResourceCondition)}
            options={RESOURCE_CONDITION_OPTIONS}
            fill
          />
        </FormGroup>

        <FormGroup label="Description">
          <TextArea
            placeholder="Brief description of this resource…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fill
            rows={3}
          />
        </FormGroup>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Brand" style={{ flex: 1 }}>
            <InputGroup
              placeholder="e.g. Toyota"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Model" style={{ flex: 1 }}>
            <InputGroup
              placeholder="e.g. Hilux"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </FormGroup>
        </div>

        <FormGroup label="Serial Number">
          <InputGroup
            placeholder="Serial or asset number"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </FormGroup>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Acquisition Date" style={{ flex: 1 }}>
            <InputGroup
              type="date"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Warranty Expiry" style={{ flex: 1 }}>
            <InputGroup
              type="date"
              value={warrantyExpiry}
              onChange={(e) => setWarrantyExpiry(e.target.value)}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Acquisition Cost (₱)" style={{ flex: 1 }}>
            <InputGroup
              type="number"
              placeholder="0.00"
              value={acquisitionCost}
              onChange={(e) => setAcquisitionCost(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Current Value (₱)" style={{ flex: 1 }}>
            <InputGroup
              type="number"
              placeholder="0.00"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          </FormGroup>
        </div>

        <FormGroup label="Tags">
          <TagInput
            values={tags}
            onChange={(newValues) => setTags(newValues as string[])}
            addOnBlur
            placeholder="Add tag…"
            fill
          />
        </FormGroup>

        <FormGroup label="Notes">
          <TextArea
            placeholder="Additional notes…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fill
            rows={2}
          />
        </FormGroup>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} className={Classes.DIALOG_CLOSE_BUTTON} />
            <Button
              intent={Intent.PRIMARY}
              text="Create Resource"
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
