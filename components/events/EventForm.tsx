import { useState } from "react";
import { z } from "zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  timeGmt: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof EventFormData, string>>
  >({});
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: "",
      description: "",
      dayOfWeek: "MONDAY",
      timeGmt: "00:00",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = eventSchema.parse(formData);
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof EventFormData] = err.message;
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
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label.Root>Day of Week</Label.Root>
        <Select.Root
          value={formData.dayOfWeek}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              dayOfWeek: value as EventFormData["dayOfWeek"],
            })
          }
        >
          <Select.Trigger className="w-full p-2 rounded-md border bg-background text-left">
            <Select.Value />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-background border rounded-md shadow-lg">
              <Select.Viewport>
                {[
                  "MONDAY",
                  "TUESDAY",
                  "WEDNESDAY",
                  "THURSDAY",
                  "FRIDAY",
                  "SATURDAY",
                  "SUNDAY",
                ].map((day) => (
                  <Select.Item
                    key={day}
                    value={day}
                    className="p-2 outline-none cursor-pointer hover:bg-foreground/5"
                  >
                    <Select.ItemText>
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className="space-y-2">
        <Label.Root htmlFor="timeGmt">Time (GMT)</Label.Root>
        <input
          id="timeGmt"
          type="time"
          value={formData.timeGmt}
          onChange={(e) =>
            setFormData({ ...formData, timeGmt: e.target.value })
          }
          className="w-full p-2 rounded-md border bg-background"
        />
        {errors.timeGmt && (
          <p className="text-red-500 text-sm">{errors.timeGmt}</p>
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
          Create Event
        </button>
      </div>
    </form>
  );
}
