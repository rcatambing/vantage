import { Classes } from "@blueprintjs/core";

interface Props {
  street_address: string | null;
  barangay: string | null;
  city_municipality: string | null;
  province: string | null;
  zip_code: string | null;
}

export function OfficeAddress({
  street_address,
  barangay,
  city_municipality,
  province,
  zip_code,
}: Props) {
  const parts: string[] = [];
  if (street_address) parts.push(street_address);
  if (barangay) parts.push(`Brgy. ${barangay}`);

  const cityProvince = [city_municipality, province].filter(Boolean).join(", ");
  if (cityProvince) parts.push(cityProvince);
  if (zip_code) parts.push(zip_code);

  if (parts.length === 0) {
    return (
      <span className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>
        No address on file
      </span>
    );
  }

  return (
    <address style={{ fontStyle: "normal", fontSize: 13, lineHeight: 1.6 }}>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </address>
  );
}
