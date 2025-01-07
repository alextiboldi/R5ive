"use client";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { EventAnnouncement, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { convertTimeToUserTimezone } from "@/lib/utils";
import { Button } from "../ui/button";

interface EventCardProps {
  event: EventAnnouncement & {
    userResponded: boolean;
    acceptedCount: number;
  };
  user: User;
  isAdmin?: boolean;
  numberOfPlayers: number;
  onEdit?: (event: EventAnnouncement) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({
  event,
  user,
  isAdmin,
  numberOfPlayers,
  onEdit,
  onDelete,
}: EventCardProps) {
  //Europe/London

  const [userTime, setUserTime] = useState<string | null>(null);
  const [userResponded, setUserResponded] = useState<boolean>(false);

  useEffect(() => {
    const userLocale = navigator.language;
    const options = {
      time: event.timeGmt, // 2:30 PM
      serverTimezone: "Europe/London",
      userTimezone: user.timezone,
    };
    console.log("Locale", userLocale);
    setUserResponded(event.userResponded);
    setUserTime(convertTimeToUserTimezone(options).userTime);
  }, []);

  const handleEventResponse = (
    e: React.MouseEvent<HTMLButtonElement>,
    response: "accept" | "decline"
  ) => {
    e.preventDefault();
    console.log(response);
  };

  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-background border border-foreground/10 rounded-lg p-6 shadow-sm hover:border-foreground/20 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit?.(event);
              }}
              className="text-sm px-3 py-1 rounded-md bg-foreground/5 hover:bg-foreground/10"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete?.(event.id);
              }}
              className="text-sm px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-foreground/80 mb-4">{event.description}</p>

      <div className="flex flex-col items-center">
        <div>
          <p className="text-2xl text-foreground/60">
            {event.dayOfWeek.charAt(0) + event.dayOfWeek.slice(1).toLowerCase()}{" "}
            at {userTime}
          </p>
        </div>

        <div className="text-sm text-foreground/60">
          <p>
            {event.acceptedCount} out of {numberOfPlayers} attending
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <Button
            variant="default"
            className={event.userResponded ? "bg-green-400" : "bg-green-100"}
            onClick={(e) => handleEventResponse(e, "accept")}
          >
            Attend
          </Button>
          <Button
            variant={"destructive"}
            className={userResponded ? "bg-red-400" : "bg-red-100"}
            onClick={(e) => handleEventResponse(e, "decline")}
          >
            Decline
          </Button>
        </div>
      </div>
    </Link>
  );
}
