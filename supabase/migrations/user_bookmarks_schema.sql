CREATE TABLE public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  novel_id INTEGER NOT NULL,
  bookmark_type INTEGER NOT NULL DEFAULT 1,
  is_anchor BOOLEAN NOT NULL DEFAULT false,
  name TEXT NOT NULL,
  page_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 添加唯一约束：同一用户同一本书不能有相同名称的书签
ALTER TABLE public.user_bookmarks 
ADD CONSTRAINT unique_user_novel_bookmark_name UNIQUE (user_id, novel_id, name);