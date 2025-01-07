"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TimeSlot } from "@/lib/types";

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

export function TimeSlotGridPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(false);

  const isSelected = (day: string, hour: string) =>
    selectedSlots.some(
      (slot) => slot.dayOfWeek === day && slot.timeGmt === hour
    );

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSlots([]);
      setIsAllSelected(false);
    } else {
      const allSlots: TimeSlot[] = [];
      DAYS.forEach((day) => {
        HOURS.forEach((hour) => {
          allSlots.push({
            dayOfWeek: day as TimeSlot["dayOfWeek"],
            timeGmt: hour,
          });
        });
      });
      setSelectedSlots(allSlots);
      setIsAllSelected(true);
    }
  };

  const toggleSlot = (day: string, hour: string) => {
    if (isSelected(day, hour)) {
      setSelectedSlots((prev) =>
        prev.filter(
          (slot) => !(slot.dayOfWeek === day && slot.timeGmt === hour)
        )
      );
    } else {
      setSelectedSlots((prev) => [
        ...prev,
        {
          dayOfWeek: day as TimeSlot["dayOfWeek"],
          timeGmt: hour,
        },
      ]);
      setIsAllSelected(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let timeSlots: TimeSlot[];

    if (mode === "include") {
      timeSlots = selectedSlots;
    } else {
      // Generate all possible time slots
      const allSlots: TimeSlot[] = [];
      DAYS.forEach((day) => {
        HOURS.forEach((hour) => {
          allSlots.push({
            dayOfWeek: day as TimeSlot["dayOfWeek"],
            timeGmt: hour,
          });
        });
      });

      // Filter out selected (excluded) slots
      timeSlots = allSlots.filter(
        (slot) =>
          !selectedSlots.some(
            (excluded) =>
              excluded.dayOfWeek === slot.dayOfWeek &&
              excluded.timeGmt === slot.timeGmt
          )
      );

      try {
        const response = await fetch("/api/polls/time", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            timeSlots,
          }),
        });

        if (!response.ok) throw new Error("Failed to create time poll");

        router.push("/polls");
        router.refresh();
      } catch (error) {
        console.error("Failed to create time poll:", error);
      }
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto p-4 md:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Create Time Poll</h1>
          <div className="flex gap-4 p-4 bg-foreground/5 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mode === "include"}
                onChange={() => {
                  setMode("include");
                  setSelectedSlots([]);
                }}
                className="w-4 h-4"
              />
              Include selected slots
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mode === "exclude"}
                onChange={() => {
                  setMode("exclude");
                  setSelectedSlots([]);
                }}
                className="w-4 h-4"
              />
              Exclude selected slots
            </label>
          </div>
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-4 py-2 rounded-md border hover:bg-foreground/5"
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>
          <p className="text-foreground/60 mt-2">
            {mode === "include"
              ? "Click on time slots to include them in the poll. Selected slots will be highlighted in green."
              : "Click on time slots to exclude them from the poll. Selected slots will be highlighted in red."}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 rounded-md border bg-background"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md border bg-background"
              rows={3}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse min-w-[640px]">
            <thead className="bg-foreground/5">
              <tr>
                <th className="p-3 border-b sticky left-0 bg-inherit"></th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="p-3 border-b text-center font-medium"
                  >
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour} className="border-b last:border-b-0">
                  <td className="p-3 font-mono whitespace-nowrap sticky left-0 bg-background border-r">
                    {hour}
                  </td>
                  {DAYS.map((day) => (
                    <td key={`${day}-${hour}`} className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSlot(day, hour)}
                        className={`w-8 h-8 rounded border border-black ${
                          isSelected(day, hour)
                            ? mode === "include"
                              ? "bg-green-500 hover:bg-green-500/30"
                              : "bg-red-500 hover:bg-red-500/30"
                            : "bg-foreground/5 hover:bg-foreground/10"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
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
    </div>
  );
}
