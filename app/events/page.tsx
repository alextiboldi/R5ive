import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EventCard } from "@/components/events/EventCard";
import { EventForm } from "@/components/events/EventForm";

export default async function EventsPage() {
  const session = await auth();
  const isAdmin = session?.user.role === 'ADMIN';

  const events = await db.eventAnnouncement.findMany({
    include: {
      _count: {
        select: { responses: true }
      },
      responses: {
        where: {
          response: 'ACCEPT'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const eventsWithCounts = events.map(event => ({
    ...event,
    acceptedCount: event.responses.length
  }));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Events</h1>
        {isAdmin && (
          <button
            className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90"
          >
            Create Event
          </button>
        )}
      </div>

      <div className="space-y-4">
        {eventsWithCounts.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}