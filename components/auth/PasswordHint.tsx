"use client";

import { useState } from "react";

export function PasswordHint() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-lg border border-nexus-border/60 bg-nexus-panel/50 p-4">
      <button
        type="button"
        onClick={() => setRevealed((prev) => !prev)}
        className="flex w-full items-center justify-between font-mono text-xs text-nexus-muted transition hover:text-nexus-glow"
      >
        <span>💡 ¿Necesitas una pista?</span>
        <span className="text-nexus-accent">{revealed ? "▲" : "▼"}</span>
      </button>

      {revealed && (
        <p className="mt-3 animate-fade-in font-mono text-xs leading-relaxed text-nexus-muted">
          <span className="text-nexus-glow">[HINT]:</span> Recuerda aquella noche en la que
          dijimos que el universo conspiraba a nuestro favor... la contraseña es la fecha en
          que todo comenzó, escrita como{" "}
          <code className="rounded bg-nexus-dark px-1.5 py-0.5 text-nexus-accent">
            DDMMYYYY
          </code>
          .
        </p>
      )}
    </div>
  );
}
