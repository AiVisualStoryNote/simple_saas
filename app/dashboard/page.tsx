import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionStatusCard } from "@/components/dashboard/subscription-status-card";
import { CreditsBalanceCard } from "@/components/dashboard/credits-balance-card";
import { getCustomerData } from "@/lib/customer";
import { KeyRound } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const customerData = await getCustomerData();

  if (!customerData) {
    return redirect("/sign-in");
  }

  const { customer, subscription, creditsHistory } = customerData;
  const credits = customer?.credits || 0;
  const recentCreditsHistory = creditsHistory?.slice(0, 2) || [];

  return (
    <div className="flex-1 w-full flex flex-col gap-6 sm:gap-8 px-4 sm:px-8 container">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border rounded-lg p-6 sm:p-8 mt-6 sm:mt-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
          Welcome back, {user.user_metadata?.name || user.email?.split("@")[0]}
        </h1>
        <p className="text-white/70"><span>Email: {user.email}</span></p>
        <p className="text-muted-foreground">
          Manage your subscription, check your credits, and access your dashboard features.
        </p>
        <div className="mt-4">
          <Link 
            href="/dashboard/reset-password"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary dark:text-white hover:text-primary/80 underline underline-offset-4 transition-colors"
          >
            <KeyRound className="scale-[0.7]" />
            Change Password
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Card */}
        <CreditsBalanceCard credits={credits} recentHistory={recentCreditsHistory} />
        
        {/* Subscription Status */}
        <SubscriptionStatusCard subscription={subscription} />

      </div>

      {/* Placeholder for New Business Logic */}
      <div className="border border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20">

      </div>
    </div>
  );
}
