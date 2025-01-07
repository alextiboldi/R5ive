import { db } from "@/lib/db";
import { CreateAnnouncementDialog } from "@/components/announcements/CreateAnnouncementDialog";
import { AnnouncementCard } from "@/components/announcements/AnnoucementCard";
import { validateRequest } from "@/lib/auth";

export default async function AnnouncementsPage() {
  const session = await validateRequest();
  const isAdmin = session?.user?.role === "ADMIN";

  const announcements = await db.announcement.findMany({
    include: {
      createdBy: {
        select: {
          nickname: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Announcements</h1>
        {isAdmin && <CreateAnnouncementDialog />}
      </div>

      <div className="space-y-6">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}
