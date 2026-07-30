import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function VaultPage() {
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
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-nexus-muted hover:text-violet-400 transition-colors"
        >
          ← volver al dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-nexus-muted">
            <span className="text-violet-400">◆</span> module.vault
          </p>
          <h1 className="mt-2 font-display text-2xl xs:text-3xl font-bold bg-gradient-to-r from-violet-400 to-nexus-glow bg-clip-text text-transparent">
            The Digital Vault
          </h1>
          <p className="mt-2 font-mono text-sm text-nexus-muted">
            Cartas y cápsulas del tiempo. Abiertas cuando más se necesitan.
          </p>
        </div>

        {/* Placeholder */}
        <div
          className="rounded-2xl border border-nexus-border bg-nexus-panel/60 p-8 text-center"
          style={{
            boxShadow:
              "0 0 0 1px rgba(139,92,246,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
          data-custom-note="Aquí están guardadas todas las palabras que no caben en un solo mensaje."
        >
          <div className="mb-4 text-5xl">🔒</div>
          <p className="font-mono text-sm text-nexus-muted mb-2">
            <span className="text-violet-400">[LOCKED]</span>
          </p>
          <p className="font-display text-base text-white mb-1">
            Módulo en construcción
          </p>
          <p className="font-mono text-xs text-nexus-muted/60">
            Las cartas y cápsulas del tiempo se implementarán en la Fase 4.
          </p>

          {isAdmin && (
            <div className="mt-6 rounded-lg border border-violet-400/20 bg-violet-400/5 p-3">
              <p className="font-mono text-xs text-violet-400">
                [ADMIN] Aquí podrás crear y programar mensajes del Vault.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
