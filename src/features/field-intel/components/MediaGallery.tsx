import { useState, useCallback, useRef, useEffect } from "react";
import {
  Button,
  Icon,
} from "@blueprintjs/core";

interface Props {
  mediaUrls: string[];
  altText: string;
  onRemove?: (url: string) => void;
}

export default function MediaGallery({ mediaUrls, altText, onRemove }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i > 0 ? i - 1 : mediaUrls.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i < mediaUrls.length - 1 ? i + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox, mediaUrls.length]);

  useEffect(() => {
    if (lightboxOpen && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [lightboxOpen]);

  const isVideo = (url: string) =>
    url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.startsWith("blob:") && url.includes("video");

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: 8,
          marginTop: 8,
        }}
      >
        {mediaUrls.map((url, idx) => (
          <div
            key={url + idx}
            style={{
              position: "relative",
              aspectRatio: "1",
              cursor: "pointer",
              border: "1px solid var(--cds-border-subtle)",
              overflow: "hidden",
              background: "var(--cds-layer-01)",
            }}
            onClick={() => openLightbox(idx)}
            role="button"
            tabIndex={0}
            aria-label={`View ${altText} media ${idx + 1}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(idx);
              }
            }}
          >
            {isVideo(url) ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "var(--cds-text-secondary)",
                }}
              >
                <Icon icon="video" size={24} />
              </div>
            ) : (
              <img
                src={url}
                alt={`${altText} thumbnail ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                loading="lazy"
              />
            )}
            {onRemove && (
              <Button
                minimal
                small
                icon="cross"
                intent="danger"
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  minHeight: 24,
                  minWidth: 24,
                  padding: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(url);
                }}
                aria-label={`Remove media ${idx + 1}`}
              />
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Media lightbox"
          tabIndex={-1}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
          onClick={closeLightbox}
        >
          <Button
            minimal
            icon="cross"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#fff",
              minHeight: 48,
              minWidth: 48,
            }}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          />
          {mediaUrls.length > 1 && (
            <>
              <Button
                minimal
                icon="chevron-left"
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  minHeight: 48,
                  minWidth: 48,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i > 0 ? i - 1 : mediaUrls.length - 1));
                }}
                aria-label="Previous image"
              />
              <Button
                minimal
                icon="chevron-right"
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  minHeight: 48,
                  minWidth: 48,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i < mediaUrls.length - 1 ? i + 1 : 0));
                }}
                aria-label="Next image"
              />
            </>
          )}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isVideo(mediaUrls[activeIndex]) ? (
              <video
                src={mediaUrls[activeIndex]}
                controls
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
                aria-label={`${altText} video ${activeIndex + 1}`}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={mediaUrls[activeIndex]}
                alt={`${altText} full view ${activeIndex + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            )}
            <div
              style={{
                color: "#fff",
                fontSize: 12,
                marginTop: 8,
                opacity: 0.7,
              }}
            >
              {activeIndex + 1} / {mediaUrls.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
