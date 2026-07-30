"use client";

import { useEffect, useState, useRef } from "react";

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

function calcElapsed(startDate: Date): TimeElapsed {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = now.getTime() - startDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

interface UnitBlockProps {
  value: number;
  label: string;
  large?: boolean;
}

function UnitBlock({ value, label, large = false }: UnitBlockProps) {
  const prevRef = useRef(value);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value;
      setAnimKey((k) => k + 1);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <span
        key={animKey}
        className={`counter-digit font-bold text-white animate-counter-pop ${
          large
            ? "text-5xl xs:text-6xl sm:text-7xl"
            : "text-2xl xs:text-3xl sm:text-4xl"
        }`}
        style={{ letterSpacing: "-0.02em" }}
      >
        {large ? value : pad(value)}
      </span>
      <span className="mt-1 font-mono text-[10px] xs:text-xs uppercase tracking-widest text-nexus-muted">
        {label}
      </span>
    </div>
  );
}

interface MemoryCounterProps {
  startDate: Date;
  name?: string; // nombre de la VIP
}

export function MemoryCounter({ startDate, name = "nosotros" }: MemoryCounterProps) {
  const [elapsed, setElapsed] = useState<TimeElapsed>(() => calcElapsed(startDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setElapsed(calcElapsed(startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  if (!mounted) {
    // SSR placeholder para evitar hydration mismatch
    return (
      <div className="h-48 animate-pulse rounded-2xl bg-nexus-panel/60" />
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-nexus-border bg-nexus-panel/60 p-5 xs:p-6 sm:p-8 panel-glow animate-glow-pulse"
      data-custom-note={`${elapsed.totalDays} días de amor incondicional. ¿Ya te dijiste cuánto la quieres hoy?`}
    >
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-nexus-accent/8 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-nexus-glow/6 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative mb-5 xs:mb-6">
        <p className="font-mono text-[10px] xs:text-xs uppercase tracking-[0.25em] text-nexus-muted">
          <span className="text-nexus-accent">◆</span>{" "}
          system.uptime / {name}
        </p>
        <h2 className="mt-2 font-display text-lg xs:text-xl sm:text-2xl font-semibold text-white">
          Tiempo juntos
        </h2>
      </div>

      {/* Contador principal — Años · Meses · Días */}
      <div className="relative mb-5 xs:mb-6 flex items-end justify-around gap-2 xs:gap-4">
        <UnitBlock value={elapsed.years} label="años" large />
        <span className="mb-4 font-mono text-2xl text-nexus-border">·</span>
        <UnitBlock value={elapsed.months} label="meses" large />
        <span className="mb-4 font-mono text-2xl text-nexus-border">·</span>
        <UnitBlock value={elapsed.days} label="días" large />
      </div>

      {/* Divisor */}
      <div className="relative mb-4 h-px w-full bg-gradient-to-r from-transparent via-nexus-border to-transparent" />

      {/* Bloque de días totales */}
      <div className="relative mb-5 xs:mb-6 rounded-2xl border border-nexus-border/50 bg-nexus-dark/60 p-4 xs:p-5">
        <p className="font-mono text-[10px] xs:text-xs uppercase tracking-[0.2em] text-nexus-muted">
          <span className="text-nexus-accent">[TOTAL]</span> días acumulados
        </p>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-display text-4xl font-semibold text-white xs:text-5xl sm:text-6xl">
            {elapsed.totalDays.toLocaleString("es-CO")}
          </span>
          <span className="mb-1 font-mono text-sm uppercase tracking-[0.2em] text-nexus-muted">
            días
          </span>
        </div>
      </div>

      {/* Terminal line — métrica total */}
      <div className="relative rounded-lg border border-nexus-border/50 bg-nexus-dark/60 px-3 xs:px-4 py-2.5 xs:py-3">
        <p className="font-mono text-[10px] xs:text-xs leading-relaxed text-nexus-muted">
          <span className="text-nexus-glow">[STATUS]</span>{" "}
          <span className="text-nexus-accent">99.99%</span> disponibilidad de amor ·{" "}
          <span className="text-green-400">●</span> online
        </p>
      </div>
    </div>
  );
}
