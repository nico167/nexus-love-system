"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { TimelineEvent, TimelineMedia } from "@/types/timeline";
import { timelineSeed } from "@/lib/timelineSeed";

const TimelineMap = dynamic(
  () => import("@/components/timeline/TimelineMap").then((mod) => mod.TimelineMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full animate-pulse rounded-2xl border border-nexus-border bg-nexus-panel/50 xs:h-[320px] sm:h-[380px]" />
    ),
  }
);

interface TimelineModuleProps {
  initialEvents: TimelineEvent[];
  isAdmin: boolean;
}

interface EventFormState {
  title: string;
  commitTag: string;
  date: string;
  location: string;
  lat: string;
  lng: string;
  patchNotes: string;
  media: TimelineMedia[];
}

const EMPTY_FORM: EventFormState = {
  title: "",
  commitTag: "feat(life): new-memory",
  date: "",
  location: "",
  lat: "",
  lng: "",
  patchNotes: "",
  media: [],
};

function toInputDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString().split("T")[0];
}

function toFormFromEvent(event: TimelineEvent): EventFormState {
  return {
    title: event.title,
    commitTag: event.commitTag,
    date: toInputDate(event.date),
    location: event.location,
    lat: String(event.coordinates.lat),
    lng: String(event.coordinates.lng),
    patchNotes: event.patchNotes.join("\n"),
    media: event.media.map((entry) => ({ ...entry })),
  };
}

function createLocalId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const sigResponse = await fetch("/api/cloudinary/signature", { method: "POST" });
  if (!sigResponse.ok) {
    throw new Error("No se pudo iniciar la subida a Cloudinary");
  }
  const { timestamp, signature, apiKey, cloudName, folder } =
    (await sigResponse.json()) as CloudinarySignatureResponse;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error("No se pudo subir el archivo a Cloudinary");
  }

  const data = (await uploadResponse.json()) as { secure_url: string };
  return data.secure_url;
}

