import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const voteSchema = z.object({
  vote: z.boolean(),
});

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
    const { vote } = voteSchema.parse(json);

    const pollVote = await db.pollVote.upsert({
      where: {
        userId_pollId: {
          userId: session.user.id,
          pollId: params.pollId,
        },
      },
      update: {
        vote,
      },
      create: {
        vote,
        userId: session.user.id,
        pollId: params.pollId,
      },
    });

    return NextResponse.json(pollVote);
  } catch (error) {
    console.error("[POLL_VOTE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
