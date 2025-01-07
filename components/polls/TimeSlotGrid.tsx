import { useState } from "react";
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

interface TimeSlotGridProps {
  excludedSlots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

export function TimeSlotGrid({ excludedSlots, onChange }: TimeSlotGridProps) {
  const isExcluded = (day: string, hour: string) =>
    excludedSlots.some(
      (slot) => slot.dayOfWeek === day && slot.timeGmt === hour
    );

  const toggleSlot = (day: string, hour: string) => {
    if (isExcluded(day, hour)) {
      onChange(
        excludedSlots.filter(
          (slot) => !(slot.dayOfWeek === day && slot.timeGmt === hour)
        )
      );
    } else {
      onChange([
        ...excludedSlots,
        { dayOfWeek: day as TimeSlot["dayOfWeek"], timeGmt: hour },
      ]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b"></th>
            {DAYS.map((day) => (
              <th key={day} className="p-2 border-b text-center">
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour} className="border-b last:border-b-0">
              <td className="p-2 font-mono whitespace-nowrap">{hour}</td>
              {DAYS.map((day) => (
                <td key={`${day}-${hour}`} className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => toggleSlot(day, hour)}
                    className={`w-6 h-6 rounded ${
                      isExcluded(day, hour)
                        ? "bg-red-500/20 hover:bg-red-500/30"
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
  );
}