export function TimelineModule({ initialEvents, isAdmin }: TimelineModuleProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(
    initialEvents.length > 0 ? initialEvents : timelineSeed
  );
  const [mapFocusToken, setMapFocusToken] = useState(0);
  const [activeEventId, setActiveEventId] = useState<string | null>(
    initialEvents[0]?.id ?? null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formState, setFormState] = useState<EventFormState>(EMPTY_FORM);
  const [isPickingCoordinates, setIsPickingCoordinates] = useState(false);
  const [pickedCoordinates, setPickedCoordinates] = useState<
    { lat: number; lng: number } | null
  >(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<TimelineEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReorderingNotes, setIsReorderingNotes] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [events]
  );

  function focusEvent(eventId: string) {
    setActiveEventId(eventId);
    const element = document.getElementById(`timeline-card-${eventId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function focusOnMap(eventId: string) {
    setActiveEventId(eventId);
    setMapFocusToken((token) => token + 1);
    const mapElement = document.getElementById("timeline-map-container");
    mapElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openCreateForm() {
    setEditingEventId(null);
    setFormError("");
    setFormState(EMPTY_FORM);
    setIsPickingCoordinates(false);
    setPickedCoordinates(null);
    setIsFormOpen(true);
  }

  function openEditForm(event: TimelineEvent) {
    setEditingEventId(event.id);
    setFormError("");
    setFormState(toFormFromEvent(event));
    setPickedCoordinates({
      lat: event.coordinates.lat,
      lng: event.coordinates.lng,
    });
    setIsPickingCoordinates(false);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingEventId(null);
    setFormError("");
    setFormState(EMPTY_FORM);
    setIsPickingCoordinates(false);
    setPickedCoordinates(null);
  }

  function onPickCoordinates(coords: { lat: number; lng: number }) {
    setPickedCoordinates(coords);
    updateField("lat", coords.lat.toFixed(6));
    updateField("lng", coords.lng.toFixed(6));
    setIsPickingCoordinates(false);
  }

  async function handleAddMediaFiles(files: FileList | null, type: "image" | "video") {
    if (!files || files.length === 0) {
      return;
    }

    const fileArray = Array.from(files);
    const setUploading = type === "image" ? setIsUploadingImage : setIsUploadingVideo;

    setUploading(true);
    setFormError("");

    try {
      for (const file of fileArray) {
        const url = await uploadToCloudinary(file);
        const newItem: TimelineMedia = {
          id: createLocalId(),
          type,
          url,
          alt: `${type === "image" ? "Foto" : "Video"} de ${formState.title || "evento"}`,
        };
        setFormState((prev) => ({ ...prev, media: [...prev.media, newItem] }));
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : `Error subiendo ${type === "image" ? "la imagen" : "el video"}`
      );
    } finally {
      setUploading(false);
    }
  }

  function removeMediaItem(id: string) {
    setFormState((prev) => ({
      ...prev,
      media: prev.media.filter((item) => item.id !== id),
    }));
  }

  function moveMediaItem(id: string, direction: "up" | "down") {
    setFormState((prev) => {
      const index = prev.media.findIndex((item) => item.id === id);
      if (index < 0) {
        return prev;
      }
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= prev.media.length) {
        return prev;
      }
      const media = [...prev.media];
      const temp = media[index];
      media[index] = media[swapIndex];
      media[swapIndex] = temp;
      return { ...prev, media };
    });
  }

  function reorderNotes(direction: "up" | "down", index: number) {
    if (!editingEventId) {
      return;
    }

    const current = [...events];
    const targetEvent = current.find((entry) => entry.id === editingEventId);
    if (!targetEvent) {
      return;
    }

    const reorderedNotes = [...targetEvent.patchNotes];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= reorderedNotes.length) {
      return;
    }

    const temp = reorderedNotes[index];
    reorderedNotes[index] = reorderedNotes[swapIndex];
    reorderedNotes[swapIndex] = temp;

    const updated = current.map((entry) =>
      entry.id === editingEventId
        ? { ...entry, patchNotes: reorderedNotes }
        : entry
    );

    setEvents(updated);
  }

  function updateField<K extends keyof EventFormState>(key: K, value: EventFormState[K]) {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function onDeleteConfirm() {
    if (!eventToDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/timeline/${eventToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el evento");
      }

      setEvents((prev) => prev.filter((entry) => entry.id !== eventToDelete.id));
      setIsDeleteConfirmOpen(false);
      setEventToDelete(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No se pudo eliminar el evento");
    } finally {
      setIsDeleting(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!formState.title || !formState.date || !formState.location || !formState.lat || !formState.lng) {
      setFormError("Completa todos los campos obligatorios.");
      return;
    }

    if (isUploadingImage || isUploadingVideo) {
      setFormError("Espera a que termine de subir el archivo.");
      return;
    }

    const media = formState.media.map((item) => ({
      type: item.type,
      url: item.url,
      alt: item.alt,
    }));

    const payload = {
      title: formState.title.trim(),
      commitTag: formState.commitTag.trim() || "feat(life): memory",
      date: formState.date,
      location: formState.location.trim(),
      coordinates: {
        lat: Number(formState.lat),
        lng: Number(formState.lng),
      },
      patchNotes: formState.patchNotes
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      media,
    };

    setIsSaving(true);
    setFormError("");

    try {
      const response = await fetch(
        editingEventId ? `/api/timeline/${editingEventId}` : "/api/timeline",
        {
          method: editingEventId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "No se pudo guardar el evento");
      }

      const data = (await response.json()) as { event: TimelineEvent };

      setEvents((prev) => {
        if (editingEventId) {
          return prev.map((entry) =>
            entry.id === editingEventId ? data.event : entry
          );
        }
        return [data.event, ...prev];
      });

      setActiveEventId(data.event.id);
      closeForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "No se pudo guardar el evento"
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <div id="timeline-map-container" className="rounded-2xl border border-nexus-border bg-nexus-panel/55 p-4 xs:p-5">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-nexus-muted">
          <span className="text-nexus-accent">{"//"}</span> mapa de recuerdos
        </p>
        <TimelineMap
          events={sortedEvents}
          activeEventId={activeEventId}
          onSelectEvent={focusEvent}
          focusToken={mapFocusToken}
          pickerMode={isAdmin && isFormOpen && isPickingCoordinates}
          pickedCoordinates={pickedCoordinates}
          onPickCoordinates={onPickCoordinates}
        />
      </div>

      <div className="space-y-4">
        {sortedEvents.map((eventItem, index) => {
          const isActive = eventItem.id === activeEventId;
          return (
            <article
              id={`timeline-card-${eventItem.id}`}
              key={eventItem.id}
              className={`rounded-2xl border bg-nexus-panel/60 p-4 xs:p-5 transition-all ${
                isActive
                  ? "border-nexus-accent/70 shadow-[0_0_30px_rgba(233,30,140,0.18)]"
                  : "border-nexus-border"
              }`}
              data-custom-note={`Evento ${index + 1}: ${eventItem.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-nexus-glow">
                    {eventItem.commitTag}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-white xs:text-xl">
                    {eventItem.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-nexus-muted">
                    {new Date(eventItem.date).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                    · {eventItem.location}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => focusOnMap(eventItem.id)}
                  className="rounded-lg border border-nexus-border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-nexus-muted transition hover:border-nexus-accent/50 hover:text-nexus-glow"
                >
                  ver en mapa
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-nexus-muted">
                  Patch Notes
                </p>
                <ul className="space-y-2 font-mono text-xs leading-relaxed text-nexus-muted">
                  {eventItem.patchNotes.map((line, lineIndex) => (
                    <li key={`${eventItem.id}-note-${lineIndex}`} className="rounded-lg border border-nexus-border/60 bg-nexus-dark/35 px-3 py-2">
                      + {line}
                    </li>
                  ))}
                </ul>
              </div>

              {eventItem.media.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-nexus-muted">
                    Galeria ({eventItem.media.length})
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {eventItem.media.map((asset) =>
                      asset.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={asset.id}
                          src={asset.url}
                          alt={asset.alt}
                          loading="lazy"
                          className="w-full rounded-xl border border-nexus-border bg-nexus-dark/30 object-contain"
                          style={{ aspectRatio: "4 / 3" }}
                        />
                      ) : (
                        <video
                          key={asset.id}
                          src={asset.url}
                          controls
                          playsInline
                          className="w-full rounded-xl border border-nexus-border bg-nexus-dark/30 object-cover"
                          style={{ aspectRatio: "4 / 3" }}
                        >
                          Tu navegador no soporta video.
                        </video>
                      )
                    )}
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(eventItem)}
                    className="rounded-lg border border-nexus-accent/40 bg-nexus-accent/10 px-3 py-1.5 font-mono text-xs text-nexus-accent transition hover:bg-nexus-accent/20"
                  >
                    editar evento
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEventToDelete(eventItem);
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-mono text-xs text-red-300 transition hover:bg-red-500/20"
                  >
                    eliminar evento
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {isAdmin && (
        <button
          type="button"
          onClick={openCreateForm}
          className="fixed bottom-5 left-4 z-40 rounded-full border border-nexus-accent/60 bg-nexus-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(233,30,140,0.35)] transition hover:brightness-110 sm:left-6"
        >
          + agregar evento
        </button>
      )}

      {isAdmin && isFormOpen && (
        <div
          className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/70 p-3 sm:items-center"
          onClick={closeForm}
        >
          <div
            className="relative z-[1101] max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-nexus-border bg-nexus-panel p-4 xs:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="font-display text-xl font-semibold text-white">
              {editingEventId ? "Editar evento" : "Nuevo evento"}
            </h3>
            <p className="mt-1 font-mono text-xs text-nexus-muted">
              Guarda eventos reales en base de datos. Fotos y videos se suben a Cloudinary.
            </p>

            {formError && (
              <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-300">
                {formError}
              </div>
            )}

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <input
                required
                value={formState.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Titulo del evento"
                className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-sm text-white outline-none focus:border-nexus-accent"
              />
              <input
                required
                value={formState.commitTag}
                onChange={(event) => updateField("commitTag", event.target.value)}
                placeholder="feat(life): memory"
                className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-sm text-white outline-none focus:border-nexus-accent"
              />
              <div className="grid gap-3 xs:grid-cols-2">
                <input
                  required
                  type="date"
                  value={formState.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-sm text-white outline-none focus:border-nexus-accent"
                />
                <input
                  required
                  value={formState.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="Ubicacion"
                  className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-sm text-white outline-none focus:border-nexus-accent"
                />
              </div>
              <div className="grid gap-3 xs:grid-cols-2">
                <input
                  required
                  type="number"
                  step="any"
                  value={formState.lat}
                  onChange={(event) => updateField("lat", event.target.value)}
                  placeholder="Latitud"
                  className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-sm text-white outline-none focus:border-nexus-accent"
                />
                <input
                  required
                  type="number"
                  step="any"
                  value={formState.lng}
                  onChange={(event) => updateField("lng", event.target.value)}
                  placeholder="Longitud"
                  className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-sm text-white outline-none focus:border-nexus-accent"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsPickingCoordinates((prev) => !prev)}
                className="w-full rounded-lg border border-nexus-glow/40 bg-nexus-glow/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-nexus-glow"
              >
                {isPickingCoordinates
                  ? "tap en el mini mapa para fijar coordenadas"
                  : "seleccionar coordenadas desde mapa"}
              </button>

              {isPickingCoordinates && (
                <div className="space-y-2">
                  <p className="font-mono text-[11px] text-nexus-muted">
                    toca un punto en el mini mapa para autocompletar latitud y longitud.
                  </p>
                  <TimelineMap
                    events={sortedEvents}
                    activeEventId={activeEventId}
                    onSelectEvent={() => undefined}
                    pickerMode
                    pickedCoordinates={pickedCoordinates}
                    onPickCoordinates={onPickCoordinates}
                    heightClassName="h-56 w-full"
                  />
                </div>
              )}

              {pickedCoordinates && (
                <p className="font-mono text-[11px] text-nexus-muted">
                  seleccionado: {pickedCoordinates.lat.toFixed(5)}, {" "}
                  {pickedCoordinates.lng.toFixed(5)}
                </p>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-nexus-muted">
                    Patch Notes
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsReorderingNotes((prev) => !prev)}
                    className="font-mono text-[10px] uppercase tracking-[0.15em] text-nexus-glow"
                  >
                    {isReorderingNotes ? "cerrar reorden" : "reordenar"}
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formState.patchNotes}
                  onChange={(event) => updateField("patchNotes", event.target.value)}
                  placeholder="Una nota por linea"
                  className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-sm text-white outline-none focus:border-nexus-accent"
                />
                {isReorderingNotes && (
                  <div className="rounded-lg border border-nexus-border/60 bg-nexus-dark/40 p-2">
                    {formState.patchNotes
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, index, arr) => (
                        <div key={`${line}-${index}`} className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-nexus-border/50 px-2 py-2">
                          <span className="font-mono text-xs text-nexus-muted">{line}</span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const current = formState.patchNotes.split("\n").filter(Boolean);
                                const swapIndex = index - 1;
                                if (swapIndex < 0) return;
                                const updated = [...current];
                                const temp = updated[index];
                                updated[index] = updated[swapIndex];
                                updated[swapIndex] = temp;
                                updateField("patchNotes", updated.join("\n"));
                              }}
                              className="rounded border border-nexus-border px-2 py-1 font-mono text-[10px] text-nexus-muted"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const current = formState.patchNotes.split("\n").filter(Boolean);
                                const swapIndex = index + 1;
                                if (swapIndex >= current.length) return;
                                const updated = [...current];
                                const temp = updated[index];
                                updated[index] = updated[swapIndex];
                                updated[swapIndex] = temp;
                                updateField("patchNotes", updated.join("\n"));
                              }}
                              className="rounded border border-nexus-border px-2 py-1 font-mono text-[10px] text-nexus-muted"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-nexus-muted">
                  Media ({formState.media.length})
                </p>

                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-nexus-muted">
                    Agregar imagenes
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploadingImage}
                    onChange={(event) => {
                      handleAddMediaFiles(event.target.files, "image");
                      event.target.value = "";
                    }}
                    className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-xs text-white outline-none file:mr-3 file:rounded file:border-0 file:bg-nexus-accent file:px-3 file:py-1 file:font-mono file:text-xs file:text-white disabled:opacity-50"
                  />
                  {isUploadingImage && (
                    <p className="mt-1 font-mono text-[10px] text-nexus-glow">subiendo imagen(es)...</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-nexus-muted">
                    Agregar videos
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    disabled={isUploadingVideo}
                    onChange={(event) => {
                      handleAddMediaFiles(event.target.files, "video");
                      event.target.value = "";
                    }}
                    className="w-full rounded-lg border border-nexus-border bg-nexus-dark/70 px-3 py-2 font-mono text-xs text-white outline-none file:mr-3 file:rounded file:border-0 file:bg-nexus-accent file:px-3 file:py-1 file:font-mono file:text-xs file:text-white disabled:opacity-50"
                  />
                  {isUploadingVideo && (
                    <p className="mt-1 font-mono text-[10px] text-nexus-glow">subiendo video(s)...</p>
                  )}
                </div>

                {formState.media.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-nexus-border/60 bg-nexus-dark/40 p-2">
                    {formState.media.map((asset, index, arr) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-2 rounded-lg border border-nexus-border/50 p-2"
                      >
                        {asset.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={asset.url}
                            alt={asset.alt}
                            className="h-12 w-12 flex-shrink-0 rounded-md border border-nexus-border object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-nexus-border bg-nexus-dark font-mono text-[10px] text-nexus-muted">
                            VIDEO
                          </div>
                        )}
                        <span className="flex-1 truncate font-mono text-[10px] text-nexus-muted">
                          {asset.type === "image" ? "Imagen" : "Video"} · {asset.url}
                        </span>
                        <div className="flex flex-shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => moveMediaItem(asset.id, "up")}
                            disabled={index === 0}
                            className="rounded border border-nexus-border px-2 py-1 font-mono text-[10px] text-nexus-muted disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMediaItem(asset.id, "down")}
                            disabled={index === arr.length - 1}
                            className="rounded border border-nexus-border px-2 py-1 font-mono text-[10px] text-nexus-muted disabled:opacity-30"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMediaItem(asset.id)}
                            className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 font-mono text-[10px] text-red-300"
                          >
                            eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSaving}
                  className="w-1/2 rounded-lg border border-nexus-border px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-nexus-muted disabled:opacity-50"
                >
                  cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingImage || isUploadingVideo}
                  className="w-1/2 rounded-lg bg-gradient-to-r from-nexus-accent to-nexus-glow px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-60"
                >
                  {isSaving ? "guardando..." : "guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdmin && isDeleteConfirmOpen && eventToDelete && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-nexus-border bg-nexus-panel p-4">
            <h3 className="font-display text-xl font-semibold text-white">Eliminar evento</h3>
            <p className="mt-2 font-mono text-sm text-nexus-muted">
              ¿Seguro que quieres eliminar <span className="text-nexus-accent">{eventToDelete.title}</span>?
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setEventToDelete(null);
                }}
                disabled={isDeleting}
                className="w-1/2 rounded-lg border border-nexus-border px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-nexus-muted"
              >
                cancelar
              </button>
              <button
                type="button"
                onClick={onDeleteConfirm}
                disabled={isDeleting}
                className="w-1/2 rounded-lg bg-red-500/80 px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-white"
              >
                {isDeleting ? "eliminando..." : "sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
