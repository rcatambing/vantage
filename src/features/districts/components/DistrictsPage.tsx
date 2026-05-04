import { Spinner, NonIdealState, Button, HTMLTable, Tag, InputGroup } from "@blueprintjs/core";
import { useState } from "react";
import { useDistricts } from "../hooks/useDistricts";

const GRAY_50 = "#8d8d8d";

function typeColor(type: string): string {
  if (type === "REGION") return "#0f62fe";
  if (type === "PROVINCE") return "#42be65";
  if (type === "CITY") return "#f1c21b";
  return "#8d8d8d";
}

export default function DistrictsPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useDistricts({ search: search || undefined, page_size: 50 });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Districts & Constituencies</h1>
        <Button icon="refresh" minimal onClick={refetch} title="Refresh" />
      </div>

      <div style={{ marginBottom: 16, maxWidth: 400 }}>
        <InputGroup
          placeholder="Search districts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && refetch()}
          rightElement={<Button icon="search" minimal small onClick={refetch} />}
        />
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
          <Spinner size={24} />
        </div>
      )}
      {!loading && error && (
        <NonIdealState icon="error" title="Failed to load" description={error} />
      )}
      {!loading && !error && data && (
        <HTMLTable compact striped style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Province</th>
              <th>City</th>
              <th>Barangay</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: GRAY_50 }}>No districts found</td>
              </tr>
            )}
            {data.items.map((d) => (
              <tr key={d.district_id}>
                <td>{d.district_code}</td>
                <td><strong>{d.district_name}</strong></td>
                <td>
                  <Tag style={{ backgroundColor: typeColor(d.district_type), color: "#fff" }} minimal>
                    {d.district_type}
                  </Tag>
                </td>
                <td>{d.province ?? "—"}</td>
                <td>{d.city ?? "—"}</td>
                <td>{d.barangay ?? "—"}</td>
                <td>{d.city_class ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}
    </div>
  );
}
