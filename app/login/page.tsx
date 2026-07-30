import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      data-custom-note="El acceso a este sistema está reservado para dos corazones conectados."
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-nexus-accent/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-nexus-glow/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-nexus-muted">
            Nexus Love System v1.0
          </p>
          <h1 className="mt-3 font-mono text-3xl font-bold text-gradient">
            Iniciar sesión
          </h1>
          <p className="mt-2 font-mono text-sm text-nexus-muted">
            [AUTH]: Verificación de identidad requerida
          </p>
        </div>

        <div className="panel-glow rounded-2xl border border-nexus-border bg-nexus-panel/80 p-8 backdrop-blur-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center font-mono text-xs text-nexus-muted/60">
          Solo usuarios autorizados · RBAC activo
        </p>
      </div>
    </main>
  );
}
