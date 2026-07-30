import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function TimelinePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "admin";

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-lg">

        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-nexus-muted hover:text-nexus-glow transition-colors"
        >
          ← volver al dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-nexus-muted">
            <span className="text-nexus-accent">◆</span> module.timeline
          </p>
          <h1 className="mt-2 font-display text-2xl xs:text-3xl font-bold text-gradient">
            Our Timeline & Map
          </h1>
          <p className="mt-2 font-mono text-sm text-nexus-muted">
            Cada lugar, cada momento. Nuestros recuerdos en el mapa.
          </p>
        </div>

        {/* Placeholder */}
        <div
          className="rounded-2xl border border-nexus-border bg-nexus-panel/60 p-8 text-center panel-glow"
          data-custom-note="Aquí vivirán todos nuestros lugares especiales."
        >
          <div className="mb-4 text-5xl">🗺️</div>
          <p className="font-mono text-sm text-nexus-muted mb-2">
            <span className="text-nexus-glow">[CARGANDO]</span>
          </p>
          <p className="font-display text-base text-white mb-1">
            Módulo en construcción
          </p>
          <p className="font-mono text-xs text-nexus-muted/60">
            El mapa interactivo y el timeline se implementarán en la Fase 3.
          </p>

          {isAdmin && (
            <div className="mt-6 rounded-lg border border-nexus-accent/20 bg-nexus-accent/5 p-3">
              <p className="font-mono text-xs text-nexus-accent">
                [ADMIN] Aquí podrás agregar y editar eventos del timeline.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
