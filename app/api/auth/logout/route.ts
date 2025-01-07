import { NextResponse } from "next/server";
import { lucia } from "@/lib";
import { validateRequest } from "@/lib/auth";

export async function POST() {
  try {
    const session = await validateRequest();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();

    return new NextResponse(null, {
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (error) {
    console.error("[LOGOUT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
