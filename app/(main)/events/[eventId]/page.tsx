import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { convertTimeToUserTimezone } from "@/lib/utils";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await validateRequest();
  if (!session) return notFound();

  const event = await db.eventAnnouncement.findUnique({
    where: { id: params.eventId },
    include: {
      responses: {
        include: {
          user: {
            select: {
              nickname: true,
              timezone: true,
            },
          },
        },
      },
    },
  });
  if (!event) return notFound();
  const options = {
    time: event?.timeGmt, // 2:30 PM
    serverTimezone: "Europe/London",
    userTimezone: session?.user?.timezone,
  };
  const userTime = convertTimeToUserTimezone({
    ...options,
    userTimezone: options.userTimezone || "UTC",
  }).userTime;

  if (!event) return notFound();

  // Get all users to show who hasn't responded
  const allUsers = await db.user.findMany({
    select: {
      id: true,
      nickname: true,
      timezone: true,
    },
  });

  const respondedUserIds = new Set(event.responses.map((r) => r.userId));
  const noResponseUsers = allUsers.filter(
    (user) => !respondedUserIds.has(user.id)
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="text-foreground/60 mb-6">
        {event.dayOfWeek.charAt(0) + event.dayOfWeek.slice(1).toLowerCase()} at{" "}
        {userTime}
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Accepted */}
        <div>
          <h2 className="font-semibold mb-3 text-green-500">Accepted</h2>
          <ul className="space-y-2">
            {event.responses
              .filter((r) => r.response === "ACCEPT")
              .map((response) => (
                <li key={response.userId} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-sm text-green-500">
                      {response.user.nickname[0].toUpperCase()}
                    </span>
                  </div>
                  <span>{response.user.nickname}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Declined */}
        <div>
          <h2 className="font-semibold mb-3 text-red-500">Declined</h2>
          <ul className="space-y-2">
            {event.responses
              .filter((r) => r.response === "DECLINE")
              .map((response) => (
                <li key={response.userId} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <span className="text-sm text-red-500">
                      {response.user.nickname[0].toUpperCase()}
                    </span>
                  </div>
                  <span>{response.user.nickname}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* No Response */}
        <div>
          <h2 className="font-semibold mb-3 text-foreground/60">No Response</h2>
          <ul className="space-y-2">
            {noResponseUsers.map((user) => (
              <li key={user.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-sm">
                    {user.nickname[0].toUpperCase()}
                  </span>
                </div>
                <span>{user.nickname}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
