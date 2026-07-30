import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserBadge } from "@/components/auth/UserBadge";
import { ROLE_LABELS } from "@/lib/rbac";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "admin";

  return (
    <main
      className="min-h-screen px-4 py-8"
      data-custom-note="Bienvenida al centro de operaciones del corazón."
    >
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-nexus-muted">
              Dashboard · Fase 1
            </p>
            <h1 className="mt-2 font-mono text-2xl font-bold text-gradient">
              Hola, {session.user.name}
            </h1>
          </div>
          <UserBadge />
        </header>

        <div className="panel-glow rounded-2xl border border-nexus-border bg-nexus-panel/60 p-8">
          <div className="font-mono text-sm space-y-3">
            <p className="text-nexus-muted">
              <span className="text-nexus-glow">[SYSTEM]</span> Autenticación completada
              correctamente.
            </p>
            <p className="text-nexus-muted">
              <span className="text-nexus-glow">[ROLE]</span>{" "}
              {ROLE_LABELS[session.user.role]} —{" "}
              {isAdmin
                ? "Acceso total habilitado (gestión de contenido disponible en fases posteriores)."
                : "Experiencia inmersiva habilitada (lectura e interacción)."}
            </p>
            <p className="text-nexus-muted">
              <span className="text-nexus-glow">[STATUS]</span> Módulos Timeline y Vault se
              implementarán en las siguientes fases.
            </p>
          </div>

          {isAdmin && (
            <div className="mt-6 rounded-lg border border-nexus-accent/30 bg-nexus-accent/5 p-4">
              <p className="font-mono text-xs text-nexus-accent">
                [ADMIN PANEL]: Zona de administración — disponible en Fase 3 y 4
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
