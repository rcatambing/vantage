import { useState, useCallback } from "react";
import {
  Dialog,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Button,
  Intent,
  Callout,
  Classes,
} from "@blueprintjs/core";
import type { DistrictType, DistrictCreatePayload } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: DistrictCreatePayload) => Promise<void>;
  provinces: { id: string; name: string }[];
  cities: { id: string; name: string }[];
  loading?: boolean;
}

/**
 * Dialog for creating a new district.
 * Fields: name (required), district_type (HTMLSelect), region, parent_district_id (cascading Select).
 * Validation: PROVINCE has no parent; CITY/BARANGAY require parent.
 * Hierarchy validation (BR-045).
 * POST /api/districts
 */
export default function DistrictCreateDialog({
  isOpen,
  onClose,
  onCreate,
  provinces,
  cities,
  loading,
}: Props) {
  const [name, setName] = useState("");
  const [districtType, setDistrictType] = useState<DistrictType>("PROVINCE");
  const [region, setRegion] = useState("");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setName("");
    setDistrictType("PROVINCE");
    setRegion("");
    setParentId("");
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!name.trim()) {
        setError("Name is required");
        return;
      }

      if (districtType !== "PROVINCE" && !parentId) {
        setError(`${districtType} districts require a parent district`);
        return;
      }

      if (districtType === "PROVINCE" && parentId) {
        setError("Province districts cannot have a parent");
        return;
      }

      const payload: DistrictCreatePayload = {
        name: name.trim(),
        district_type: districtType,
        region: region.trim(),
        parent_district_id: parentId || null,
      };

      try {
        await onCreate(payload);
        handleClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create district");
      }
    },
    [name, districtType, region, parentId, onCreate, handleClose],
  );

  const parentOptions = districtType === "CITY" ? provinces : districtType === "BARANGAY" ? cities : [];

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Create District" style={{ width: 480 }}>
      <form onSubmit={handleSubmit}>
        <div className={Classes.DIALOG_BODY} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && <Callout intent={Intent.DANGER} title="Error">{error}</Callout>}

          <FormGroup label="Name" labelInfo="(required)">
            <InputGroup
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cebu City"
              required
              aria-label="District name"
            />
          </FormGroup>

          <FormGroup label="Type" labelInfo="(required)">
            <HTMLSelect
              value={districtType}
              onChange={(e) => {
                setDistrictType(e.target.value as DistrictType);
                setParentId("");
              }}
              fill
              aria-label="District type"
            >
              <option value="PROVINCE">Province</option>
              <option value="CITY">City</option>
              <option value="BARANGAY">Barangay</option>
            </HTMLSelect>
          </FormGroup>

          <FormGroup label="Region">
            <InputGroup
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Region VII"
              aria-label="Region"
            />
          </FormGroup>

          {districtType !== "PROVINCE" && (
            <FormGroup
              label="Parent District"
              labelInfo="(required)"
              helperText={
                districtType === "CITY"
                  ? "Select a province"
                  : "Select a city"
              }
            >
              <HTMLSelect
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                fill
                aria-label="Parent district"
              >
                <option value="">Select parent…</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </HTMLSelect>
            </FormGroup>
          )}
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose} minimal>
              Cancel
            </Button>
            <Button type="submit" intent="primary" icon="add" loading={loading}>
              Create District
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
