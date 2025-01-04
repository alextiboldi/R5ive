import { useState } from 'react';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  timeGmt: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [formData, setFormData] = useState<EventFormData>(initialData || {
    title: '',
    description: '',
    dayOfWeek: 'MONDAY',
    timeGmt: '00:00'
  });

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
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 rounded-md border bg-background"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 rounded-md border bg-background"
          rows={3}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Day of Week</label>
        <select
          value={formData.dayOfWeek}
          onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value as EventFormData['dayOfWeek'] })}
          className="w-full p-2 rounded-md border bg-background"
        >
          {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
            <option key={day} value={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Time (GMT)</label>
        <input
          type="time"
          value={formData.timeGmt}
          onChange={(e) => setFormData({ ...formData, timeGmt: e.target.value })}
          className="w-full p-2 rounded-md border bg-background"
        />
        {errors.timeGmt && <p className="text-red-500 text-sm mt-1">{errors.timeGmt}</p>}
      </div>

      <div className="flex justify-end gap-2">
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
          Save
        </button>
      </div>
    </form>
  );
}