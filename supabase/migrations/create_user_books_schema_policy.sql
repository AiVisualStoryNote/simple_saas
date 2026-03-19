-- 启用 RLS（如果未启用）
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;

-- 策略1：用户可以插入自己的书本记录
CREATE POLICY "Users can insert their own book purchases"
ON public.user_books FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 策略2：用户可以查看自己的书本记录
CREATE POLICY "Users can view their own book purchases"
ON public.user_books FOR SELECT
USING (auth.uid() = user_id);

-- 策略3：service_role 可以管理所有记录
CREATE POLICY "Service role can manage user books"
ON public.user_books FOR ALL
USING (auth.role() = 'service_role');