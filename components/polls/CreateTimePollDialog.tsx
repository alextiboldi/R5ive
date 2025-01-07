"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TimePollForm } from "./TimePollForm";
import type { TimeSlot } from "@/lib/types";
import { useRouter } from "next/navigation";

export function CreateTimePollDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setOpen(false);
    router.push("/polls/time/grid");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90">
          Create Advanced Time Poll
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Advanced Time Poll</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>The advanced time poll creator allows you to:</p>
          <ul className="list-disc pl-4 space-y-2">
            <li>View all possible time slots in a grid layout</li>
            <li>Quickly exclude multiple time slots</li>
            <li>Better overview of available times</li>
          </ul>
          <div className="flex justify-end">
            <button
              onClick={handleClick}
              className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90"
            >
              Continue to Grid View
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
