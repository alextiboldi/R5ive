"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from ".";
import { validateRequest } from "./auth";

export async function logout(): Promise<{ error: string } | void> {
  console.log("LOGOUT CALLED");
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: "No session found",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  console.log("Redirecting to /");
  return redirect("/");
}
