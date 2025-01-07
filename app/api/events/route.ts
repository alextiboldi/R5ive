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

export async function POST(req: Request) {
  try {
    const session = await validateRequest();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = eventSchema.parse(json);

    const event = await db.eventAnnouncement.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
