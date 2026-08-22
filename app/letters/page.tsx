import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { prismaLetterToLetter } from "@/lib/letters";
import { LettersModule } from "@/components/letters/LettersModule";

export default async function LettersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "admin";
  const storedLetters = await prisma.letter.findMany({ orderBy: { createdAt: "desc" } });

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
            <span className="text-violet-400">◆</span> module.letters
          </p>
          <h1 className="mt-2 font-display text-2xl xs:text-3xl font-bold bg-gradient-to-r from-violet-400 to-nexus-glow bg-clip-text text-transparent">
            Our Letters
          </h1>
          <p className="mt-2 font-mono text-sm text-nexus-muted">
            Cartas escritas para leerlas cuando quieras.
          </p>
        </div>

        <div
          className="mb-5 rounded-2xl border border-nexus-border bg-nexus-panel/60 p-5"
          data-custom-note="Aquí están guardadas todas las palabras que no caben en un solo mensaje."
        >
          <p className="font-mono text-sm text-nexus-muted"><span className="text-violet-400">[READY]</span> Palabras guardadas para cuando quieras abrirlas.</p>
        </div>

        <LettersModule initialLetters={storedLetters.map(prismaLetterToLetter)} isAdmin={isAdmin} />

      </div>
    </main>
  );
}
