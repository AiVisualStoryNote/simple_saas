-- ============================================================================
-- 短剧积分价格表
-- 说明：存储短剧分集的积分价格信息，用于用户积分购买分集视频
-- 创建时间：2026-04-27
-- ============================================================================

-- 1. 短剧积分价格表 (drama_episode_price)
-- 说明：存储每个短剧分集需要的积分价格
-- ============================================================================
CREATE TABLE IF NOT EXISTS drama_episode_price (
    id BIGSERIAL PRIMARY KEY,
    drama_id BIGINT NOT NULL,                        -- 短剧ID（外键关联 drama_main.id）
    episode_id BIGINT NOT NULL,                       -- 分集ID（外键关联 drama_episode.id）
    price BIGINT NOT NULL DEFAULT 0,                  -- 积分价格
    is_deleted BOOLEAN DEFAULT FALSE,                  -- 是否删除（软删除）
    created_at TIMESTAMP DEFAULT NOW(),                -- 创建时间
    updated_at TIMESTAMP DEFAULT NOW(),                -- 更新时间
    CONSTRAINT fk_drama_episode_price_drama FOREIGN KEY (drama_id)
        REFERENCES drama_main(id) ON DELETE CASCADE,
    CONSTRAINT fk_drama_episode_price_episode FOREIGN KEY (episode_id)
        REFERENCES drama_episode(id) ON DELETE CASCADE
);

-- 唯一约束（带软删除条件）
CREATE UNIQUE INDEX IF NOT EXISTS idx_drama_episode_price_unique ON drama_episode_price (drama_id, episode_id) WHERE is_deleted = FALSE;

-- 索引
CREATE INDEX IF NOT EXISTS idx_drama_episode_price_drama_id ON drama_episode_price (drama_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_episode_price_episode_id ON drama_episode_price (episode_id) WHERE is_deleted = FALSE;

-- ============================================================================
-- 2. 用户短剧购买记录表 (drama_purchase)
-- 说明：存储用户购买短剧分集的记录
-- ============================================================================
CREATE TABLE IF NOT EXISTS drama_purchase (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,                            -- 用户ID（外键关联 auth.users.id）
    drama_id BIGINT NOT NULL,                         -- 短剧ID（外键关联 drama_main.id）
    episode_id BIGINT NOT NULL,                        -- 分集ID（外键关联 drama_episode.id）
    price BIGINT NOT NULL,                            -- 购买时的积分价格
    purchased_at TIMESTAMP DEFAULT NOW(),              -- 购买时间
    is_deleted BOOLEAN DEFAULT FALSE,                  -- 是否删除（软删除）
    CONSTRAINT fk_drama_purchase_user FOREIGN KEY (user_id)
        REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_drama_purchase_drama FOREIGN KEY (drama_id)
        REFERENCES drama_main(id) ON DELETE CASCADE,
    CONSTRAINT fk_drama_purchase_episode FOREIGN KEY (episode_id)
        REFERENCES drama_episode(id) ON DELETE CASCADE
);

-- 唯一约束（带软删除条件）
CREATE UNIQUE INDEX IF NOT EXISTS idx_drama_purchase_unique ON drama_purchase (user_id, episode_id) WHERE is_deleted = FALSE;

-- 索引
CREATE INDEX IF NOT EXISTS idx_drama_purchase_user_id ON drama_purchase (user_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_purchase_drama_id ON drama_purchase (drama_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_purchase_episode_id ON drama_purchase (episode_id) WHERE is_deleted = FALSE;

-- ============================================================================
-- 完成提示
-- ============================================================================
-- 执行完成后，将创建以下表：
-- 1. drama_episode_price  - 短剧积分价格表
-- 2. drama_purchase       - 用户短剧购买记录表
-- ============================================================================