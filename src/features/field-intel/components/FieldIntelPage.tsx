import { useState, useMemo } from "react";
import {
  Button,
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
  HTMLTable,
  Classes,
  Icon,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import type { AnecdoteFilters } from "../types";
import { useAnecdoteList } from "../hooks/useIntel";
import ClassificationTag from "./ClassificationTag";
import IntelFilterBar from "./IntelFilterBar";
import AnecdoteCreateDialog from "./AnecdoteCreateDialog";

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

export default function FieldIntelPage() {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<AnecdoteFilters>({
    page: 1,
    page_size: 25,
  });
  const [createOpen, setCreateOpen] = useState(false);

  const { data, loading, error } = useAnecdoteList(campaignId, filters);

  const hasFilters = useMemo(
    () =>
      !!(
        filters.classification ||
        filters.date_from ||
        filters.date_to ||
        filters.author_id ||
        filters.district_id ||
        filters.search
      ),
    [filters],
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Field Intelligence</h2>
        {data && (
          <Tag minimal intent={Intent.NONE} style={{ fontSize: 12 }}>
            {data.total}
          </Tag>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button
            icon="mobile-phone"
            text="Canvass"
            onClick={() => navigate(`/campaigns/${campaignId}/field-intel/canvass`)}
          />
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="New Anecdote"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ marginBottom: 16 }}>
        <IntelFilterBar
          filters={filters}
          onChange={(next) => setFilters((f) => ({ ...f, ...next, page: 1 }))}
        />
      </div>

      {/* Error */}
      {error && (
        <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
          {error}
        </Callout>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spinner />
        </div>
      )}

      {/* Empty state */}
      {!loading && data?.items.length === 0 && (
        <NonIdealState
          icon="map"
          title={hasFilters ? "No matching anecdotes" : "No field intelligence yet"}
          description={
            hasFilters
              ? "Try adjusting your filters."
              : "Create your first anecdote to capture field observations."
          }
          action={
            <Button
              intent={Intent.PRIMARY}
              icon="plus"
              text="Create Anecdote"
              onClick={() => setCreateOpen(true)}
            />
          }
        />
      )}

      {/* Table */}
      {!loading && data && data.items.length > 0 && (
        <HTMLTable
          striped
          interactive
          className={Classes.HTML_TABLE}
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th style={{ width: 120 }}>Classification</th>
              <th>Author</th>
              <th>District</th>
              <th style={{ width: 120 }}>Date</th>
              <th style={{ width: 80 }}>Media</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr
                key={item.id}
                onClick={() => navigate(`/field-intel/${item.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <strong style={{ fontSize: 13 }}>{item.title}</strong>
                </td>
                <td>
                  <ClassificationTag classification={item.classification} />
                </td>
                <td>{item.author_name}</td>
                <td>{item.district_name ?? "—"}</td>
                <td>{formatDate(item.created_at)}</td>
                <td>
                  {item.media_urls.length > 0 ? (
                    <Tag minimal style={{ fontSize: 11 }}>
                      <Icon icon="media" size={11} style={{ marginRight: 4 }} />
                      {item.media_urls.length}
                    </Tag>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <Button
                    minimal
                    small
                    icon="eye-open"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/field-intel/${item.id}`);
                    }}
                    aria-label={`View ${item.title}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      {/* Pagination */}
      {data && data.total > data.page_size && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <Button
            small
            minimal
            icon="chevron-left"
            disabled={data.page <= 1}
            onClick={() =>
              setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))
            }
          >
            Prev
          </Button>
          <span style={{ fontSize: 12, color: "var(--cds-text-secondary)" }}>
            Page {data.page} of {Math.ceil(data.total / data.page_size)}
          </span>
          <Button
            small
            minimal
            icon="chevron-right"
            rightIcon="chevron-right"
            disabled={data.page >= Math.ceil(data.total / data.page_size)}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                page: Math.min(
                  Math.ceil(data.total / data.page_size),
                  (f.page ?? 1) + 1,
                ),
              }))
            }
          >
            Next
          </Button>
        </div>
      )}

      {/* Create dialog */}
      {campaignId && (
        <AnecdoteCreateDialog
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          campaignId={campaignId}
        />
      )}
    </div>
  );
}
