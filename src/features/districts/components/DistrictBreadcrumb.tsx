import { Breadcrumbs, Breadcrumb, type BreadcrumbProps } from "@blueprintjs/core";
import { Link } from "react-router";
import type { District } from "../types";

interface Props {
  ancestors: District[];
  currentName: string;
}

/**
 * Blueprint Breadcrumbs showing district hierarchy.
 * Hierarchy: PROVINCE → CITY → BARANGAY.
 * Each crumb is a clickable link.
 * aria-label="District hierarchy", aria-current="page" on last item.
 * Truncated on mobile: "… > Cebu > Cebu City"
 */
export default function DistrictBreadcrumb({ ancestors, currentName }: Props) {
  const allItems: BreadcrumbProps[] = [
    { text: "Districts", href: "/districts" },
    ...ancestors.map((a) => ({
      text: a.name,
      href: `/districts/${a.id}`,
    })),
    { text: currentName },
  ];

  return (
    <nav aria-label="District hierarchy">
      <Breadcrumbs
        items={allItems}
        currentBreadcrumbRenderer={({ text, ...props }) => (
          <Breadcrumb {...props} aria-current="page">
            {text}
          </Breadcrumb>
        )}
        breadcrumbRenderer={({ text, href, ...props }) => {
          if (href) {
            return (
              <Breadcrumb {...props}>
                <Link to={href} style={{ color: "inherit", textDecoration: "none" }}>
                  {text}
                </Link>
              </Breadcrumb>
            );
          }
          return <Breadcrumb {...props}>{text}</Breadcrumb>;
        }}
      />
    </nav>
  );
}
