import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnnouncementForm } from "./AnnouncementForm";

interface EditAnnouncementDialogProps {
  announcement: {
    id: string;
    title: string;
    description: string;
  };
}

export function EditAnnouncementDialog({
  announcement,
}: EditAnnouncementDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: { title: string; description: string }) => {
    try {
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update announcement");

      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update announcement:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-sm px-3 py-1 rounded-md bg-foreground/5 hover:bg-foreground/10">
          Edit
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
        </DialogHeader>
        <AnnouncementForm
          initialData={announcement}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
