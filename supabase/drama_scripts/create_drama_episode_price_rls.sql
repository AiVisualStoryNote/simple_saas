-- ============================================================================
-- 短剧积分价格表 RLS 策略
-- 说明：为 drama_episode_price 和 drama_purchase 表配置行级安全策略
-- 创建时间：2026-04-27
-- ============================================================================

-- ============================================================================
-- 1. 启用 RLS
-- ============================================================================
ALTER TABLE drama_episode_price ENABLE ROW LEVEL SECURITY;
ALTER TABLE drama_purchase ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. drama_episode_price 表策略
-- ============================================================================

-- 允许所有人查看价格（用于前端展示）
CREATE POLICY "Allow public read for episode prices"
ON drama_episode_price
FOR SELECT
USING (is_deleted = FALSE);

-- -- 仅服务角色可以插入、更新、删除价格
-- CREATE POLICY "Allow service role to manage episode prices"
-- ON drama_episode_price
-- FOR ALL
-- TO service_role
-- USING (is_deleted = FALSE);

-- 仅指定用户可以插入、更新、删除价格
CREATE POLICY "Allow specific user to manage episode prices"
ON drama_episode_price
FOR INSERT
WITH CHECK (auth.uid() = '425fbc45-ff9d-4c99-aba6-acca352be035');

CREATE POLICY "Allow specific user to update episode prices"
ON drama_episode_price
FOR UPDATE
USING (auth.uid() = '425fbc45-ff9d-4c99-aba6-acca352be035');

CREATE POLICY "Allow specific user to delete episode prices"
ON drama_episode_price
FOR DELETE
USING (auth.uid() = '425fbc45-ff9d-4c99-aba6-acca352be035');



-- ============================================================================
-- 3. drama_purchase 表策略
-- ============================================================================

-- 允许用户查看自己的购买记录
CREATE POLICY "Allow users to read own purchases"
ON drama_purchase
FOR SELECT
USING (auth.uid() = user_id AND is_deleted = FALSE);

-- 允许用户插入自己的购买记录
CREATE POLICY "Allow users to insert own purchases"
ON drama_purchase
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 仅服务角色可以删除购买记录（用于管理）
CREATE POLICY "Allow service role to delete purchases"
ON drama_purchase
FOR DELETE
USING (is_deleted = FALSE);

-- ============================================================================
-- 4. 触发器：自动设置 updated_at
-- ============================================================================
DROP TRIGGER IF EXISTS update_drama_episode_price_updated_at ON drama_episode_price;
CREATE TRIGGER update_drama_episode_price_updated_at
    BEFORE UPDATE ON drama_episode_price
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_drama_purchase_updated_at ON drama_purchase;
CREATE TRIGGER update_drama_purchase_updated_at
    BEFORE UPDATE ON drama_purchase
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 完成提示
-- ============================================================================
-- RLS 策略说明：
-- drama_episode_price:
--   - 公开读取（前端展示价格）
--   - 仅服务角色可写（管理员设置价格）
--
-- drama_purchase:
--   - 用户只能查看自己的购买记录
--   - 用户只能插入自己的购买记录（通过应用逻辑校验）
--   - 仅服务角色可删除购买记录
-- ============================================================================
