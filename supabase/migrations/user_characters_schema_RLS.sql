-- 启用 RLS（如果未启用）
ALTER TABLE public.user_characters ENABLE ROW LEVEL SECURITY;

-- 策略1：用户可以插入自己的角色解锁记录
CREATE POLICY "Users can insert their own character unlocks"
ON public.user_characters FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 策略2：用户可以查看自己的角色解锁记录
CREATE POLICY "Users can view their own character unlocks"
ON public.user_characters FOR SELECT
USING (auth.uid() = user_id);

-- 策略3：service_role 可以管理所有记录
CREATE POLICY "Service role can manage user characters"
ON public.user_characters FOR ALL
USING (auth.role() = 'service_role');