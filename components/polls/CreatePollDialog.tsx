"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PollForm } from "./PollForm";

export function CreatePollDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create poll");

      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create poll:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90">
          Create Poll
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Poll</DialogTitle>
        </DialogHeader>
        <PollForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
