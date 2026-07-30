"use client";

interface LoginSuccessAnimationProps {
  show: boolean;
}

export function LoginSuccessAnimation({ show }: LoginSuccessAnimationProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nexus-dark/95 backdrop-blur-sm">
      <div className="animate-slide-up text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-nexus-accent animate-pulse-glow">
          <svg
            className="h-10 w-10 text-nexus-glow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>

        <h2 className="font-mono text-xl font-semibold text-gradient">
          Acceso concedido
        </h2>
        <p className="mt-2 font-mono text-sm text-nexus-muted">
          [STATUS]: Conexión establecida. Redirigiendo...
        </p>

        <div className="mt-6 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-nexus-accent animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
