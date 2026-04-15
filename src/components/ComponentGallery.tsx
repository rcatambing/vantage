import {
  Drawer,
  InputGroup,
  Tag,
  Button,
  Icon,
  Intent,
  Classes,
} from "@blueprintjs/core";
import { useApp } from "../context/useApp";
import { GALLERY_ITEMS, GALLERY_GROUPS } from "../data/gallery";
import { useState, useMemo } from "react";

export default function ComponentGallery() {
  const { galleryOpen, setGalleryOpen } = useApp();
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchGroup = !activeGroup || item.group === activeGroup;
      return matchSearch && matchGroup;
    });
  }, [search, activeGroup]);

  return (
    <Drawer
      isOpen={galleryOpen}
      onClose={() => setGalleryOpen(false)}
      position="right"
      size="400px"
      title="Component Gallery"
      icon="grid-view"
    >
      <div className={Classes.DRAWER_BODY} style={{ padding: 16 }}>
        <InputGroup
          leftIcon="search"
          placeholder="Search components…"
          value={search}
          onValueChange={setSearch}
          style={{ marginBottom: 12 }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <Tag
            interactive
            intent={activeGroup === null ? Intent.PRIMARY : Intent.NONE}
            minimal={activeGroup !== null}
            onClick={() => setActiveGroup(null)}
          >
            All
          </Tag>
          {GALLERY_GROUPS.map((g) => (
            <Tag
              key={g}
              interactive
              intent={activeGroup === g ? Intent.PRIMARY : Intent.NONE}
              minimal={activeGroup !== g}
              onClick={() => setActiveGroup(activeGroup === g ? null : g)}
            >
              {g}
            </Tag>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {filtered.map((item) => (
            <div key={item.code} className="gallery-card">
              <div className="gallery-card-preview">
                <Icon icon={item.icon as never} size={28} className={Classes.TEXT_MUTED} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                  <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
                    {item.code} · {item.group}
                  </div>
                </div>
                <Button small intent={Intent.PRIMARY} icon="plus" text="Add" />
              </div>
              <div className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}
