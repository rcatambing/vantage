import { useState, useCallback } from "react";
import {
  FormGroup,
  InputGroup,
  TextArea,
  Button,
  Intent,
  Callout,
} from "@blueprintjs/core";
import type { District, DistrictUpdatePayload } from "../types";

interface Props {
  district: District;
  onSave: (id: string, payload: DistrictUpdatePayload) => Promise<void>;
  saving?: boolean;
}

/**
 * Inline edit form for mutable district fields.
 * Immutable fields shown read-only with helper text.
 * PUT /api/districts/{id}
 */
export default function DistrictEditForm({ district, onSave, saving }: Props) {
  const [name, setName] = useState(district.name);
  const [region, setRegion] = useState(district.region);
  const [metadataJson, setMetadataJson] = useState(() =>
    JSON.stringify(district.metadata ?? {}, null, 2),
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      let metadata: Record<string, unknown> | undefined;
      try {
        metadata = JSON.parse(metadataJson);
      } catch {
        setError("Metadata must be valid JSON");
        return;
      }

      await onSave(district.id, {
        name: name.trim() || undefined,
        region: region.trim() || undefined,
        metadata,
      });
    },
    [district.id, name, region, metadataJson, onSave],
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <Callout intent={Intent.DANGER} title="Validation error">{error}</Callout>}

      <FormGroup label="District Code" helperText="This field cannot be changed">
        <InputGroup value={district.district_code} readOnly disabled />
      </FormGroup>

      <FormGroup label="District Type" helperText="This field cannot be changed">
        <InputGroup value={district.district_type} readOnly disabled />
      </FormGroup>

      <FormGroup label="Parent District" helperText="This field cannot be changed">
        <InputGroup value={district.parent_name ?? district.parent_district_id ?? "None"} readOnly disabled />
      </FormGroup>

      <FormGroup label="Name" labelInfo="(required)">
        <InputGroup
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-label="District name"
        />
      </FormGroup>

      <FormGroup label="Region">
        <InputGroup
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Region"
        />
      </FormGroup>

      <FormGroup label="Metadata (JSON)">
        <TextArea
          value={metadataJson}
          onChange={(e) => setMetadataJson(e.target.value)}
          fill
          rows={6}
          aria-label="Metadata JSON"
          style={{ fontFamily: "monospace", fontSize: 12 }}
        />
      </FormGroup>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button type="submit" intent="primary" icon="floppy-disk" loading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
