import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { prismaLetterToLetter, validateLetterInput } from "@/lib/letters";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const letters = await prisma.letter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ letters: letters.map(prismaLetterToLetter) });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = validateLetterInput(await request.json());
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const letter = await prisma.letter.create({ data: parsed.value });
  return NextResponse.json({ letter: prismaLetterToLetter(letter) }, { status: 201 });
}