import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import * as Avatar from "@radix-ui/react-avatar";

export default async function UsersPage() {
  const session = await validateRequest();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await db.user.findMany({
    include: {
      UserSession: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          device: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Players</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Avatar</th>
              <th className="text-left p-4">Nickname</th>
              <th className="text-left p-4">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const lastSession = user.UserSession[0];
              return (
                <tr key={user.id} className="border-b">
                  <td className="p-4">
                    <Avatar.Root className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100">
                      <Avatar.Image
                        className="h-full w-full object-cover"
                        src="/api/placeholder/40/40"
                        alt="User avatar"
                      />
                      <Avatar.Fallback className="text-gray-500 text-sm font-medium">
                        {user.nickname}
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </td>
                  <td className="p-4">{user.nickname}</td>

                  <td className="p-4">
                    {lastSession ? (
                      <span title={lastSession.createdAt.toLocaleString()}>
                        {formatDistanceToNow(lastSession.createdAt)} ago
                      </span>
                    ) : (
                      "Never"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
