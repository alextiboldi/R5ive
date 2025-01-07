"use client";
import { useState } from "react";
import { z } from "zod";
import * as Label from "@radix-ui/react-label";
import { createInviteSchema } from "@/lib/validators";

type CreateInviteFormData = z.infer<typeof createInviteSchema>;

interface CreateInviteFormProps {
  onSuccess: () => void;
}

export function CreateInviteForm({ onSuccess }: CreateInviteFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      adminNickname: formData.get("adminNickname") as string,
    };

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create invitation");

      onSuccess();
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label.Root htmlFor="adminNickname">Admin Nickname</Label.Root>
        <input
          id="adminNickname"
          name="adminNickname"
          required
          className="w-full p-2 rounded-md border bg-background"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Invitation"}
        </button>
      </div>
    </form>
  );
}
