"use client";

import { useState } from "react";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { TermsDialog } from "@/components/terms-dialog";

interface SignUpFormProps {
  searchParams: Message;
}

export function SignUpForm({ searchParams }: SignUpFormProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service to create an account.");
      return;
    }
    
    setError("");
    
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    
    await signUpAction(formData);
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Sign up to access global authentication and payment solutions
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex items-start gap-2">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (e.target.checked) setError("");
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-muted-foreground leading-5">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTermsDialog(true)}
                className="text-primary hover:underline"
              >
                Terms of Service
              </button>
            </label>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
              {error}
            </div>
          )}

          <SubmitButton
            className="w-full"
            pendingText="Creating account..."
          >
            Create account
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
        <div className="text-sm text-muted-foreground text-center mb-4">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary underline underline-offset-4 hover:text-primary/90"
          >
            Sign in
          </Link>
        </div>
      </div>

      <TermsDialog open={showTermsDialog} onOpenChange={setShowTermsDialog} />
    </>
  );
}
