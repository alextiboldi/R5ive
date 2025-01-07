"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";

interface TimePollCardProps {
  poll: {
    id: string;
    title: string;
    description?: string | null;
    createdAt: Date;
    createdBy: {
      nickname: string;
    };
    timeSlots: Array<{
      id: string;
      dayOfWeek: string;
      timeGmt: string;
      responses: Array<{
        userId: string;
        available: boolean;
        user: {
          nickname: string;
        };
      }>;
    }>;
  };
  currentUserId: string;
}

export function TimePollCard({ poll, currentUserId }: TimePollCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selections, setSelections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    poll.timeSlots.forEach((slot) => {
      const userResponse = slot.responses.find(
        (r) => r.userId === currentUserId
      );
      initial[slot.id] = userResponse?.available || false;
    });
    return initial;
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      //only allow responses where the user is available
      const responses = Object.entries(selections)
        .filter(([, available]) => available)
        .map(([timeSlotId, available]) => ({
          timeSlotId,
          available,
        }));

      const res = await fetch(`/api/polls/time/${poll.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responses),
      });

      if (!res.ok) throw new Error("Failed to submit responses");
      window.location.reload();
    } catch (error) {
      console.error("Failed to submit responses:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniqueParticipants = Array.from(
    new Set(
      poll.timeSlots.flatMap((slot) =>
        slot.responses.map((r) => r.user.nickname)
      )
    )
  ).sort();

  return (
    <div className="bg-background border border-foreground/10 rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">{poll.title}</h3>
        <p className="text-sm text-foreground/60">
          Created by {poll.createdBy.nickname} •{" "}
          {formatDistanceToNow(poll.createdAt)} ago
        </p>
        {poll.description && (
          <p className="mt-2 text-foreground/80">{poll.description}</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b">Participant</th>
              {poll.timeSlots.map((slot) => (
                <th
                  key={slot.id}
                  className="p-2 border-b text-center whitespace-nowrap"
                >
                  {slot.dayOfWeek.charAt(0) +
                    slot.dayOfWeek.slice(1).toLowerCase()}
                  <br />
                  {slot.timeGmt} GMT
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueParticipants.map((nickname) => (
              <tr key={nickname} className="border-b last:border-b-0">
                <td className="p-2">{nickname}</td>
                {poll.timeSlots.map((slot) => {
                  const response = slot.responses.find(
                    (r) => r.user.nickname === nickname
                  );
                  return (
                    <td key={slot.id} className="p-2 text-center">
                      {response?.available && (
                        <Check className="w-4 h-4 mx-auto text-green-500" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t">
              <td className="p-2 font-medium">Your Response</td>
              {poll.timeSlots.map((slot) => (
                <td key={slot.id} className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selections[slot.id]}
                    onChange={(e) =>
                      setSelections((prev) => ({
                        ...prev,
                        [slot.id]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Response"}
        </button>
      </div>
    </div>
  );
}
