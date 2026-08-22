import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { prismaLetterToLetter, validateLetterInput } from "@/lib/letters";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "admin") {
    return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await requireAdmin();
  if (access.response) {
    return access.response;
  }

  const { id } = await context.params;
  const existing = await prisma.letter.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Carta no encontrada" }, { status: 404 });
  }

  const parsed = validateLetterInput(await request.json());
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const letter = await prisma.letter.update({ where: { id }, data: parsed.value });
  return NextResponse.json({ letter: prismaLetterToLetter(letter) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const access = await requireAdmin();
  if (access.response) {
    return access.response;
  }

  const { id } = await context.params;
  const existing = await prisma.letter.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Carta no encontrada" }, { status: 404 });
  }

  await prisma.letter.delete({ where: { id } });
  return NextResponse.json({ success: true });
}