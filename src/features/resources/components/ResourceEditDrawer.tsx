import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Callout,
  Classes,
  Drawer,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Intent,
  Tag,
  TagInput,
  TextArea,
} from "@blueprintjs/core";
import { useResourceMutations } from "../hooks/useResourceMutations";
import { ResourceStatusTag } from "./ResourceStatusTag";
import { ResourceTypeBadge } from "./ResourceTypeBadge";
import { ResourceConditionTag } from "./ResourceConditionTag";
import { appToaster } from "../../../toaster";
import type { Resource, ResourceCondition } from "../types";

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
  resource: Resource;
  onClose: () => void;
  onSaved: () => void;
}

export function ResourceEditDrawer({ isOpen, resource, onClose, onSaved }: Props) {
  const { update, submitting, error, clearError } = useResourceMutations();

  const [resourceName, setResourceName] = useState(resource.resource_name);
  const [condition, setCondition] = useState<ResourceCondition>(resource.condition);
  const [description, setDescription] = useState(resource.description ?? "");
  const [brand, setBrand] = useState(resource.brand ?? "");
  const [model, setModel] = useState(resource.model ?? "");
  const [serialNumber, setSerialNumber] = useState(resource.serial_number ?? "");
  const [acquisitionDate, setAcquisitionDate] = useState(resource.acquisition_date ?? "");
  const [warrantyExpiry, setWarrantyExpiry] = useState(resource.warranty_expiry ?? "");
  const [acquisitionCost, setAcquisitionCost] = useState(
    resource.acquisition_cost != null ? String(resource.acquisition_cost) : ""
  );
  const [currentValue, setCurrentValue] = useState(
    resource.current_value != null ? String(resource.current_value) : ""
  );
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState(
    resource.last_maintenance_date ?? ""
  );
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState(
    resource.next_maintenance_date ?? ""
  );
  const [maintenanceNotes, setMaintenanceNotes] = useState(resource.maintenance_notes ?? "");
  const [tags, setTags] = useState<string[]>(resource.tags ?? []);
  const [notes, setNotes] = useState(resource.notes ?? "");

  useEffect(() => {
    if (isOpen) {
      setResourceName(resource.resource_name);
      setCondition(resource.condition);
      setDescription(resource.description ?? "");
      setBrand(resource.brand ?? "");
      setModel(resource.model ?? "");
      setSerialNumber(resource.serial_number ?? "");
      setAcquisitionDate(resource.acquisition_date ?? "");
      setWarrantyExpiry(resource.warranty_expiry ?? "");
      setAcquisitionCost(
        resource.acquisition_cost != null ? String(resource.acquisition_cost) : ""
      );
      setCurrentValue(
        resource.current_value != null ? String(resource.current_value) : ""
      );
      setLastMaintenanceDate(resource.last_maintenance_date ?? "");
      setNextMaintenanceDate(resource.next_maintenance_date ?? "");
      setMaintenanceNotes(resource.maintenance_notes ?? "");
      setTags(resource.tags ?? []);
      setNotes(resource.notes ?? "");
      clearError();
    }
  }, [isOpen, resource, clearError]);

  const handleSave = useCallback(async () => {
    const result = await update(resource.id, {
      resource_name: resourceName.trim() || undefined,
      condition,
      description: description.trim() || undefined,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      serial_number: serialNumber.trim() || undefined,
      acquisition_date: acquisitionDate || undefined,
      warranty_expiry: warrantyExpiry || undefined,
      acquisition_cost: acquisitionCost ? parseFloat(acquisitionCost) : undefined,
      current_value: currentValue ? parseFloat(currentValue) : undefined,
      last_maintenance_date: lastMaintenanceDate || undefined,
      next_maintenance_date: nextMaintenanceDate || undefined,
      maintenance_notes: maintenanceNotes.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      notes: notes.trim() || undefined,
    });
    if (result) {
      const toaster = await appToaster;
      toaster.show({
        message: "Resource updated.",
        intent: Intent.SUCCESS,
        icon: "tick",
      });
      onSaved();
      onClose();
    }
  }, [
    resource.id,
    update,
    resourceName,
    condition,
    description,
    brand,
    model,
    serialNumber,
    acquisitionDate,
    warrantyExpiry,
    acquisitionCost,
    currentValue,
    lastMaintenanceDate,
    nextMaintenanceDate,
    maintenanceNotes,
    tags,
    notes,
    onSaved,
    onClose,
  ]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Resource"
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
          <ResourceTypeBadge type={resource.resource_type} />
          <ResourceStatusTag status={resource.status} />
          <ResourceConditionTag condition={resource.condition} />
          {resource.resource_code && <Tag minimal>{resource.resource_code}</Tag>}
        </div>

        <FormGroup label="Resource Name" labelInfo="(required)">
          <InputGroup
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
          />
        </FormGroup>

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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fill
            rows={3}
          />
        </FormGroup>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Brand" style={{ flex: 1 }}>
            <InputGroup
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Model" style={{ flex: 1 }}>
            <InputGroup
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </FormGroup>
        </div>

        <FormGroup label="Serial Number">
          <InputGroup
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
              value={acquisitionCost}
              onChange={(e) => setAcquisitionCost(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Current Value (₱)" style={{ flex: 1 }}>
            <InputGroup
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          </FormGroup>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <FormGroup label="Last Maintenance" style={{ flex: 1 }}>
            <InputGroup
              type="date"
              value={lastMaintenanceDate}
              onChange={(e) => setLastMaintenanceDate(e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Next Maintenance" style={{ flex: 1 }}>
            <InputGroup
              type="date"
              value={nextMaintenanceDate}
              onChange={(e) => setNextMaintenanceDate(e.target.value)}
            />
          </FormGroup>
        </div>

        <FormGroup label="Maintenance Notes">
          <TextArea
            value={maintenanceNotes}
            onChange={(e) => setMaintenanceNotes(e.target.value)}
            fill
            rows={2}
          />
        </FormGroup>

        <FormGroup label="Tags">
          <TagInput
            values={tags}
            onChange={(newValues) => setTags(newValues as string[])}
            addOnBlur
            fill
          />
        </FormGroup>

        <FormGroup label="Notes">
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fill
            rows={2}
          />
        </FormGroup>
      </div>

      <div
        className={Classes.DRAWER_FOOTER}
        style={{ padding: "12px 20px", display: "flex", gap: 8, justifyContent: "flex-end" }}
      >
        <Button text="Cancel" onClick={onClose} />
        <Button
          intent={Intent.PRIMARY}
          text="Save Changes"
          onClick={handleSave}
          loading={submitting}
          disabled={!resourceName.trim() || submitting}
        />
      </div>
    </Drawer>
  );
}
