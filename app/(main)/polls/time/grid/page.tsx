import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TimeSlotGridPage } from "@/components/polls/TimeSlotGridPage";

export default async function TimeSlotGrid() {
  const session = await validateRequest();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <TimeSlotGridPage />;
}
