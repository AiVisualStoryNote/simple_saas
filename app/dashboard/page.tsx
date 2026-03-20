import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCustomerData } from "@/lib/customer";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

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
    <DashboardClient 
      credits={credits}
      recentCreditsHistory={recentCreditsHistory}
      subscription={subscription}
      user={user}
    />
  );
}
