"use client";

import { useState } from "react";
import type { Letter } from "@/types/letters";

interface LettersModuleProps {
  initialLetters: Letter[];
  isAdmin: boolean;
}

const EMPTY_FORM = { title: "", content: "" };

export function LettersModule({ initialLetters, isAdmin }: LettersModuleProps) {
  const [letters, setLetters] = useState(initialLetters);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(letter: Letter) {
    setEditingId(letter.id);
    setForm({ title: letter.title, content: letter.content });
    setError("");
    setIsFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Completa el título y el contenido.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const response = await fetch(editingId ? `/api/letters/${editingId}` : "/api/letters", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => null)) as
        | { letter?: Letter; error?: string }
        | null;
      if (!response.ok || !data?.letter) {
        throw new Error(data?.error ?? "No se pudo guardar la carta");
      }

      setLetters((current) =>
        editingId
          ? current.map((letter) => (letter.id === editingId ? data.letter! : letter))
          : [data.letter!, ...current]
      );
      setSelectedLetter(data.letter);
      setIsFormOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar la carta");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteLetter(letter: Letter) {
    if (!window.confirm(`¿Eliminar la carta "${letter.title}"?`)) {
      return;
    }
    const response = await fetch(`/api/letters/${letter.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("No se pudo eliminar la carta.");
      return;
    }
    setLetters((current) => current.filter((entry) => entry.id !== letter.id));
    if (selectedLetter?.id === letter.id) {
      setSelectedLetter(null);
    }
  }

  return (
    <section className="space-y-4" aria-label="Cartas">
      {isAdmin && (
        <button
          type="button"
          onClick={openCreateForm}
          className="touch-target w-full rounded-xl border border-violet-400/40 bg-violet-400/10 px-4 py-3 font-mono text-sm text-violet-300 transition-colors hover:bg-violet-400/20"
        >
          + Escribir nueva carta
        </button>
      )}

      {letters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-nexus-border p-8 text-center">
          <p className="text-4xl">✉️</p>
          <p className="mt-3 font-display text-lg text-white">El archivo está esperando palabras</p>
          <p className="mt-2 font-mono text-xs text-nexus-muted">Todavía no hay cartas guardadas.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {letters.map((letter, index) => (
            <article key={letter.id} className="rounded-2xl border border-nexus-border bg-nexus-panel/60 p-4 transition-colors hover:border-violet-400/50">
              <button type="button" onClick={() => setSelectedLetter(letter)} className="w-full text-left">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-400">letter.{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 font-display text-lg font-semibold text-white">{letter.title}</h2>
                <p className="mt-2 font-mono text-xs text-nexus-muted">Abrir carta →</p>
              </button>
              {isAdmin && (
                <div className="mt-3 flex gap-3 border-t border-nexus-border pt-3 font-mono text-xs">
                  <button type="button" onClick={() => openEditForm(letter)} className="text-violet-300 hover:text-white">Editar</button>
                  <button type="button" onClick={() => deleteLetter(letter)} className="text-nexus-accent hover:text-white">Eliminar</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-3 py-6" role="dialog" aria-modal="true" aria-labelledby="letter-title">
          <article className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-violet-400/40 bg-nexus-panel p-5 shadow-[0_0_50px_rgba(139,92,246,0.2)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-400">[OPENED] carta recibida</p>
                <h2 id="letter-title" className="mt-2 font-display text-2xl font-bold text-white">{selectedLetter.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedLetter(null)} className="touch-target font-mono text-2xl text-nexus-muted hover:text-white" aria-label="Cerrar carta">×</button>
            </div>
            <p className="mt-6 whitespace-pre-wrap font-display text-base leading-8 text-white/90">{selectedLetter.content}</p>
          </article>
        </div>
      )}

      {isFormOpen && (
        <div className="rounded-2xl border border-violet-400/30 bg-nexus-panel/80 p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-semibold text-white">{editingId ? "Editar carta" : "Nueva carta"}</h2>
            <button type="button" onClick={() => setIsFormOpen(false)} className="font-mono text-xs text-nexus-muted hover:text-white">Cancelar</button>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Título de la carta" className="w-full rounded-lg border border-nexus-border bg-nexus-dark px-3 py-3 font-mono text-sm text-white outline-none focus:border-violet-400" maxLength={120} />
            <textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Escribe aquí tu carta..." rows={9} className="w-full resize-y rounded-lg border border-nexus-border bg-nexus-dark px-3 py-3 font-mono text-sm leading-relaxed text-white outline-none focus:border-violet-400" />
            {error && <p className="font-mono text-xs text-nexus-accent">{error}</p>}
            <button type="submit" disabled={isSaving} className="w-full rounded-lg bg-violet-400 px-4 py-3 font-mono text-sm font-semibold text-nexus-dark transition-opacity hover:opacity-90 disabled:opacity-50">{isSaving ? "Guardando..." : "Guardar carta"}</button>
          </form>
        </div>
      )}
      {error && !isFormOpen && <p className="font-mono text-xs text-nexus-accent">{error}</p>}
    </section>
  );
}