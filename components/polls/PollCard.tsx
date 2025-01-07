"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface PollCardProps {
  poll: {
    id: string;
    title: string;
    description?: string | null;
    createdAt: Date;
    createdBy: {
      nickname: string;
    };
    yesVotes: number;
    noVotes: number;
  };
  userId: string;
}

export function PollCard({ poll, userId }: PollCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const totalVotes = poll.yesVotes + poll.noVotes;

  const handleVote = async (vote: boolean) => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote }),
      });

      if (!res.ok) throw new Error("Failed to vote");
      window.location.reload();
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-background border border-foreground/10 rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-1">{poll.title}</h3>
        <p className="text-sm text-foreground/60">
          Created by {poll.createdBy.nickname} •{" "}
          {formatDistanceToNow(poll.createdAt)} ago
        </p>
      </div>

      {poll.description && (
        <p className="text-foreground/80 mb-6">{poll.description}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => handleVote(true)}
          disabled={isVoting}
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-foreground/5 disabled:opacity-50"
        >
          <ThumbsUp className="w-5 h-5" />
          <span>{poll.yesVotes}</span>
        </button>

        <button
          onClick={() => handleVote(false)}
          disabled={isVoting}
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-foreground/5 disabled:opacity-50"
        >
          <ThumbsDown className="w-5 h-5" />
          <span>{poll.noVotes}</span>
        </button>

        <div className="text-sm text-foreground/60">
          {totalVotes} total votes
        </div>
      </div>
    </div>
  );
}
