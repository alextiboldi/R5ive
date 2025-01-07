import { Lucia, TimeSpan } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "@/lib/db";
import { User as DatabaseUser } from "@prisma/client";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  getSessionAttributes: (/* attributes */) => {
    return {};
  },
  getUserAttributes: (attributes) => {
    return {
      nickname: attributes.nickname,
      email: attributes.email,
      name: attributes.name,
      role: attributes.role,
      timezone: attributes.timezone,
    };
  },
  sessionExpiresIn: new TimeSpan(30, "d"),
  sessionCookie: {
    name: "session",

    expires: false, // session cookies have very long lifespan (2 years)
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    // DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
interface DatabaseSessionAttributes {}
interface DatabaseUserAttributes {
  nickname: string;
  email: string;
  name: string;
  role: string;
  timezone: string;
}
