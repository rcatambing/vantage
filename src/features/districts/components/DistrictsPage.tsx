import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Spinner,
  NonIdealState,
  Button,
  HTMLTable,
} from "@blueprintjs/core";
import { useDistrictList, useDistrictMutations } from "../hooks/useDistricts";
import DistrictSearchBar from "./DistrictSearchBar";
import DistrictFilters, { type DistrictFilterValues } from "./DistrictFilters";
import DistrictTypeTag from "./DistrictTypeTag";
import DistrictCreateDialog from "./DistrictCreateDialog";
import type { District, DistrictCreatePayload } from "../types";

/* Mock region/province data for filters — would come from API in production */
const REGIONS = ["NCR", "Region I", "Region II", "Region III", "Region IV-A", "Region V", "Region VI", "Region VII", "Region VIII", "Region IX", "Region X", "Region XI", "Region XII", "CAR", "BARMM"];
const PROVINCES = ["Cebu", "Manila", "Quezon", "Pangasinan", "Bulacan", "Negros Occidental", "Batangas", "Pampanga", "Rizal", "Davao del Sur"];

export default function DistrictsPage() {
  const navigate = useNavigate();
  const [search] = useState("");
  const [filters, setFilters] = useState<DistrictFilterValues>({
    districtType: "",
    region: "",
    province: "",
  });
  const [createOpen, setCreateOpen] = useState(false);

  const { data, loading, error, refetch } = useDistrictList({
    search: search || undefined,
    district_type: filters.districtType || undefined,
    region: filters.region || undefined,
    province: filters.province || undefined,
    page_size: 50,
  });

  const { create, loading: creating } = useDistrictMutations();

  const handleRowClick = useCallback(
    (id: string) => {
      navigate(`/districts/${id}`);
    },
    [navigate],
  );

  const handleCreate = useCallback(
    async (payload: DistrictCreatePayload) => {
      await create(payload);
      refetch();
    },
    [create, refetch],
  );

  const handleClearFilters = useCallback(() => {
    setFilters({ districtType: "", region: "", province: "" });
  }, []);

  const districts: District[] = data?.items ?? [];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Districts & Constituencies</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon="refresh" minimal onClick={refetch} title="Refresh" />
          <Button intent="primary" icon="add" onClick={() => setCreateOpen(true)}>
            Create District
          </Button>
        </div>
      </div>

      <DistrictSearchBar
        onSelect={(id) => navigate(`/districts/${id}`)}
        placeholder="Search districts..."
      />

      <DistrictFilters
        regions={REGIONS}
        provinces={PROVINCES}
        values={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
      />

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
          <Spinner size={24} />
        </div>
      )}

      {!loading && error && (
        <NonIdealState
          icon="error"
          title="Failed to load"
          description={error}
          action={
            <Button intent="primary" icon="refresh" onClick={refetch}>
              Retry
            </Button>
          }
        />
      )}

      {!loading && !error && districts.length === 0 && (
        <NonIdealState
          icon="map-marker"
          title="No districts found"
          description="Try adjusting your search or filters."
        />
      )}

      {!loading && !error && districts.length > 0 && (
        <HTMLTable compact striped style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Region</th>
              <th>Population</th>
              <th>Voters</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((d) => (
              <tr
                key={d.id}
                onClick={() => handleRowClick(d.id)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <code>{d.district_code}</code>
                </td>
                <td>
                  <strong>{d.name}</strong>
                </td>
                <td>
                  <DistrictTypeTag type={d.district_type} />
                </td>
                <td>{d.region}</td>
                <td>{d.population?.toLocaleString() ?? "—"}</td>
                <td>{d.registered_voters?.toLocaleString() ?? "—"}</td>
                <td>
                  <Button
                    icon="arrow-right"
                    minimal
                    small
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(d.id);
                    }}
                    aria-label={`View ${d.name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      <DistrictCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        provinces={PROVINCES.map((p) => ({ id: p.toLowerCase().replace(/\s+/g, "-"), name: p }))}
        cities={[]}
        loading={creating}
      />
    </div>
  );
}
