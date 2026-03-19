-- 用户可以插入自己的积分历史记录
CREATE POLICY "Users can insert their own credits history"
ON public.credits_history FOR INSERT
WITH CHECK (
    exists (
        select 1 from public.customers
        where customers.id = credits_history.customer_id
        and customers.user_id = auth.uid()
    )
);