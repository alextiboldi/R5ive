import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createInviteSchema } from "@/lib/validators";
import { addDays } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { adminNickname } = createInviteSchema.parse(json);

    const invitation = await db.invitationToken.create({
      data: {
        token: crypto.randomUUID(),
        adminNickname,
        expiresAt: addDays(new Date(), 30),
        createdBy: session.user.id
      }
    });

    return NextResponse.json({ token: invitation.token });
  } catch (error) {
    console.error("[INVITES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}