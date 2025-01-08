import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { InvitesList } from "@/components/invites/InvitesList";
import { CreateInviteDialog } from "@/components/invites/CreateInviteDialog";

export default async function InvitesPage() {
  const session = await validateRequest();
  if (!session?.user) redirect("/");

  const isAdmin = session?.user?.role === "ADMIN";

  const invites = await db.invitationToken.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          nickname: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Invitations</h1>
        {isAdmin && <CreateInviteDialog />}
      </div>

      <InvitesList invites={invites} />
    </div>
  );
}
