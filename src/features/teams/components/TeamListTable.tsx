import { useEffect, useState, useCallback } from "react";
import {
  HTMLTable,
  Tag,
  Intent,
  Spinner,
  NonIdealState,
  Button,
  ButtonGroup,
  InputGroup,
  HTMLSelect,
  Tooltip,
  Classes,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import { getTeams, getCampaigns } from "../api/teamApi";
import type { Team, CampaignRef } from "../types";

interface Props {
  /**
   * Increment this key from the parent to trigger a fresh fetch —
   * e.g. after a team is created or deleted.
   */
  refetchKey?: number;
}

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "DISSOLVED", label: "Dissolved" },
];

function statusIntent(status: string): Intent {
  return status === "ACTIVE" ? Intent.SUCCESS : Intent.NONE;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TeamListTable({ refetchKey = 0 }: Props) {
  const navigate = useNavigate();

  // Remote data
  const [teams, setTeams] = useState<Team[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [page, setPage] = useState(1);

  // Campaign dropdown options
  const [campaigns, setCampaigns] = useState<CampaignRef[]>([]);

  // Populate campaign filter dropdown once
  useEffect(() => {
    getCampaigns()
      .then((res) => setCampaigns(res.items))
      .catch(() => {
        // Campaign list is a convenience filter — fail silently if unavailable
      });
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, campaignFilter]);

  const fetchTeams = useCallback(() => {
    setLoading(true);
    setError(null);
    getTeams({
      campaign_id: campaignFilter || undefined,
      status: statusFilter || undefined,
      page,
      page_size: PAGE_SIZE,
    })
      .then((res) => {
        setTeams(res.items);
        setTotal(res.total);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [campaignFilter, statusFilter, page, refetchKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Client-side keyword filter applied on top of the current page's results.
  // Full-text search across all pages requires a `?q=` API parameter (Phase 2).
  const visibleTeams = search.trim()
    ? teams.filter(
        (t) =>
          t.team_name.toLowerCase().includes(search.toLowerCase()) ||
          (t.description ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : teams;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(search || statusFilter || campaignFilter);

  const campaignOptions = [
    { value: "", label: "All Campaigns" },
    ...campaigns.map((c) => ({ value: c.id, label: c.name })),
  ];

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setCampaignFilter("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── Filter toolbar ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <InputGroup
          leftIcon="search"
          placeholder="Search teams…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
        <HTMLSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
        />
        <HTMLSelect
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          options={campaignOptions}
          disabled={campaigns.length === 0}
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
          {total} team{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spinner size={36} />
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <NonIdealState
          icon="warning-sign"
          title="Failed to load teams"
          description={error}
          action={
            <Button icon="refresh" text="Retry" onClick={fetchTeams} />
          }
        />
      )}

      {/* ── Empty state ── */}
      {!loading && !error && visibleTeams.length === 0 && (
        <NonIdealState
          icon="people"
          title="No teams found"
          description={
            hasFilters
              ? "Try adjusting your filters."
              : "Create a team to get started."
          }
        />
      )}

      {/* ── Data table ── */}
      {!loading && !error && visibleTeams.length > 0 && (
        <HTMLTable
          striped
          interactive
          bordered
          compact
          style={{ width: "100%", fontSize: 13 }}
        >
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Description</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Members</th>
              <th>Created</th>
              <th style={{ width: 60 }} />
            </tr>
          </thead>
          <tbody>
            {visibleTeams.map((team) => (
              <tr
                key={team.id}
                onClick={() => navigate(`/teams/${team.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span style={{ fontWeight: 500 }}>{team.team_name}</span>
                </td>
                <td
                  className={Classes.TEXT_MUTED}
                  style={{ maxWidth: 300 }}
                >
                  <span
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {team.description ?? "—"}
                  </span>
                </td>
                <td>
                  <Tag
                    minimal
                    intent={statusIntent(team.status)}
                    style={{ fontSize: 11 }}
                  >
                    {team.status}
                  </Tag>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Tag
                    minimal
                    intent={team.member_count > 0 ? Intent.PRIMARY : Intent.NONE}
                  >
                    {team.member_count}
                  </Tag>
                </td>
                <td className={Classes.TEXT_MUTED}>
                  {formatDate(team.created_at)}
                </td>
                <td
                  // Prevent the row-level navigate from double-firing
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tooltip content="View team detail" placement="left">
                    <Button
                      minimal
                      small
                      icon="arrow-right"
                      onClick={() => navigate(`/teams/${team.id}`)}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      {/* ── Pagination ── */}
      {!loading && !error && total > PAGE_SIZE && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}
