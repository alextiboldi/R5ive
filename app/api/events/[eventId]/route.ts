import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { z } from "zod";
import { validateRequest } from "@/lib/auth";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  timeGmt: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

export async function PUT(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await validateRequest();
    if (!session || session?.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = eventSchema.parse(json);

    const event = await db.eventAnnouncement.update({
      where: { id: params.eventId },
      data: body,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await validateRequest();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.eventAnnouncement.delete({
      where: { id: params.eventId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
