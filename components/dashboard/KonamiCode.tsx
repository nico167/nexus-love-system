"use client";

import { useEffect, useState, useCallback, useRef } from "react";

// Konami sequence: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

// Taps para mobile: 5 taps rápidos en menos de 2.5s para que sea más usable en touch
const MOBILE_TAP_COUNT = 5;
const MOBILE_TAP_WINDOW_MS = 2500;
const ACTIVATION_LOCK_MS = 400;

interface Particle {
  id: number;
  emoji: string;
  x: number; // % horizontal
  duration: number; // segundos
  delay: number; // segundos
  size: number; // px
}

const EMOJIS = ["💜", "🩷", "❤️", "✨", "💫", "🌸", "💕", "🫶"];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    x: Math.random() * 100,
    duration: 2.5 + Math.random() * 2,
    delay: Math.random() * 1.5,
    size: 18 + Math.floor(Math.random() * 22),
  }));
}

export function KonamiCode() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const seqRef = useRef<string[]>([]);
  const tapTimestamps = useRef<number[]>([]);
  const activationLockRef = useRef(false);

  const activate = useCallback(() => {
    setParticles(generateParticles(40));
    setActive(true);
    activationLockRef.current = true;
    window.setTimeout(() => {
      activationLockRef.current = false;
    }, ACTIVATION_LOCK_MS);
  }, []);

  const dismiss = useCallback(() => {
    setActive(false);
    seqRef.current = [];
    tapTimestamps.current = [];
    activationLockRef.current = false;
  }, []);

  // Desktop: Konami keyboard sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const next = [...seqRef.current, key];
      const slice = next.slice(-KONAMI_SEQUENCE.length);
      seqRef.current = slice;

      if (
        slice.length === KONAMI_SEQUENCE.length &&
        slice.every((k, i) => k === KONAMI_SEQUENCE[i])
      ) {
        activate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activate]);

  // Mobile: N taps rápidos en el logo/header (el componente envuelve el trigger)
  // Escuchamos taps en el document — 7 taps en menos de 2.5s
  useEffect(() => {
    const handleTap = () => {
      const now = Date.now();
      tapTimestamps.current = [
        ...tapTimestamps.current.filter((t) => now - t < MOBILE_TAP_WINDOW_MS),
        now,
      ];
      if (tapTimestamps.current.length >= MOBILE_TAP_COUNT) {
        tapTimestamps.current = [];
        activate();
      }
    };

    // Solo activar el listener de taps si no estamos en desktop (mouse)
    // Usamos touchstart para no interferir con clicks normales
    window.addEventListener("touchstart", handleTap, { passive: true });
    return () => window.removeEventListener("touchstart", handleTap);
  }, [activate]);

  // Auto-cerrar tras 6 segundos
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(dismiss, 6000);
    return () => clearTimeout(t);
  }, [active, dismiss]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-nexus-dark/90 backdrop-blur-sm"
      onClick={(e) => {
        if (activationLockRef.current) {
          activationLockRef.current = false;
          e.stopPropagation();
          return;
        }
        dismiss();
      }}
      aria-label="Easter egg activado — toca para cerrar"
    >
      {/* Partículas cayendo */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute top-0 animate-particle-fall"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--duration": `${p.duration}s`,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          {p.emoji}
        </span>
      ))}

      {/* Mensaje central */}
      <div
        className="relative z-10 animate-scale-in text-center px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícono principal */}
        <div className="mb-4 animate-heart-burst text-6xl xs:text-7xl sm:text-8xl">
          💜
        </div>

        {/* Título */}
        <h2 className="font-mono text-xl xs:text-2xl sm:text-3xl font-bold text-gradient mb-3">
          ¡Easter Egg encontrado!
        </h2>

        {/* Mensaje especial */}
        <div className="mx-auto max-w-xs xs:max-w-sm rounded-2xl border border-nexus-accent/30 bg-nexus-panel/80 p-4 xs:p-6 backdrop-blur-sm panel-glow">
          <p className="mb-3 font-mono text-xs xs:text-sm leading-relaxed text-nexus-muted">
            <span className="text-nexus-glow">[SECRET]</span>
          </p>
          <p className="font-display text-sm leading-relaxed text-white xs:text-base">
            &quot;Eres el mejor easter egg que he encontrado en toda mi vida.&quot;
          </p>
          <p className="mt-3 font-mono text-xs text-nexus-muted">
            — Nico 💜
          </p>
        </div>

        {/* Hint para cerrar */}
        <p className="mt-4 font-mono text-xs text-nexus-muted/50 animate-fade-in">
          toca en cualquier lugar para cerrar
        </p>
      </div>
    </div>
  );
}
