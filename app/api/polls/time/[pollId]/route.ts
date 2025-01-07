import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { timePollSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const session = await validateRequest();
    if (!session || session?.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { title, description, timeSlots } = timePollSchema.parse(json);

    const poll = await db.poll.create({
      data: {
        title,
        description,
        type: "TIME",
        userId: session.user.id,
        timeSlots: {
          create: timeSlots,
        },
      },
      include: {
        timeSlots: true,
      },
    });

    return NextResponse.json(poll);
  } catch (error) {
    console.error("[TIME_POLLS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
