"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/lib/validators";
import { rawTimeZones } from "@vvo/tzdb";
import * as Select from "@radix-ui/react-select";
import Link from "next/link";

interface Option {
  value: string;
  label: string;
}

interface SignUpFormProps {
  token?: string;
}
export function SignUpForm({ token }: SignUpFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTimezone, setCurrentTimezone] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    // Prepare timezone options
    const tzOptions: Option[] = rawTimeZones.map((tz) => ({
      value: tz.name,
      label: `${tz.name} - UTC${tz.rawOffsetInMinutes / 60}`,
    }));

    // Add "Current Location" as the first option
    setOptions([
      {
        value: "current-location",
        label: "🌍 Current Location (Detect Automatically)",
      },
      ...tzOptions,
    ]);

    // Detect current timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(detectedTimezone);
  }, []);

  const handleTimezoneChange = (value: string) => {
    if (value === "current-location") {
      setSelectedTimezone(currentTimezone);
    } else {
      setSelectedTimezone(value);
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      nickname: formData.get("nickname") as string,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      token: formData.get("token") as string,
    };

    try {
      // signUpSchema.parse(data);

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
      router.push("/events");
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
        <label htmlFor="nickname" className="block text-sm font-medium mb-1">
          Timezone
        </label>
        {/* <input
          id="timezone"
          name="timezone"
          type="text"
          required
          className="w-full p-2 rounded-md border bg-background"
          value={currentTimezone ?? ""}
        /> */}

        <Select.Root onValueChange={handleTimezoneChange}>
          <Select.Trigger
            id="timezone-selector"
            className="w-full px-4 py-2 text-left bg-white border rounded shadow focus:ring focus:outline-none"
          >
            <Select.Value placeholder="Search for your timezone..." />
            <Select.Icon className="ml-auto">▼</Select.Icon>
          </Select.Trigger>
          <Select.Content className="bg-white border rounded shadow-lg">
            <Select.ScrollUpButton className="flex items-center justify-center py-2">
              ▲
            </Select.ScrollUpButton>
            <Select.Viewport>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center py-2">
              ▼
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Root>

        {currentTimezone && (
          <p className="mt-2 text-sm text-gray-600">
            Detected current location timezone:{" "}
            <strong>{currentTimezone}</strong>
          </p>
        )}
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
          defaultValue={token}
          className="w-full p-2 rounded-md border bg-background"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Create Account"}
      </button>
      <p>
        Already have an account? <Link href={"/signin"}>Login here</Link>
      </p>
    </form>
  );
}
