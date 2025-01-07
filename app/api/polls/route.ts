import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { pollSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const session = await validateRequest();
    if (!session || session?.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = pollSchema.parse(json);

    const poll = await db.poll.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(poll);
  } catch (error) {
    console.error("[POLLS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
