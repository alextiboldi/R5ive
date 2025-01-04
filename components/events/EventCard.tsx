import { formatInTimeZone } from 'date-fns-tz';
import { EventAnnouncement } from '@prisma/client';

interface EventCardProps {
  event: EventAnnouncement & {
    _count: {
      responses: number;
    };
    acceptedCount: number;
  };
  isAdmin?: boolean;
  onEdit?: (event: EventAnnouncement) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({ event, isAdmin, onEdit, onDelete }: EventCardProps) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return (
    <div className="bg-background border border-foreground/10 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(event)}
              className="text-sm px-3 py-1 rounded-md bg-foreground/5 hover:bg-foreground/10"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(event.id)}
              className="text-sm px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      <p className="text-foreground/80 mb-4">{event.description}</p>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-foreground/60">
            {event.dayOfWeek.charAt(0) + event.dayOfWeek.slice(1).toLowerCase()} at {event.timeGmt} GMT
          </p>
        </div>
        
        <div className="text-sm text-foreground/60">
          <p>{event.acceptedCount} attending</p>
          <p>{event._count.responses} total responses</p>
        </div>
      </div>
    </div>
  );
}