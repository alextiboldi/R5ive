"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { EditAnnouncementDialog } from "./EditAnnouncementDialog";

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    createdBy: {
      nickname: string;
    };
  };
  isAdmin?: boolean;
}

export function AnnouncementCard({
  announcement,
  isAdmin,
}: AnnouncementCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/announcements/${announcement.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-background border border-foreground/10 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{announcement.title}</h3>
          <p className="text-sm text-foreground/60">
            Posted by {announcement.createdBy.nickname} •{" "}
            {formatDistanceToNow(announcement.createdAt)} ago
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <EditAnnouncementDialog announcement={announcement} />
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-foreground/80 whitespace-pre-wrap">
        {announcement.description}
      </p>
    </div>
  );
}
