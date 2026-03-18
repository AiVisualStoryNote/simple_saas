"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface RegisteredToastProps {
  registered: string | undefined;
}

export function RegisteredToast({ registered }: RegisteredToastProps) {
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (registered && !hasShown) {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account before signing in.",
      });
      setHasShown(true);
    }
  }, [registered, hasShown]);

  return null;
}
