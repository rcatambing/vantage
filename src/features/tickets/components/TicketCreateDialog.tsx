import { useState, useCallback } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  InputGroup,
  TextArea,
  HTMLSelect,
  Callout,
  Classes,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import type { TicketType, TicketSeverity } from "../types";
import { useTicketMutations } from "../hooks/useTicketMutations";
import {
  validateServiceLocation,
  hasAnyLocationField,
} from "../lib/locationValidation";
import type { FieldErrors } from "../lib/locationValidation";
import CampaignSuggest from "../../../components/suggest/CampaignSuggest";
import UserSuggest from "../../../components/suggest/UserSuggest";
import RegionSuggest from "../../../components/suggest/RegionSuggest";
import CitySuggest from "../../../components/suggest/CitySuggest";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultCampaignId?: string;
}

const TYPE_OPTIONS = [
  { value: "TASK", label: "Task" },
  { value: "INCIDENT", label: "Incident" },
  { value: "REQUEST", label: "Request" },
];

const SEVERITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MODERATE", label: "Moderate" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const GEO_PRECISION_OPTIONS = [
  { value: "", label: "Select precision…" },
  { value: "EXACT", label: "Exact" },
  { value: "BLOCK_LEVEL", label: "Block Level" },
  { value: "DISTRICT_LEVEL", label: "District Level" },
];

