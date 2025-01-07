"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateInviteForm } from "./CreateInviteForm";

export function CreateInviteDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90">
          Create Invitation
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Invitation</DialogTitle>
        </DialogHeader>
        <CreateInviteForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
