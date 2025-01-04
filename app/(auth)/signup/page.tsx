import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
      <SignUpForm />
    </div>
  );
}