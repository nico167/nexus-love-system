import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { prismaEventToTimelineEvent, validateTimelineInput } from "@/lib/timeline";
import { TimelineMediaType } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.timelineEvent.findMany({
    include: {
      media: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return NextResponse.json({
    events: events.map(prismaEventToTimelineEvent),
  });
}

export async function POST(request: Request) {
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

  const created = await prisma.timelineEvent.create({
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

  return NextResponse.json(
    { event: prismaEventToTimelineEvent(created) },
    { status: 201 }
  );
}