export default function TicketCreateDialog({
  isOpen,
  onClose,
  defaultCampaignId,
}: Props) {
  const navigate = useNavigate();

  // Core fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticketType, setTicketType] = useState<TicketType>("TASK");
  const [severity, setSeverity] = useState<TicketSeverity>("MODERATE");
  const [campaignId, setCampaignId] = useState(defaultCampaignId ?? "");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Location fields
  const [countryCode, setCountryCode] = useState("");
  const [regionId, setRegionId] = useState("");
  const [region, setRegion] = useState("");
  const [cityId, setCityId] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [geoPrecision, setGeoPrecision] = useState("");

  const [locationErrors, setLocationErrors] = useState<FieldErrors>({});

  const { create, submitting, error, clearErrors } = useTicketMutations({
    onSuccess: () => {
      handleClose();
    },
  });

  const isTaskOrIncident = ticketType === "TASK" || ticketType === "INCIDENT";

  const isValid =
    title.trim().length > 0 && campaignId.trim().length > 0;

  const handleClose = useCallback(() => {
    setTitle("");
    setDescription("");
    setTicketType("TASK");
    setSeverity("MODERATE");
    setCampaignId(defaultCampaignId ?? "");
    setAssigneeId("");
    setDueDate("");
    setCountryCode("");
    setRegionId("");
    setRegion("");
    setCityId("");
    setCityMunicipality("");
    setFullAddress("");
    setLatitude("");
    setLongitude("");
    setGeoPrecision("");
    setLocationErrors({});
    clearErrors();
    onClose();
  }, [onClose, clearErrors, defaultCampaignId]);

  const handleSubmit = async () => {
    if (!isValid) return;

    // Build service_location from form state
    const hasLocationFields =
      countryCode || region || cityMunicipality || fullAddress || latitude || longitude;
    const serviceLocation = hasLocationFields
      ? {
          country_code: countryCode || null,
          region: region || null,
          city_municipality: cityMunicipality || null,
          full_address: fullAddress || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          geo_precision: (geoPrecision || null) as import("../types").GeoPrecision | null,
        }
      : undefined;

    // Client-side location validation (BR-210 / BR-211)
    const locErrors = validateServiceLocation(
      serviceLocation ?? null,
      ticketType,
    );
    if (Object.keys(locErrors).length > 0) {
      setLocationErrors(locErrors);
      return;
    }
    setLocationErrors({});

    const success = await create({
      title: title.trim(),
      description: description.trim() || undefined,
      ticket_type: ticketType,
      severity,
      campaign_id: campaignId.trim(),
      assignee_id: assigneeId.trim() || undefined,
      due_date: dueDate || undefined,
      service_location: serviceLocation,
    });

    if (success) {
      navigate("/tickets");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="New Ticket"
      icon="clipboard"
      style={{ width: 600 }}
    >
      <DialogBody>
        {error && (
          <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
            {error}
          </Callout>
        )}

        <FormGroup label="Title" labelInfo="(required)">
          <InputGroup
            placeholder="Brief summary of the ticket"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </FormGroup>

        <FormGroup label="Description">
          <TextArea
            fill
            rows={3}
            placeholder="Detailed description…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormGroup label="Ticket Type" labelInfo="(required)">
            <HTMLSelect
              fill
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value as TicketType)}
              options={TYPE_OPTIONS}
            />
          </FormGroup>

          <FormGroup label="Severity" labelInfo="(required)">
            <HTMLSelect
              fill
              value={severity}
              onChange={(e) => setSeverity(e.target.value as TicketSeverity)}
              options={SEVERITY_OPTIONS}
            />
          </FormGroup>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormGroup label="Campaign" labelInfo="(required)">
            <CampaignSuggest
              selectedId={campaignId}
              onSelect={setCampaignId}
              disabled={Boolean(defaultCampaignId)}
            />
          </FormGroup>

          <FormGroup label="Assignee">
            <UserSuggest
              selectedId={assigneeId}
              onSelect={setAssigneeId}
            />
          </FormGroup>
        </div>

        <FormGroup label="Due Date">
          <InputGroup
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            leftIcon="calendar"
          />
        </FormGroup>

        {/* Service Location Section */}
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: "var(--cds-layer-01, #262626)",
            borderRadius: 0,
          }}
        >
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Service Location{" "}
            <span className={Classes.TEXT_MUTED}>(optional)</span>
          </h4>

          {isTaskOrIncident && !hasAnyLocationField({
            country_code: countryCode || null,
            region: region || null,
            city_municipality: cityMunicipality || null,
            full_address: fullAddress || null,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
          }) && (
            <Callout
              intent={Intent.WARNING}
              icon="info-sign"
              style={{ marginBottom: 12 }}
            >
              Location is recommended for {ticketType} tickets but not required.
            </Callout>
          )}

          {locationErrors["service_location"] && (
            <Callout
              intent={Intent.DANGER}
              icon="error"
              style={{ marginBottom: 12 }}
            >
              {locationErrors["service_location"]}
            </Callout>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <FormGroup
              label="Country Code"
              helperText={locationErrors["country_code"]}
              intent={locationErrors["country_code"] ? Intent.DANGER : Intent.NONE}
            >
              <InputGroup
                placeholder="PH"
                maxLength={2}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                intent={locationErrors["country_code"] ? Intent.DANGER : Intent.NONE}
              />
            </FormGroup>

            <FormGroup
              label="Region"
              helperText={locationErrors["region"]}
              intent={locationErrors["region"] ? Intent.DANGER : Intent.NONE}
            >
              <RegionSuggest
                selectedId={regionId}
                onSelect={(id, name) => {
                  setRegionId(id);
                  setRegion(name);
                  // Cascade: clear city when region changes
                  setCityId("");
                  setCityMunicipality("");
                }}
                intent={locationErrors["region"] ? Intent.DANGER : Intent.NONE}
              />
            </FormGroup>

            <FormGroup
              label="City / Municipality"
              helperText={locationErrors["city_municipality"]}
              intent={
                locationErrors["city_municipality"] ? Intent.DANGER : Intent.NONE
              }
            >
              <CitySuggest
                regionId={regionId || null}
                selectedId={cityId}
                onSelect={(id, name) => {
                  setCityId(id);
                  setCityMunicipality(name);
                }}
                intent={
                  locationErrors["city_municipality"] ? Intent.DANGER : Intent.NONE
                }
              />
            </FormGroup>
          </div>

          <FormGroup
            label="Full Address"
            helperText={locationErrors["full_address"]}
            intent={locationErrors["full_address"] ? Intent.DANGER : Intent.NONE}
          >
            <InputGroup
              placeholder="Street address or landmark"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              intent={locationErrors["full_address"] ? Intent.DANGER : Intent.NONE}
            />
          </FormGroup>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <FormGroup
              label="Latitude"
              helperText={locationErrors["latitude"]}
              intent={locationErrors["latitude"] ? Intent.DANGER : Intent.NONE}
            >
              <InputGroup
                placeholder="14.599512"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                intent={locationErrors["latitude"] ? Intent.DANGER : Intent.NONE}
              />
            </FormGroup>

            <FormGroup
              label="Longitude"
              helperText={locationErrors["longitude"]}
              intent={locationErrors["longitude"] ? Intent.DANGER : Intent.NONE}
            >
              <InputGroup
                placeholder="120.984222"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                intent={locationErrors["longitude"] ? Intent.DANGER : Intent.NONE}
              />
            </FormGroup>

            <FormGroup
              label="Geo Precision"
              helperText={locationErrors["geo_precision"]}
              intent={
                locationErrors["geo_precision"] ? Intent.DANGER : Intent.NONE
              }
            >
              <HTMLSelect
                fill
                value={geoPrecision}
                onChange={(e) => setGeoPrecision(e.target.value)}
                options={GEO_PRECISION_OPTIONS}
              />
            </FormGroup>
          </div>
        </div>
      </DialogBody>

      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} disabled={submitting} />
            <Button
              text="Create Ticket"
              intent={Intent.PRIMARY}
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
