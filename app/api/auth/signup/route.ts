import { NextResponse } from "next/server";
import { lucia } from "@/lib";
import { db } from "@/lib/db";
import { signUpSchema } from "@/lib/validators";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

export async function POST(req: Request, { headers }: { headers: Headers }) {
  try {
    const json = await req.json();
    // const { email, password, nickname, timezone, token } =
    //   signUpSchema.parse(json);
    const { email, password, nickname, timezone, token } = json;

    // Verify invitation token
    const invitation = await db.invitationToken.findUnique({
      where: { token, used: false },
    });
    console.log("Invitation", invitation);
    if (!invitation || invitation.expiresAt < new Date()) {
      return new NextResponse("Invalid or expired invitation token", {
        status: 400,
      });
    }

    // const hashedPassword = await new Argon2id().hash(password);
    const hashedPassword = password;
    const userId = generateId(15);

    await db.$transaction([
      db.user.create({
        data: {
          id: userId,
          email,
          nickname,
          timezone,
          password: hashedPassword,
        },
      }),
      db.invitationToken.update({
        where: { token },
        data: {
          used: true,
          userNickname: nickname,
          userId,
        },
      }),
    ]);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return new NextResponse(null, {
      status: 201,
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (error) {
    console.error("[SIGNUP_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
