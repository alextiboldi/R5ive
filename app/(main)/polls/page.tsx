import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreatePollDialog } from "@/components/polls/CreatePollDialog";
import { CreateTimePollDialog } from "@/components/polls/CreateTimePollDialog";
import { PollCard } from "@/components/polls/PollCard";
import { TimePollCard } from "@/components/polls/TimePollCard";

export default async function PollsPage() {
  const session = await validateRequest();
  if (!session.user) return null;

  const isAdmin = session.user.role === "ADMIN";

  const polls = await db.poll.findMany({
    include: {
      createdBy: {
        select: {
          nickname: true,
        },
      },
      votes: true,
      timeSlots: {
        include: {
          responses: {
            include: {
              user: {
                select: {
                  nickname: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pollsWithStats = polls.map((poll) => ({
    ...poll,
    yesVotes: poll.votes.filter((v) => v.vote).length,
    noVotes: poll.votes.filter((v) => !v.vote).length,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Polls</h1>
        {isAdmin && (
          <div className="flex gap-2">
            <CreatePollDialog />
            <CreateTimePollDialog />
          </div>
        )}
      </div>

      <div className="space-y-6">
        {pollsWithStats.map((poll) =>
          poll.type === "TIME" ? (
            <TimePollCard
              key={poll.id}
              poll={poll}
              currentUserId={session.user.id}
            />
          ) : (
            <PollCard key={poll.id} poll={poll} userId={session.user.id} />
          )
        )}
      </div>
    </div>
  );
}
