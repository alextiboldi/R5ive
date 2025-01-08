import Navbar from "@/components/nav/NavBar";
import { UserMenu } from "@/components/nav/UserMenu";
import { validateRequest } from "@/lib/auth";
import { SessionProvider } from "@/providers/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  if (!session.user && !session.session) redirect("/");
  return (
    <SessionProvider value={session}>
      <div className="flex flex-col w-full h-full ">
        <Navbar user={session.user} />
        {children}
      </div>
    </SessionProvider>
  );
}
