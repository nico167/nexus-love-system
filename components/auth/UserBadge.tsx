"use client";

import { signOut, useSession } from "next-auth/react";
import { ROLE_LABELS } from "@/lib/rbac";

export function UserBadge() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const isAdmin = session.user.role === "admin";

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="font-mono text-sm text-white">{session.user.name}</p>
        <p className="font-mono text-xs text-nexus-muted">
          role:{" "}
          <span className={isAdmin ? "text-nexus-accent" : "text-nexus-glow"}>
            {ROLE_LABELS[session.user.role]}
          </span>
        </p>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded-lg border border-nexus-border px-3 py-1.5 font-mono text-xs text-nexus-muted transition hover:border-red-500/50 hover:text-red-300"
      >
        logout()
      </button>
    </div>
  );
}
