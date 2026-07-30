"use client";

import Link from "next/link";
import { useRef } from "react";

interface NavCardProps {
  href: string;
  icon: string;           // emoji
  title: string;
  subtitle: string;       // estilo "commit" / etiqueta técnica
  description: string;
  accentColor?: "pink" | "violet"; // para diferenciar las dos tarjetas
  isAdmin?: boolean;
  adminNote?: string;     // texto extra para admin
  disabled?: boolean;
}

export function NavCard({
  href,
  icon,
  title,
  subtitle,
  description,
  accentColor = "pink",
  isAdmin = false,
  adminNote,
  disabled = false,
}: NavCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const isPink = accentColor === "pink";
  const accentClass = isPink ? "text-nexus-accent" : "text-violet-400";
  const borderClass = isPink
    ? "border-nexus-border hover:border-nexus-accent/50 focus-visible:border-nexus-accent"
    : "border-nexus-border hover:border-violet-400/50 focus-visible:border-violet-400";
  const glowClass = isPink
    ? "hover:shadow-[0_0_40px_rgba(233,30,140,0.2)]"
    : "hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]";
  const shimmerColor = isPink
    ? "rgba(233,30,140,0.08)"
    : "rgba(139,92,246,0.08)";
  const badgeBg = isPink
    ? "border-nexus-accent/30 bg-nexus-accent/10 text-nexus-accent"
    : "border-violet-400/30 bg-violet-400/10 text-violet-400";

  if (disabled) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-nexus-border bg-nexus-panel/30 p-5 xs:p-6 opacity-50 cursor-not-allowed">
        <div className="flex items-start gap-4">
          <span className="text-3xl xs:text-4xl grayscale">{icon}</span>
          <div>
            <p className="font-mono text-xs text-nexus-muted uppercase tracking-widest">{subtitle}</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-nexus-muted">{title}</h3>
            <p className="mt-2 font-mono text-xs text-nexus-muted/60">[PRÓXIMAMENTE]</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      ref={cardRef}
      href={href}
      className={`
        group relative block overflow-hidden rounded-2xl border bg-nexus-panel/60
        backdrop-blur-sm transition-all duration-300 outline-none
        card-interactive panel-glow
        ${borderClass} ${glowClass}
        focus-visible:ring-2 focus-visible:ring-nexus-accent/50
      `}
      aria-label={`Ir a ${title}`}
    >
      {/* Shimmer en hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, transparent 30%, ${shimmerColor} 50%, transparent 70%)`,
          backgroundSize: "200% 200%",
        }}
      />

      {/* Decoración de fondo */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ background: isPink ? "#e91e8c" : "#8b5cf6" }}
      />

      <div className="relative p-5 xs:p-6">
        {/* Fila superior: ícono + badges */}
        <div className="mb-4 flex items-start justify-between gap-3">
          {/* Ícono con animación float */}
          <span className="text-4xl xs:text-5xl group-hover:animate-float transition-transform duration-300 select-none">
            {icon}
          </span>

          <div className="flex flex-col items-end gap-1.5">
            {/* Flecha de navegación */}
            <span
              className={`font-mono text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 ${accentClass}`}
            >
              →
            </span>
            {/* Badge admin */}
            {isAdmin && (
              <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] xs:text-[10px] uppercase tracking-wider ${badgeBg}`}>
                admin
              </span>
            )}
          </div>
        </div>

        {/* Subtítulo técnico */}
        <p className={`font-mono text-[10px] xs:text-xs uppercase tracking-[0.2em] mb-1 ${accentClass}`}>
          {subtitle}
        </p>

        {/* Título */}
        <h3 className="font-display text-lg xs:text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300">
          {title}
        </h3>

        {/* Descripción */}
        <p className="font-mono text-xs xs:text-sm leading-relaxed text-nexus-muted group-hover:text-nexus-muted/80 transition-colors duration-200">
          {description}
        </p>

        {/* Nota extra de admin */}
        {isAdmin && adminNote && (
          <div className={`mt-3 rounded-lg border px-3 py-2 ${badgeBg.replace("text-", "border-").split(" ")[0]} bg-transparent border-opacity-30`}>
            <p className={`font-mono text-[10px] xs:text-xs ${accentClass}`}>
              [ADMIN] {adminNote}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
