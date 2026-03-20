"use client";

import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResetPasswordProps {
  searchParams: Message;
}

export default function ResetPassword({ searchParams }: ResetPasswordProps) {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] py-10">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>
      <form className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">New password</Label>
          <Input
            type="password"
            name="password"
            placeholder="New password"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
          />
        </div>
        <div className="w-full flex gap-2">
          <Button className="flex-1" variant="outline" onClick={() => router.back()}>
            <Undo2 className="h-4 w-4 mr-1" />
            Back
          </Button>
          <SubmitButton className="flex-1" formAction={resetPasswordAction}>
            Reset password
          </SubmitButton>
        </div>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
