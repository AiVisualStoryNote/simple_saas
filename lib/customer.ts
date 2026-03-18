import { createClient } from "@/utils/supabase/server";

export async function getCustomerData() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: customerData, error } = await supabase
    .from("customers")
    .select(
      `
      *,
      subscriptions (
        status,
        current_period_end,
        creem_product_id
      ),
      credits_history (
        amount,
        type,
        created_at
      )
    `
    )
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching customer data:", error);
    return null;
  }

  const subscription = customerData?.subscriptions?.[0];
  const creditsHistory = customerData?.credits_history?.slice(0, 10) || [];

  return {
    customer: customerData,
    subscription: subscription || null,
    creditsHistory,
  };
}
