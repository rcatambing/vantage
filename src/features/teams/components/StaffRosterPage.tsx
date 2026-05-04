import { useState, useCallback, useEffect } from "react";
import {
  HTMLTable,
  Tag,
  Intent,
  Button,
  ButtonGroup,
  InputGroup,
  HTMLSelect,
  Spinner,
  NonIdealState,
  Classes,
  Tooltip,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import { getStaffList } from "../api/teamApi";
import type { StaffProfile, PaginatedResponse, MemberRole } from "../types";

const PAGE_SIZE = 20;

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "TEAM_LEAD", label: "Team Lead" },
  { value: "MEMBER", label: "Member" },
  { value: "OBSERVER", label: "Observer" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

function roleIntent(role: MemberRole): Intent {
  switch (role) {
    case "TEAM_LEAD":
      return Intent.PRIMARY;
    case "MEMBER":
      return Intent.SUCCESS;
    case "OBSERVER":
      return Intent.NONE;
    default:
      return Intent.NONE;
  }
}

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

/** PII masking: show •••• for contacts unless viewer is MANAGER/SUPERVISOR.
 *  For now we mask unconditionally; integrate with AuthContext role when available. */
function maskContact(contact: string | null): string {
  if (!contact) return "—";
  return "••••";
}

export default function StaffRosterPage() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [page, setPage] = useState(1);

  const [teamOptions, setTeamOptions] = useState<{ value: string; label: string }[]>([]);
  const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string }[]>([]);

  const fetchStaff = useCallback(() => {
    setLoading(true);
    setError(null);
    getStaffList({
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      team_id: teamFilter || undefined,
      staff_type: typeFilter || undefined,
      district: districtFilter || undefined,
      search: search.trim() || undefined,
      page,
      page_size: PAGE_SIZE,
    })
      .then((res: PaginatedResponse<StaffProfile>) => {
        setStaff(res.items);
        setTotal(res.total);

        // Build dynamic filter options from results
        const teams = new Map<string, string>();
        const districts = new Set<string>();
        res.items.forEach((s) => {
          s.teams.forEach((t) => teams.set(t.team_id, t.team_name));
          s.district_names.forEach((d) => districts.add(d));
        });
        setTeamOptions([
          { value: "", label: "All Teams" },
          ...Array.from(teams.entries()).map(([id, name]) => ({
            value: id,
            label: name,
          })),
        ]);
        setDistrictOptions([
          { value: "", label: "All Districts" },
          ...Array.from(districts).map((d) => ({ value: d, label: d })),
        ]);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [roleFilter, statusFilter, teamFilter, typeFilter, districtFilter, search, page]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter, teamFilter, typeFilter, districtFilter]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(
    search || roleFilter || statusFilter || teamFilter || typeFilter || districtFilter
  );

  function clearFilters() {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setTeamFilter("");
    setTypeFilter("");
    setDistrictFilter("");
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: "1px solid var(--cds-border-subtle)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Staff Roster
        </h2>
      </div>

      {/* Filter toolbar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <InputGroup
          leftIcon="search"
          placeholder="Search staff…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
        <HTMLSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={ROLE_OPTIONS}
        />
        <HTMLSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
        />
        <HTMLSelect
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          options={teamOptions}
          disabled={teamOptions.length <= 1}
        />
        <HTMLSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: "", label: "All Types" },
            { value: "FIELD", label: "Field" },
            { value: "OFFICE", label: "Office" },
            { value: "VOLUNTEER", label: "Volunteer" },
          ]}
        />
        <HTMLSelect
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          options={districtOptions}
          disabled={districtOptions.length <= 1}
        />
        {hasFilters && (
          <Button
            minimal
            icon="cross"
            text="Clear filters"
            onClick={clearFilters}
          />
        )}
        <span
          className={Classes.TEXT_MUTED}
          style={{ marginLeft: "auto", fontSize: 12 }}
        >
          {total} staff member{total !== 1 ? "s" : ""}
        </span>
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spinner size={36} />
        </div>
      )}

      {!loading && error && (
        <NonIdealState
          icon="warning-sign"
          title="Failed to load staff"
          description={error}
          action={<Button icon="refresh" text="Retry" onClick={fetchStaff} />}
        />
      )}

      {!loading && !error && staff.length === 0 && (
        <NonIdealState
          icon="people"
          title="No staff found"
          description={
            hasFilters
              ? "Try adjusting your filters."
              : "No staff records available."
          }
        />
      )}

      {!loading && !error && staff.length > 0 && (
        <>
          <HTMLTable
            striped
            interactive
            bordered
            compact
            style={{ width: "100%", fontSize: 13 }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Staff Type</th>
                <th>Team(s)</th>
                <th>Role(s)</th>
                <th>Status</th>
                <th>District</th>
                <th>Contact</th>
                <th>Last Activity</th>
                <th style={{ width: 60 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/staff/${s.user_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <span style={{ fontWeight: 500 }}>{s.full_name}</span>
                  </td>
                  <td>{s.staff_type}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {s.teams.map((t) => (
                        <Tag key={t.team_id} minimal style={{ fontSize: 11 }}>
                          {t.team_name}
                        </Tag>
                      ))}
                      {s.teams.length === 0 && (
                        <span className={Classes.TEXT_MUTED}>—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {s.teams.map((t) => (
                        <Tag
                          key={`${t.team_id}-${t.role}`}
                          minimal
                          intent={roleIntent(t.role)}
                          style={{ fontSize: 11 }}
                        >
                          {t.role.replace("_", " ")}
                        </Tag>
                      ))}
                      {s.teams.length === 0 && (
                        <span className={Classes.TEXT_MUTED}>—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Tag
                      minimal
                      intent={
                        s.status === "ACTIVE"
                          ? Intent.SUCCESS
                          : s.status === "SUSPENDED"
                          ? Intent.DANGER
                          : Intent.NONE
                      }
                      style={{ fontSize: 11 }}
                    >
                      {s.status}
                    </Tag>
                  </td>
                  <td className={Classes.TEXT_MUTED}>
                    {s.district_names.join(", ") || "—"}
                  </td>
                  <td className={Classes.TEXT_MUTED}>
                    <Tooltip content={maskContact(s.primary_contact)} placement="top">
                      <span>{maskContact(s.primary_contact)}</span>
                    </Tooltip>
                  </td>
                  <td className={Classes.TEXT_MUTED}>
                    {formatDate(s.last_activity)}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Tooltip content="View profile" placement="left">
                      <Button
                        minimal
                        small
                        icon="arrow-right"
                        onClick={() => navigate(`/staff/${s.user_id}`)}
                      />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>

          {total > PAGE_SIZE && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                marginTop: 12,
              }}
            >
              <ButtonGroup>
                <Button
                  icon="chevron-left"
                  minimal
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
                <Button
                  minimal
                  disabled
                  text={`Page ${page} of ${totalPages}`}
                  style={{ cursor: "default", minWidth: 110 }}
                />
                <Button
                  icon="chevron-right"
                  minimal
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                />
              </ButtonGroup>
            </div>
          )}
        </>
      )}
    </div>
  );
}
