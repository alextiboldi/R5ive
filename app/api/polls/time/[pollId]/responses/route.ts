import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const responseSchema = z.array(
  z.object({
    timeSlotId: z.string(),
    available: z.boolean(),
  })
);

export async function POST(
  req: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const session = await validateRequest();
    if (!session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const responses = responseSchema.parse(json);

    console.log("Responses", responses);

    await db.$transaction(
      responses.map((response) =>
        db.timeSlotResponse.upsert({
          where: {
            userId_timeSlotId: {
              userId: session.user.id,
              timeSlotId: response.timeSlotId,
            },
          },
          update: { available: response.available },
          create: {
            available: response.available,
            userId: session.user.id,
            timeSlotId: response.timeSlotId,
          },
        })
      )
    );

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[TIME_POLL_RESPONSE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
