"use client";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import {
  EventAnnouncement,
  EventResponse,
  ResponseType,
  User,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { convertTimeToUserTimezone } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: EventAnnouncement & {
    responses: EventResponse[];
    userResponded: boolean;
    acceptedCount: number;
  };
  user: User;
  isAdmin?: boolean;
  numberOfPlayers: number;
  onEdit?: (event: EventAnnouncement) => void;
}

export function EventCard({
  event,
  user,
  isAdmin,
  numberOfPlayers,
  onEdit,
}: EventCardProps) {
  //Europe/London
  const router = useRouter();
  const [userTime, setUserTime] = useState<string | null>(null);
  const [userResponded, setUserResponded] = useState<boolean>(false);
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const options = {
      time: event.timeGmt, // 2:30 PM
      serverTimezone: "Europe/London",
      userTimezone: user.timezone,
    };

    //check in event.responses if the user has responded
    const userResponse = event.responses.find(
      (response) => response.userId === user.id
    );
    if (userResponse) {
      setUserResponded(true);
      setUserResponse(userResponse.response);
    }

    setUserTime(convertTimeToUserTimezone(options).userTime);
  }, []);

  const handleEventResponse = async (
    e: React.MouseEvent<HTMLButtonElement>,
    response: "ACCEPTED" | "DECLINED"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/events/${event.id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });

      if (!res.ok) throw new Error("Failed to submit response");
      setUserResponded(true);
      setUserResponse(response);
      router.refresh();
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete event");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-background border border-foreground/10 rounded-lg p-6 shadow-sm hover:border-foreground/20 transition-colors"
    >
      <div className="flex justify-between items-start mb-4 ">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        {isAdmin && (
          <div className="flex gap-2">
            {/* <button
              onClick={(e) => {
                e.preventDefault();
                onEdit?.(event);
              }}
              className="text-sm px-3 py-1 rounded-md bg-foreground/5 hover:bg-foreground/10"
            >
              Edit
            </button> */}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete(event.id);
              }}
              className="text-sm px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-foreground/80 mb-4">{event.description}</p>

      <div className="flex flex-col items-center ">
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
            className={
              userResponded && userResponse === ResponseType.ACCEPTED
                ? "bg-green-400"
                : "bg-green-100"
            }
            onClick={(e) => handleEventResponse(e, ResponseType.ACCEPTED)}
          >
            Attend
          </Button>
          <Button
            variant={"destructive"}
            className={
              userResponded && userResponse === ResponseType.DECLINED
                ? "bg-red-400"
                : "bg-red-100"
            }
            onClick={(e) => handleEventResponse(e, ResponseType.DECLINED)}
          >
            Decline
          </Button>
        </div>
      </div>
    </Link>
  );
}
