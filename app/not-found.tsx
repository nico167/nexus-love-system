import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#120b18] px-4 py-10 text-white">
      <div className="w-full max-w-xl rounded-[28px] border border-nexus-border bg-nexus-panel/70 p-8 text-center shadow-[0_0_40px_rgba(233,30,140,0.15)] backdrop-blur-sm sm:p-12">
        <div className="mb-5 text-6xl">💔</div>

        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-nexus-muted">
          <span className="text-nexus-accent">◆</span> 404 · ruta perdida
        </p>

        <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
          Parece que esta ruta se perdió en el mapa
        </h1>

        <p className="mt-4 font-mono text-sm leading-relaxed text-nexus-muted">
          Pero no te preocupes, mi amor: aquí no hay errores, solo caminos que aún no encontramos.
          <span className="mt-2 block text-nexus-accent">Te llevo de vuelta al lugar donde todo empieza.</span>
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-full border border-nexus-accent/40 bg-nexus-accent/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-nexus-accent transition hover:bg-nexus-accent/20"
          >
            volver al dashboard
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-nexus-border bg-nexus-dark/60 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white transition hover:border-nexus-accent/40 hover:text-nexus-glow"
          >
            iniciar sesión
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-nexus-border/60 bg-nexus-dark/40 p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-nexus-muted">
          [mensaje secreto]: Siempre te elijo a ti, en cada ruta y en cada destino.
        </div>
      </div>
    </main>
  );
}
