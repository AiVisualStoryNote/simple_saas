CREATE TABLE public.user_characters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  novel_id integer NOT NULL,
  character_id integer NOT NULL,
  unlocked_at timestamp with time zone DEFAULT NOW(),
  metadata jsonb DEFAULT '{}'::jsonb,
  
  UNIQUE(user_id, novel_id, character_id)
);