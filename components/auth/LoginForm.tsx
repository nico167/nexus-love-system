"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginSuccessAnimation } from "@/components/auth/LoginSuccessAnimation";
import { PasswordHint } from "@/components/auth/PasswordHint";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      username: username.toLowerCase().trim(),
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Acceso denegado. Verifica tus credenciales.");
      return;
    }

    setShowSuccess(true);

    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1800);
  }

  return (
    <>
      <LoginSuccessAnimation show={showSuccess} />

      <form
        onSubmit={handleSubmit}
        className={`space-y-5 transition-all duration-500 ${
          showSuccess ? "scale-95 opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-mono text-nexus-muted">
            user.username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="tu_usuario"
            className="w-full rounded-lg border border-nexus-border bg-nexus-dark/80 px-4 py-3 font-mono text-sm text-white placeholder:text-nexus-muted/50 outline-none transition focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent/50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-mono text-nexus-muted">
            user.password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-nexus-border bg-nexus-dark/80 px-4 py-3 font-mono text-sm text-white placeholder:text-nexus-muted/50 outline-none transition focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent/50"
          />
        </div>

        <PasswordHint />

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-sm text-red-300"
          >
            [ERROR]: {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || showSuccess}
          className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-nexus-accent to-nexus-glow px-4 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="relative z-10">
            {isLoading ? "Autenticando..." : "Iniciar sesión"}
          </span>
          <span className="absolute inset-0 -translate-x-full bg-white/20 transition group-hover:translate-x-full duration-500" />
        </button>
      </form>
    </>
  );
}
