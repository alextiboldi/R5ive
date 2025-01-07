import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { validateRequest } from "@/lib/auth";
import { headers } from "next/headers";
export default async function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <LoginForm />
    </div>
  );
}
