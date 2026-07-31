import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { TimelineModule } from "@/components/timeline/TimelineModule";
import { prisma } from "@/lib/prisma";
import { prismaEventToTimelineEvent } from "@/lib/timeline";

export default async function TimelinePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "admin";

  const storedEvents = await prisma.timelineEvent.findMany({
    include: {
      media: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const initialEvents = storedEvents.map(prismaEventToTimelineEvent);

  return (
    <main className="min-h-screen px-3 py-5 sm:px-4 sm:py-6">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-2 font-mono text-xs text-nexus-muted transition-colors hover:text-nexus-glow"
        >
          ← volver al dashboard
        </Link>

        <header className="mb-6 rounded-2xl border border-nexus-border bg-nexus-panel/40 p-4 xs:p-5 panel-glow">
          <p className="font-mono text-[10px] xs:text-xs uppercase tracking-[0.25em] text-nexus-muted">
            <span className="text-nexus-accent">◆</span> module.timeline
          </p>
          <h1 className="mt-2 font-display text-2xl xs:text-3xl font-bold text-gradient">
            Our Timeline & Map
          </h1>
          <p className="mt-2 font-mono text-sm text-nexus-muted">
            Cada lugar, cada momento. Nuestros recuerdos conectados en mapa y tarjetas.
          </p>
          {isAdmin && (
            <p className="mt-3 font-mono text-xs text-nexus-accent/80">
              [ADMIN] Puedes crear y editar eventos desde el boton flotante.
            </p>
          )}
        </header>

        <TimelineModule initialEvents={initialEvents} isAdmin={isAdmin} />
      </div>
    </main>
  );
}
