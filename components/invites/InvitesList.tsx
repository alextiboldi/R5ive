"use client";
import { formatDistanceToNow } from "date-fns";

interface InvitesListProps {
  invites: Array<{
    id: string;
    token: string;
    adminNickname: string;
    userNickname: string | null;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
    user: {
      nickname: string | null;
      email: string | null;
    } | null;
  }>;
}

async function copyToClipboard(token: string) {
  try {
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/signup?token=${token}`;
    await navigator.clipboard.writeText(link);
    alert("Invitation link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

export function InvitesList({ invites }: InvitesListProps) {
  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="bg-background border border-foreground/10 rounded-lg p-6 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-foreground/60">
                Created for {invite.adminNickname} •{" "}
                {formatDistanceToNow(invite.createdAt)} ago
              </p>
              <p className="text-sm text-foreground/60">
                Expires {formatDistanceToNow(invite.expiresAt)} from now
              </p>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-sm ${
                invite.used
                  ? "bg-green-500/10 text-green-500"
                  : "bg-foreground/10"
              }`}
            >
              {invite.used ? "Used" : "Pending"}
            </div>
          </div>

          {invite.used && invite.user && (
            <div className="mt-4 p-4 bg-foreground/5 rounded-lg">
              <h4 className="font-medium mb-2">Registered User</h4>
              <p className="text-sm">Nickname: {invite.user.nickname}</p>
              <p className="text-sm">Email: {invite.user.email}</p>
            </div>
          )}

          {!invite.used && (
            <div className="mt-4">
              <button
                onClick={() => copyToClipboard(invite.token)}
                className="text-sm px-3 py-1.5 rounded-md bg-foreground/5 hover:bg-foreground/10"
              >
                Copy Invitation Link
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
