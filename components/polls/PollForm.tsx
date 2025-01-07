import { useState } from "react";
import { z } from "zod";
import * as Label from "@radix-ui/react-label";
import { pollSchema } from "@/lib/validators";

type PollFormData = z.infer<typeof pollSchema>;

interface PollFormProps {
  initialData?: PollFormData;
  onSubmit: (data: PollFormData) => void;
  onCancel: () => void;
}

export function PollForm({ initialData, onSubmit, onCancel }: PollFormProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof PollFormData, string>>
  >({});
  const [formData, setFormData] = useState<PollFormData>(
    initialData || {
      title: "",
      description: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = pollSchema.parse(formData);
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof PollFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label.Root htmlFor="title">Title</Label.Root>
        <input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 rounded-md border bg-background"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label.Root htmlFor="description">Description (Optional)</Label.Root>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 rounded-md border bg-background"
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border hover:bg-foreground/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90"
        >
          Create Poll
        </button>
      </div>
    </form>
  );
}
