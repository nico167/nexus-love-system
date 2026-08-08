"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { TimelineEvent } from "@/types/timeline";

interface TimelineMapProps {
  events: TimelineEvent[];
  activeEventId: string | null;
  onSelectEvent: (eventId: string) => void;
  focusToken?: number;
  pickerMode?: boolean;
  pickedCoordinates?: { lat: number; lng: number } | null;
  onPickCoordinates?: (coords: { lat: number; lng: number }) => void;
  heightClassName?: string;
}

function MapClickCapture({
  pickerMode,
  onPickCoordinates,
}: {
  pickerMode: boolean;
  onPickCoordinates?: (coords: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(event) {
      if (!pickerMode || !onPickCoordinates) {
        return;
      }

      onPickCoordinates({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function FitBounds({ events }: { events: TimelineEvent[] }) {
  const map = useMap();

  useEffect(() => {
    if (events.length === 0) {
      return;
    }

    const bounds = L.latLngBounds(
      events.map((event) => [event.coordinates.lat, event.coordinates.lng])
    );

    map.fitBounds(bounds.pad(0.25), {
      animate: true,
    });
  }, [events, map]);

  return null;
}

function FocusActiveEvent({
  activeEventId,
  events,
  focusToken,
}: {
  activeEventId: string | null;
  events: TimelineEvent[];
  focusToken?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!activeEventId) {
      return;
    }

    const target = events.find((event) => event.id === activeEventId);
    if (!target) {
      return;
    }

    map.flyTo([target.coordinates.lat, target.coordinates.lng], 18, {
      animate: true,
      duration: 0.8,
    });
  }, [activeEventId, events, map, focusToken]);

  return null;
}

function createMarkerIcon(active: boolean) {
  const dotColor = active ? "#ff6eb4" : "#e91e8c";
  const ringColor = active ? "rgba(255,110,180,0.6)" : "rgba(233,30,140,0.35)";

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:28px;height:36px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;bottom:4px;width:16px;height:16px;border-radius:999px;background:${dotColor};box-shadow:0 0 0 6px ${ringColor},0 6px 16px rgba(0,0,0,0.45);"></div>
      <div style="position:absolute;bottom:0;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:11px solid ${dotColor};"></div>
    </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    popupAnchor: [0, -28],
  });
}

export function TimelineMap({
  events,
  activeEventId,
  onSelectEvent,
  focusToken,
  pickerMode = false,
  pickedCoordinates = null,
  onPickCoordinates,
  heightClassName = "h-[280px] w-full xs:h-[320px] sm:h-[380px]",
}: TimelineMapProps) {
  const fallbackCenter: [number, number] = [4.5709, -74.2973];

  return (
    <div className="relative isolate z-0 overflow-hidden rounded-2xl border border-nexus-border bg-nexus-panel/50 panel-glow">
      <MapContainer
        center={fallbackCenter}
        zoom={5}
        className={heightClassName}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds events={events} />
        <FocusActiveEvent activeEventId={activeEventId} events={events} focusToken={focusToken} />
        <MapClickCapture
          pickerMode={pickerMode}
          onPickCoordinates={onPickCoordinates}
        />

        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.coordinates.lat, event.coordinates.lng]}
            icon={createMarkerIcon(event.id === activeEventId)}
            eventHandlers={{
              click: () => onSelectEvent(event.id),
            }}
          >
            <Popup>
              <div className="font-mono text-xs">
                <p className="font-bold text-[#12121a]">{event.title}</p>
                <p>{event.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {pickerMode && pickedCoordinates && (
          <Marker
            position={[pickedCoordinates.lat, pickedCoordinates.lng]}
            icon={createMarkerIcon(true)}
          >
            <Popup>
              <div className="font-mono text-xs">
                <p className="font-bold text-[#12121a]">Punto seleccionado</p>
                <p>
                  {pickedCoordinates.lat.toFixed(5)}, {pickedCoordinates.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
