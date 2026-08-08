import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserBadge } from "@/components/auth/UserBadge";
import { MemoryCounter } from "@/components/dashboard/MemoryCounter";
import { NavCard } from "@/components/dashboard/NavCard";
import { ConsoleEasterEgg } from "@/components/dashboard/ConsoleEasterEgg";
import { KonamiCode } from "@/components/dashboard/KonamiCode";

// Fecha real de inicio de la relación
const RELATIONSHIP_START = new Date("2026-02-22T00:00:00");

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "admin";
  const name = session.user.name;
  // El nombre de la VIP para el contador (solo se muestra si es VIP)
  const counterName = isAdmin ? "nosotros" : name;

  return (
    <>
      <ConsoleEasterEgg />
      <KonamiCode />

      <main
        className="min-h-screen px-3 pb-8 pt-safe sm:px-4"
        data-custom-note="Bienvenida al centro de operaciones del corazón. Todo funciona porque tú existes."
      >
        <div className="mx-auto w-full max-w-2xl">
          <header className="flex flex-col items-start gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
            <div data-custom-note="Sistema activo. Amor en línea. Tú: conectada.">
              <p className="font-mono text-[10px] xs:text-xs uppercase tracking-[0.25em] text-nexus-muted">
                <span className="text-nexus-accent">◆</span> Nexus Love System
              </p>
              <h1 className="mt-0.5 font-display text-lg font-semibold text-white sm:text-xl">
                Hola, {" "}
                <span className="text-gradient">{name}</span> {isAdmin ? "⚙️" : "💜"}
              </h1>
            </div>

            <UserBadge />
          </header>

          <section
            className="mb-4 xs:mb-5 animate-slide-up"
            aria-label="Contador de tiempo juntos"
          >
            <MemoryCounter
              startDate={RELATIONSHIP_START}
              name={counterName ?? "nosotros"}
            />
          </section>

          <section
            className="space-y-3 xs:space-y-4 animate-slide-up-delay"
            aria-label="Módulos del sistema"
          >
            <p className="px-1 font-mono text-[10px] xs:text-xs uppercase tracking-[0.2em] text-nexus-muted">
              <span className="text-nexus-accent">{'//'}</span> módulos disponibles
            </p>

            <NavCard
              href="/timeline"
              icon="🗺️"
              title="Our Timeline & Map"
              subtitle="module.timeline"
              description="Recorre los momentos especiales en un mapa interactivo. Cada pin, una historia."
              accentColor="pink"
              isAdmin={isAdmin}
              adminNote="Puedes agregar y editar eventos"
            />
          </section>

          <footer
            className="mt-8 xs:mt-10 text-center"
            data-custom-note="Si lees esto, eres increíble. Punto."
          >
            <p className="font-mono text-[10px] xs:text-xs text-nexus-muted/40">
              nexus-love-system · v2.0 · solo usuarios del corazón
            </p>
            {isAdmin && (
              <p className="mt-1 font-mono text-[10px] text-nexus-muted/25">
                [HINT]: prueba ↑ ↑ ↓ ↓ ← → ← → B A desde teclado
              </p>
            )}
          </footer>
        </div>
      </main>
    </>
  );
}
