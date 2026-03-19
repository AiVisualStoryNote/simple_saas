import { createClient } from "@/utils/supabase/client";

export interface Character {
  id: number;
  novel_id: number;
  type: string;
  name: string;
  sex: string;
  age_type: string;
  species: string;
  body_type: string;
  text: string;
  design_img_id: number;
  design_img: {
    id: number;
    file_type: string;
    file_url: string;
    file_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UserCharacter {
  id: string;
  user_id: string;
  novel_id: number;
  character_id: number;
  unlocked_at: string;
  metadata: Record<string, any>;
}

export interface DrawCardResult {
  success: boolean;
  error?: string;
  character?: Character;
  isNewUnlock?: boolean;
}

export function getRandomCharacter(characters: Character[]): { index: number; character: Character } | null {
  if (!characters || characters.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * characters.length);
  return {
    index: randomIndex,
    character: characters[randomIndex],
  };
}

export function getRandomCharacterFromList(characters: Character[], excludeIds: number[]): { index: number; character: Character } | null {
  if (!characters || characters.length === 0) {
    return null;
  }
  
  const availableCharacters = characters.filter(c => !excludeIds.includes(c.id));
  
  if (availableCharacters.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableCharacters.length);
  const selectedCharacter = availableCharacters[randomIndex];
  const originalIndex = characters.findIndex(c => c.id === selectedCharacter.id);
  
  return {
    index: originalIndex,
    character: selectedCharacter,
  };
}

export async function getUserUnlockedCharacterIds(novelId: number): Promise<number[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_characters')
    .select('character_id')
    .eq('user_id', user.id)
    .eq('novel_id', novelId);

  if (error) {
    console.error('Error fetching unlocked characters:', error);
    return [];
  }

  return data?.map(item => item.character_id) || [];
}

export async function unlockCharacter(
  novelId: number,
  characterId: number,
  novelName: string,
  cost: number = 1
): Promise<DrawCardResult> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const userName = user.user_metadata?.name || user.email || 'Unknown';

  // Step 1: Check if already unlocked
  const { data: existing } = await supabase
    .from('user_characters')
    .select('id')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .eq('character_id', characterId)
    .maybeSingle();

  let isNewUnlock = false;

  // Step 2: If not exists, insert into user_characters
  if (!existing) {
    const { error: insertError } = await supabase
      .from('user_characters')
      .insert({
        user_id: user.id,
        novel_id: novelId,
        character_id: characterId,
        metadata: {
          unlocked_at: new Date().toISOString(),
          novel_name: novelName,
        },
      });

    if (insertError) {
      console.error('Error inserting user_character:', insertError);
      return { success: false, error: 'Failed to unlock character' };
    }
    isNewUnlock = true;
  }

  // Step 3: Get customer data and check credits
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id, credits')
    .eq('user_id', user.id)
    .single();

  if (customerError || !customer) {
    console.error('Error fetching customer:', customerError);
    
    // Rollback: Delete the inserted user_character record if new
    if (isNewUnlock) {
      await supabase
        .from('user_characters')
        .delete()
        .eq('user_id', user.id)
        .eq('novel_id', novelId)
        .eq('character_id', characterId);
    }
    
    return { success: false, error: 'Failed to fetch customer data' };
  }

  // Step 4: Check if user has enough credits
  if (customer.credits < cost) {
    // Rollback: Delete the inserted user_character record if new
    if (isNewUnlock) {
      await supabase
        .from('user_characters')
        .delete()
        .eq('user_id', user.id)
        .eq('novel_id', novelId)
        .eq('character_id', characterId);
    }
    
    return { success: false, error: 'Insufficient credits' };
  }

  // Step 5: Deduct credits
  const newCredits = customer.credits - cost;
  const { error: updateError } = await supabase
    .from('customers')
    .update({ 
      credits: newCredits,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);

  if (updateError) {
    console.error('Error deducting credits:', updateError);
    
    // Rollback: Delete the inserted user_character record if new
    if (isNewUnlock) {
      await supabase
        .from('user_characters')
        .delete()
        .eq('user_id', user.id)
        .eq('novel_id', novelId)
        .eq('character_id', characterId);
    }
    
    return { success: false, error: 'Failed to process payment' };
  }

  // Step 6: Record credit transaction history (non-blocking)
  try {
    const description = `用户id=${user.id}，用户名name=${userName}，书本id=${novelId}，书本name=${novelName}，角色设计卡的抽卡点亮消费credits=${cost}`;
    
    await supabase
      .from('credits_history')
      .insert({
        customer_id: customer.id,
        amount: cost,
        type: 'subtract',
        description: description,
        creem_order_id: null,
        metadata: {
          user_id: user.id,
          user_name: userName,
          novel_id: novelId,
          novel_name: novelName,
          character_id: characterId,
          credits_spent: cost,
          credits_before: customer.credits,
          credits_after: newCredits,
          is_new_unlock: isNewUnlock,
        },
      });
  } catch (historyError) {
    console.warn('Failed to record credits_history (non-blocking):', historyError);
  }

  return { success: true, isNewUnlock };
}
