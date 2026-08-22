import type { Letter as PrismaLetter } from "@prisma/client";
import type { Letter } from "@/types/letters";

interface LetterInput {
  title: string;
  content: string;
}

export function prismaLetterToLetter(letter: PrismaLetter): Letter {
  return {
    id: letter.id,
    title: letter.title,
    content: letter.content,
    createdAt: letter.createdAt.toISOString(),
    updatedAt: letter.updatedAt.toISOString(),
  };
}

export function validateLetterInput(payload: unknown):
  | { ok: true; value: LetterInput }
  | { ok: false; error: string } {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Payload inválido" };
  }

  const data = payload as Record<string, unknown>;
  const title = String(data.title ?? "").trim();
  const content = String(data.content ?? "").trim();

  if (!title) {
    return { ok: false, error: "El título es obligatorio" };
  }
  if (!content) {
    return { ok: false, error: "El contenido es obligatorio" };
  }

  return { ok: true, value: { title, content } };
}