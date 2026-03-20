import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/sign-up-form";

export default async function SignUp(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return <SignUpForm searchParams={searchParams} />;
}
