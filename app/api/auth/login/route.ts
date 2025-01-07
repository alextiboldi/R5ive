import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { lucia } from "@/lib";
import { db } from "@/lib/db";
import { signInSchema } from "@/lib/validators";
import { Argon2id } from "oslo/password";
import { trackUserSession } from "@/lib/tracking";
import { headers } from "next/headers";
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { email, password } = signInSchema.parse(json);

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    // const validPassword = await new Argon2id().verify(user.password, password);
    const validPassword = user.password === password;
    if (!validPassword) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return new NextResponse(null, {
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (error) {
    console.error("[LOGIN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
