import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { cache } from "react";
import * as context from "next/headers";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      email: attributes.email,
      name: attributes.name,
      role: attributes.role
    };
  }
});

export const auth = cache(() => {
  const authRequest = new lucia.AuthRequest(cookies(), context);
  return authRequest.validate();
});