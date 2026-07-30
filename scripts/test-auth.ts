/**
 * Script de verificación de auth — Fase 1
 * Ejecutar con: npm run test:auth
 */

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";

function parseCookies(setCookieHeader: string | null): string {
  if (!setCookieHeader) return "";
  return setCookieHeader
    .split(/,(?=\s*[^;]+=[ ^;]+)/)
    .map((c) => c.split(";")[0].trim())
    .join("; ");
}

async function login(
  username: string,
  password: string
): Promise<{ ok: boolean; cookies: string }> {
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const csrfCookies = parseCookies(csrfRes.headers.get("set-cookie"));
  const csrfToken = ((await csrfRes.json()) as { csrfToken: string }).csrfToken;

  const body = new URLSearchParams({
    csrfToken,
    username,
    password,
    redirect: "false",
    json: "true",
  });

  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookies,
    },
    body: body.toString(),
  });

  const responseCookies = parseCookies(res.headers.get("set-cookie"));
  const allCookies = [csrfCookies, responseCookies].filter(Boolean).join("; ");

  return { ok: res.status === 200, cookies: allCookies };
}

async function getSession(cookies: string) {
  const res = await fetch(`${BASE}/api/auth/session`, {
    headers: { Cookie: cookies },
  });
  return res.json();
}

async function getAdminStatus(cookies: string) {
  const res = await fetch(`${BASE}/api/admin/status`, {
    headers: { Cookie: cookies },
  });
  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : { raw: await res.text() };
  return { status: res.status, body };
}

async function run() {
  console.log("🧪 Nexus Love System — Test Fase 1 (Auth + RBAC)\n");

  // ─── Test 1: Login inválido ───────────────────────────────────────────────
  const badLogin = await login("isi", "wrongpassword");
  const badSession = await getSession(badLogin.cookies);
  console.log(
    badSession.user ? "❌ Login inválido debería fallar" : "✅ Login inválido rechazado"
  );

  // ─── Test 2: Login VIP ────────────────────────────────────────────────────
  const vipLogin = await login("isi", "22022026");
  const vipSession = (await getSession(vipLogin.cookies)) as {
    user?: { role: string; username: string };
  };
  console.log(
    vipSession.user?.role === "vip"
      ? `✅ Login VIP OK (${vipSession.user.username})`
      : "❌ Login VIP falló"
  );

  // ─── Test 3: RBAC — VIP no puede acceder a /api/admin/status ─────────────
  const vipAdmin = await getAdminStatus(vipLogin.cookies);
  console.log(
    vipAdmin.status === 403
      ? "✅ RBAC: VIP bloqueado en /api/admin/status"
      : `❌ RBAC VIP falló (status ${vipAdmin.status})`
  );

  // ─── Test 4: Login Admin ──────────────────────────────────────────────────
  const adminLogin = await login("nicocarmona", "nico16783*");
  const adminSession = (await getSession(adminLogin.cookies)) as {
    user?: { role: string; username: string };
  };
  console.log(
    adminSession.user?.role === "admin"
      ? `✅ Login Admin OK (${adminSession.user.username})`
      : "❌ Login Admin falló"
  );

  // ─── Test 5: RBAC — Admin puede acceder a /api/admin/status ──────────────
  const adminStatus = await getAdminStatus(adminLogin.cookies);
  console.log(
    adminStatus.status === 200
      ? "✅ RBAC: Admin accede a /api/admin/status"
      : `❌ RBAC Admin falló (status ${adminStatus.status})`
  );

  console.log("\n🏁 Tests completados.");
}

run().catch(console.error);
