export function ColumnHeaderBadge({ count }: { count: number }) {
  return (
    <span className="bp5-tag bp5-minimal" style={{ marginLeft: 6 }}>
      {count}
    </span>
  );
}
