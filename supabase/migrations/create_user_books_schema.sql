CREATE TABLE public.user_books (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  novel_id integer NOT NULL,  -- 书本/小说的 ID
  credits_spent integer NOT NULL,  -- 购买时消耗的 Credits 数量
  is_cn boolean NOT NULL DEFAULT false,  -- 是否为中国版本
  purchased_at timestamp with time zone DEFAULT NOW(),
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- 确保用户每本书只能购买一次
  UNIQUE(user_id, novel_id)
);