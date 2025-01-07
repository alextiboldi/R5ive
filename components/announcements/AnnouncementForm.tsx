import { useState } from "react";
import { z } from "zod";
import * as Label from "@radix-ui/react-label";
import { announcementSchema } from "@/lib/validators";

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  initialData?: AnnouncementFormData;
  onSubmit: (data: AnnouncementFormData) => void;
  onCancel: () => void;
}

export function AnnouncementForm({
  initialData,
  onSubmit,
  onCancel,
}: AnnouncementFormProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof AnnouncementFormData, string>>
  >({});
  const [formData, setFormData] = useState<AnnouncementFormData>(
    initialData || {
      title: "",
      description: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = announcementSchema.parse(formData);
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof AnnouncementFormData] =
              err.message;
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
        <Label.Root htmlFor="description">Description</Label.Root>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-2 rounded-md border bg-background"
          rows={6}
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
          {initialData ? "Update" : "Create"} Announcement
        </button>
      </div>
    </form>
  );
}
