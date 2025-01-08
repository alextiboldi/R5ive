import { db } from "@/lib/db";
import { EventCard } from "@/components/events/EventCard";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { validateRequest } from "@/lib/auth";
import { EventAnnouncement, ResponseType } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { trackUserSession } from "@/lib/tracking";

export interface EventWithResponse extends EventAnnouncement {
  userResponded: boolean;
  userResponse?: string;
}

export default async function EventsPage() {
  const session = await validateRequest();

  if (!session?.user) redirect("/");

  const isAdmin = session?.user?.role === "ADMIN";
  const headersList = await headers();

  const user = await db.user.findUnique({
    where: { email: session?.user?.email },
  });

  await trackUserSession({
    userId: user?.id || "unknown",
    userAgent: headersList.get("user-agent") || "unknown",
    ipAddress: headersList.get("x-forwarded-for")?.split(",")[0] || "unknown",
    language: headersList.get("accept-language") || "unknown",
  });

  const events = await db.eventAnnouncement.findMany({
    include: {
      responses: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalUsers = await db.user.count();

  //get the total number of users who have responded ACCEPTED
  const totalAccepted = events.reduce((acc, event) => {
    const acceptedCount = event.responses.filter(
      (response) => response.response === ResponseType.ACCEPTED
    ).length;

    return acc + acceptedCount;
  }, 0);

  const totalDeclined = events.reduce((acc, event) => {
    const acceptedCount = event.responses.filter(
      (response) => response.response === ResponseType.DECLINED
    ).length;

    return acc + acceptedCount;
  }, 0);

  //for each event add the boolean if the user has responded
  const eventsWithResponse = events.map((event) => {
    const userResponded = event.responses.some(
      (response) => response.userId === session?.user?.id
    );
    return { ...event, userResponded };
  });

  const eventsWithCounts = eventsWithResponse.map((event) => ({
    ...event,
    acceptedCount: event.responses.length,
  }));

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Events</h1>
        {isAdmin && <CreateEventDialog />}
      </div>

      <div className="flex lg:flex-row flex-col mx-10 gap-4">
        {eventsWithCounts.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin={isAdmin}
            user={session.user}
            numberOfPlayers={totalUsers}
          />
        ))}
      </div>
    </div>
  );
}
