import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { TimelineMediaType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { prismaEventToTimelineEvent, validateTimelineInput } from "@/lib/timeline";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  const existing = await prisma.timelineEvent.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  await prisma.timelineMedia.deleteMany({
    where: { eventId: existing.id },
  });

  await prisma.timelineEvent.delete({
    where: { id: existing.id },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = validateTimelineInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { id } = await context.params;

  const existing = await prisma.timelineEvent.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  await prisma.timelineMedia.deleteMany({
    where: { eventId: existing.id },
  });

  const updated = await prisma.timelineEvent.update({
    where: { id: existing.id },
    data: {
      title: parsed.value.title,
      commitTag: parsed.value.commitTag,
      date: new Date(parsed.value.date),
      location: parsed.value.location,
      latitude: parsed.value.coordinates.lat,
      longitude: parsed.value.coordinates.lng,
      patchNotes: parsed.value.patchNotes,
      media: {
        create: parsed.value.media.map((entry, index) => ({
          type: entry.type === "image" ? TimelineMediaType.IMAGE : TimelineMediaType.VIDEO,
          url: entry.url,
          alt: entry.alt,
          order: index,
        })),
      },
    },
    include: {
      media: true,
    },
  });

  return NextResponse.json({
    event: prismaEventToTimelineEvent(updated),
  });
}
