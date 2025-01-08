import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const responseSchema = z.object({
  response: z.enum(["ACCEPTED", "DECLINED"]),
});

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await validateRequest();
    if (!session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { response } = responseSchema.parse(json);

    const eventResponse = await db.eventResponse.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.eventId,
        },
      },
      update: { response },
      create: {
        response,
        userId: session.user.id,
        eventId: params.eventId,
      },
    });

    return NextResponse.json(eventResponse);
  } catch (error) {
    console.error("[EVENT_RESPONSE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
