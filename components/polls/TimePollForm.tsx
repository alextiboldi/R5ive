"use client";
import { useState } from "react";
import { z } from "zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { Plus, X } from "lucide-react";
import { timePollSchema } from "@/lib/validators";
import type { TimeSlot } from "@/lib/types";
import { TimeSlotGrid } from "./TimeSlotGrid";

type TimePollFormData = z.infer<typeof timePollSchema>;

interface TimePollFormProps {
  initialData?: TimePollFormData;
  onSubmit: (data: TimePollFormData) => void;
  onCancel: () => void;
}

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
const HOURS = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

export function TimePollForm({
  initialData,
  onSubmit,
  onCancel,
}: TimePollFormProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof TimePollFormData, string>>
  >({});
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const [formData, setFormData] = useState<TimePollFormData>(
    initialData || {
      title: "",
      description: "",
      timeSlots: [],
    }
  );
  const [excludedSlots, setExcludedSlots] = useState<TimeSlot[]>([]);

  const addTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { dayOfWeek: "MONDAY", timeGmt: "09:00" }],
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const updateTimeSlot = (
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalTimeSlots: TimeSlot[] = [];

      if (mode === "include") {
        finalTimeSlots = formData.timeSlots;
      } else {
        // Generate all possible time slots
        const allSlots: TimeSlot[] = [];
        DAYS.forEach((day) => {
          HOURS.forEach((hour) => {
            allSlots.push({ dayOfWeek: day, timeGmt: hour });
          });
        });

        // Filter out excluded slots
        finalTimeSlots = allSlots.filter(
          (slot) =>
            !excludedSlots.some(
              (excluded) =>
                excluded.dayOfWeek === slot.dayOfWeek &&
                excluded.timeGmt === slot.timeGmt
            )
        );
      }

      const validatedData = timePollSchema.parse({
        ...formData,
        timeSlots: finalTimeSlots,
      });

      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof TimePollFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label.Root>Time Slots Mode</Label.Root>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "include"}
              onChange={() => setMode("include")}
              className="w-4 h-4"
            />
            Include specific slots
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "exclude"}
              onChange={() => setMode("exclude")}
              className="w-4 h-4"
            />
            Exclude specific slots
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {mode === "include" ? (
          <>
            <div className="flex justify-between items-center">
              <Label.Root>Available Time Slots</Label.Root>
              <button
                type="button"
                onClick={addTimeSlot}
                className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-foreground/5"
              >
                <Plus className="w-4 h-4" />
                Add Available Slot
              </button>
            </div>

            {formData.timeSlots.map((slot, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Select.Root
                  value={slot.dayOfWeek}
                  onValueChange={(value) =>
                    updateTimeSlot(index, "dayOfWeek", value)
                  }
                >
                  <Select.Trigger className="w-full p-2 rounded-md border bg-background text-left">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-background border rounded-md shadow-lg">
                      <Select.Viewport>
                        {DAYS.map((day) => (
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

                <input
                  type="time"
                  value={slot.timeGmt}
                  onChange={(e) =>
                    updateTimeSlot(index, "timeGmt", e.target.value)
                  }
                  className="p-2 rounded-md border bg-background"
                />

                <button
                  type="button"
                  onClick={() => removeTimeSlot(index)}
                  className="p-2 rounded-md hover:bg-foreground/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {errors.timeSlots && (
              <p className="text-red-500 text-sm">{errors.timeSlots}</p>
            )}
          </>
        ) : (
          <>
            <Label.Root>Select Time Slots to Exclude</Label.Root>
            <p className="text-sm text-foreground/60 mb-4">
              Click on the slots you want to exclude from the poll. Excluded
              slots are highlighted in red.
            </p>
            <TimeSlotGrid
              excludedSlots={excludedSlots}
              onChange={setExcludedSlots}
            ></TimeSlotGrid>
          </>
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
          Create Time Poll
        </button>
      </div>
    </form>
  );
}
