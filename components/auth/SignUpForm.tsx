import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/lib/validators";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      nickname: formData.get("nickname") as string,
      name: formData.get("name") as string,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      token: formData.get("token") as string,
    };

    try {
      signUpSchema.parse(data);
      
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to create account");
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full p-2 rounded-md border bg-background"
        />
      </div>

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium mb-1">
          Nickname
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          required
          className="w-full p-2 rounded-md border bg-background"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full p-2 rounded-md border bg-background"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full p-2 rounded-md border bg-background"
        />
      </div>
      
      <div>
        <label htmlFor="token" className="block text-sm font-medium mb-1">
          Invitation Token
        </label>
        <input
          id="token"
          name="token"
          type="text"
          required
          className="w-full p-2 rounded-md border bg-background"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Create Account"}
      </button>
    </form>
  );
}