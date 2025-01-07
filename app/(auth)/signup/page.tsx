import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { validateRequest } from "@/lib/auth";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const session = await validateRequest();
  if (session.user) redirect("/");

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
      <SignUpForm token={searchParams.token} />
    </div>
  );
}
