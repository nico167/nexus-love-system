import { TimelineMediaType, type TimelineEvent as PrismaTimelineEvent } from "@prisma/client";
import type { TimelineEvent } from "@/types/timeline";

interface PrismaEventWithMedia extends PrismaTimelineEvent {
  media: {
    id: string;
    type: TimelineMediaType;
    url: string;
    alt: string;
    order: number;
  }[];
}

interface TimelineMediaInput {
  type: "image" | "video";
  url: string;
  alt: string;
}

interface TimelineEventInput {
  title: string;
  commitTag: string;
  date: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  patchNotes: string[];
  media: TimelineMediaInput[];
}

export function prismaEventToTimelineEvent(event: PrismaEventWithMedia): TimelineEvent {
  return {
    id: event.id,
    title: event.title,
    commitTag: event.commitTag,
    date: event.date.toISOString(),
    location: event.location,
    coordinates: {
      lat: event.latitude,
      lng: event.longitude,
    },
    patchNotes: event.patchNotes,
    media: event.media
      .sort((a, b) => a.order - b.order)
      .map((media) => ({
        id: media.id,
        type: media.type === TimelineMediaType.IMAGE ? "image" : "video",
        url: media.url,
        alt: media.alt,
      })),
  };
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateTimelineInput(payload: unknown): {
  ok: true;
  value: TimelineEventInput;
} | {
  ok: false;
  error: string;
} {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Payload inválido" };
  }

  const data = payload as Record<string, unknown>;
  const title = String(data.title ?? "").trim();
  const commitTag = String(data.commitTag ?? "").trim();
  const date = String(data.date ?? "").trim();
  const location = String(data.location ?? "").trim();
  const patchNotesRaw = Array.isArray(data.patchNotes) ? data.patchNotes : [];
  const mediaRaw = Array.isArray(data.media) ? data.media : [];

  const coordinatesRaw = data.coordinates as { lat?: unknown; lng?: unknown } | undefined;
  const lat = Number(coordinatesRaw?.lat);
  const lng = Number(coordinatesRaw?.lng);

  if (!title) {
    return { ok: false, error: "El título es obligatorio" };
  }
  if (!commitTag) {
    return { ok: false, error: "El commitTag es obligatorio" };
  }
  if (!date || Number.isNaN(new Date(date).getTime())) {
    return { ok: false, error: "La fecha es inválida" };
  }
  if (!location) {
    return { ok: false, error: "La ubicación es obligatoria" };
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, error: "Las coordenadas son inválidas" };
  }

  const patchNotes = patchNotesRaw
    .map((line) => String(line).trim())
    .filter(Boolean);

  if (patchNotes.length === 0) {
    return { ok: false, error: "Debe existir al menos una Patch Note" };
  }

  const media: TimelineMediaInput[] = [];
  for (const item of mediaRaw) {
    if (!item || typeof item !== "object") {
      return { ok: false, error: "Media inválida" };
    }

    const entry = item as Record<string, unknown>;
    const type = String(entry.type ?? "").toLowerCase();
    const url = String(entry.url ?? "").trim();
    const alt = String(entry.alt ?? "").trim();

    if (type !== "image" && type !== "video") {
      return { ok: false, error: "Tipo de media inválido" };
    }
    if (!url || !isValidUrl(url)) {
      return { ok: false, error: "URL de media inválida" };
    }

    media.push({
      type,
      url,
      alt: alt || "Media del evento",
    });
  }

  return {
    ok: true,
    value: {
      title,
      commitTag,
      date,
      location,
      coordinates: {
        lat,
        lng,
      },
      patchNotes,
      media,
    },
  };
}
