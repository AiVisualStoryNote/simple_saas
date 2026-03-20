import { createClient } from "@/utils/supabase/client";

export interface UserBook {
  id: string;
  user_id: string;
  novel_id: number;
  credits_spent: number;
  purchased_at: string;
  metadata: Record<string, any>;
}

export interface Customer {
  id: string;
  user_id: string;
  credits: number;
  email: string;
}

export async function checkUserBookPurchase(novelId: number): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('user_books')
    .select('id')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .maybeSingle();

  if (error) {
    console.error('Error checking book purchase:', error);
    return false;
  }

  return !!data;
}

export async function getCustomerCredits(): Promise<number> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return 0;
  }

  const { data, error } = await supabase
    .from('customers')
    .select('credits')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching credits:', error);
    return 0;
  }

  return data?.credits ?? 0;
}

export interface PurchaseBookResult {
  success: boolean;
  error?: string;
}

export async function purchaseBook(
  novelId: number,
  bookCredits: number,
  novelName: string,
  isCN: boolean = false
): Promise<PurchaseBookResult> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const userName = user.user_metadata?.name || user.email || 'Unknown';

  // Step 1: Get current customer data
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id, credits')
    .eq('user_id', user.id)
    .single();

  if (customerError || !customer) {
    console.error('Error fetching customer:', customerError);
    return { success: false, error: 'Failed to fetch customer data' };
  }

  // Step 2: Check if user already purchased this book
  const { data: existingBook } = await supabase
    .from('user_books')
    .select('id')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .maybeSingle();

  if (existingBook) {
    return { success: false, error: 'Book already purchased' };
  }

  // Step 3: Check if user has enough credits (skip for free books)
  if (bookCredits > 0 && customer.credits < bookCredits) {
    return { success: false, error: 'Insufficient credits' };
  }

  // Step 4: Insert user_books record first
  const { data: insertedBook, error: insertError } = await supabase
    .from('user_books')
    .insert({
      user_id: user.id,
      novel_id: novelId,
      credits_spent: bookCredits,
      is_cn: isCN,
      metadata: {
        purchased_at: new Date().toISOString(),
      },
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error inserting user_book:', insertError);
    return { success: false, error: 'Failed to record purchase' };
  }

  const userBooksId = insertedBook?.id;

  // Step 5: Calculate new credits after purchase
  const creditsAfter = bookCredits > 0 ? customer.credits - bookCredits : customer.credits;

  // Step 6: Deduct credits from customer (skip for free books)
  if (bookCredits > 0) {
    const { error: updateError } = await supabase
      .from('customers')
      .update({ 
        credits: creditsAfter,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error deducting credits:', updateError);
      
      // Rollback: Delete the user_books record
      await supabase
        .from('user_books')
        .delete()
        .eq('user_id', user.id)
        .eq('novel_id', novelId);
      
      return { success: false, error: 'Failed to process payment' };
    }
  }

  // Step 7: Record credit transaction history (non-blocking, ignore errors)
  try {
    const description = `用户id=${user.id}，用户名name=${userName}，购买了《${novelName}》书id=${novelId}，价格credits=${bookCredits}，订单的user_books_id=${userBooksId}`;
    
    await supabase
      .from('credits_history')
      .insert({
        customer_id: customer.id,
        amount: bookCredits,
        type: 'subtract',
        description: description,
        creem_order_id: null,
        metadata: {
          user_id: user.id,
          user_name: userName,
          novel_id: novelId,
          novel_name: novelName,
          credits_spent: bookCredits,
          user_books_id: userBooksId,
          credits_before: customer.credits,
          credits_after: creditsAfter,
        },
      });
  } catch (historyError) {
    console.warn('Failed to record credits_history (non-blocking):', historyError);
  }

  return { success: true };
}
