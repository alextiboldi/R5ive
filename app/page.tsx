import { UserMenu } from "@/components/nav/UserMenu";
import { validateRequest } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const { session } = await validateRequest();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold">R5ive</div>
        {session ? (
          <div className="flex items-center gap-4">
            <Link
              href="/events"
              className="rounded-full bg-foreground text-background px-6 py-2 hover:opacity-90 transition-opacity"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-foreground text-background px-6 py-2 hover:opacity-90 transition-opacity"
          >
            Login
          </Link>
        )}
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          R5ive: Empower Your Alliance Leadership
        </h1>
        <p className="text-lg mb-12 text-foreground/80">
          Streamline event management and elevate your alliance to the next
          level.
        </p>

        {/* Feature Section */}
        <div className="mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Lead with Confidence
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            R5ive is the ultimate tool for alliance leaders to plan, organize,
            and execute events seamlessly. Whether you're coordinating battles,
            rallies, or strategy meetings, R5ive has you covered.
          </p>
        </div>
      </main>
    </div>
  );
}
