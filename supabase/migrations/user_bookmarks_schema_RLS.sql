-- 启用 RLS
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- 策略1：用户可以查看自己的书签
CREATE POLICY "Users can view their own bookmarks"
ON public.user_bookmarks FOR SELECT
USING (auth.uid() = user_id);

-- 策略2：用户可以插入自己的书签
CREATE POLICY "Users can insert their own bookmarks"
ON public.user_bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 策略3：用户可以更新自己的书签
CREATE POLICY "Users can update their own bookmarks"
ON public.user_bookmarks FOR UPDATE
USING (auth.uid() = user_id);

-- 策略4：用户可以删除自己的书签
CREATE POLICY "Users can delete their own bookmarks"
ON public.user_bookmarks FOR DELETE
USING (auth.uid() = user_id);

-- 策略5：service_role 可以管理所有书签
CREATE POLICY "Service role can manage user bookmarks"
ON public.user_bookmarks FOR ALL
USING (auth.role() = 'service_role');