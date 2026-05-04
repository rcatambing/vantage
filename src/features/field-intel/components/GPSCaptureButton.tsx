import { useState, useCallback } from "react";
import {
  Button,
  Spinner,
  Callout,
  Intent,
} from "@blueprintjs/core";

interface Props {
  onCapture: (lat: number, lng: number, accuracy: number) => void;
  disabled?: boolean;
}

export default function GPSCaptureButton({ onCapture, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords({ lat: latitude, lng: longitude, accuracy });
        setLoading(false);
        onCapture(latitude, longitude, accuracy);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied. Please enable location access in your browser settings.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred while retrieving location.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [onCapture]);

  const ariaLabel = coords
    ? `GPS captured: latitude ${coords.lat.toFixed(6)}, longitude ${coords.lng.toFixed(6)}, accuracy ±${Math.round(coords.accuracy)} meters`
    : "Capture GPS location";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Button
        icon={loading ? undefined : "locate"}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        style={{
          minHeight: 48,
          minWidth: 48,
          borderRadius: 0,
          fontSize: 14,
        }}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Spinner size={16} />
            Acquiring GPS…
          </span>
        ) : coords ? (
          `GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} (±${Math.round(coords.accuracy)}m)`
        ) : (
          "Capture GPS"
        )}
      </Button>
      {error && (
        <Callout intent={Intent.DANGER} icon="error" style={{ fontSize: 12 }}>
          {error}
        </Callout>
      )}
    </div>
  );
}
