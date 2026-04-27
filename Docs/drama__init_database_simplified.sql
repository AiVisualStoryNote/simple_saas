-- ============================================================================
-- 短剧数据库初始化脚本（简化版）
-- 适用项目：分镜合成视频项目
-- 创建时间：2024
-- ============================================================================

-- ============================================================================
-- 说明：
-- 1. 本脚本用于创建短剧系统所需的所有数据表
-- 2. 表之间的依赖关系：drama_main、drama_tag 为基础表，drama_tag_relation 和 drama_episode 依赖它们
-- 3. 所有表都使用软删除机制（is_deleted 字段）
-- 4. 使用 PostgreSQL 数据库
-- ============================================================================

-- ============================================================================
-- 1. 短剧主体信息表 (drama_main)
-- 说明：存储短剧的基本信息
-- ============================================================================
CREATE TABLE IF NOT EXISTS drama_main (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                      -- 短剧名称
    cover_image_key VARCHAR(255),                    -- 封面图片存储key
    resolution VARCHAR(10) NOT NULL,                 -- 分辨率（480P/720P/1080P/2K/4K）
    orientation VARCHAR(10) NOT NULL DEFAULT '横屏', -- 展示方式（横屏/竖屏）
    description TEXT,                                -- 短剧描述/简介
    is_deleted BOOLEAN DEFAULT FALSE,                -- 是否删除（软删除）
    created_at TIMESTAMP DEFAULT NOW(),              -- 创建时间
    updated_at TIMESTAMP DEFAULT NOW()               -- 更新时间
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_drama_main_name ON drama_main (name) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_main_orientation ON drama_main (orientation) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_main_updated ON drama_main (updated_at DESC);

-- 唯一约束
CREATE UNIQUE INDEX IF NOT EXISTS idx_drama_main_name_unique ON drama_main (name) WHERE is_deleted = FALSE;

-- ============================================================================
-- 2. 短剧标签表 (drama_tag)
-- 说明：存储短剧标签信息
-- ============================================================================
CREATE TABLE IF NOT EXISTS drama_tag (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,                       -- 标签名称
    color VARCHAR(20),                               -- 标签颜色（十六进制）
    is_deleted BOOLEAN DEFAULT FALSE,                -- 是否删除（软删除）
    created_at TIMESTAMP DEFAULT NOW(),              -- 创建时间
    updated_at TIMESTAMP DEFAULT NOW()               -- 更新时间
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_drama_tag_name ON drama_tag (name) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_tag_updated ON drama_tag (updated_at DESC);

-- 唯一约束
CREATE UNIQUE INDEX IF NOT EXISTS idx_drama_tag_name_unique ON drama_tag (name) WHERE is_deleted = FALSE;

-- ============================================================================
-- 3. 短剧-标签关联表 (drama_tag_relation)
-- 说明：存储短剧与标签的多对多关系
-- ============================================================================
CREATE TABLE IF NOT EXISTS drama_tag_relation (
    id BIGSERIAL PRIMARY KEY,
    drama_id BIGINT NOT NULL,                        -- 短剧ID（外键关联 drama_main.id）
    tag_id BIGINT NOT NULL,                          -- 标签ID（外键关联 drama_tag.id）
    is_deleted BOOLEAN DEFAULT FALSE,                -- 是否删除（软删除）
    created_at TIMESTAMP DEFAULT NOW(),              -- 创建时间
    CONSTRAINT fk_drama_tag_relation_drama FOREIGN KEY (drama_id) 
        REFERENCES drama_main(id) ON DELETE CASCADE,
    CONSTRAINT fk_drama_tag_relation_tag FOREIGN KEY (tag_id) 
        REFERENCES drama_tag(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_drama_tag_relation_drama_id ON drama_tag_relation (drama_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_tag_relation_tag_id ON drama_tag_relation (tag_id) WHERE is_deleted = FALSE;

-- 唯一约束
CREATE UNIQUE INDEX IF NOT EXISTS idx_drama_tag_relation_unique ON drama_tag_relation (drama_id, tag_id) WHERE is_deleted = FALSE;

-- ============================================================================
-- 4. 短剧分集表 (drama_episode)
-- 说明：存储短剧分集信息
-- ============================================================================
CREATE TABLE IF NOT EXISTS drama_episode (
    id BIGSERIAL PRIMARY KEY,
    drama_id BIGINT NOT NULL,                        -- 短剧ID（外键关联 drama_main.id）
    episode_number INT NOT NULL,                     -- 集数序号
    name VARCHAR(200) NOT NULL,                      -- 分集名称
    summary TEXT NOT NULL,                           -- 分集梗概
    outline TEXT NOT NULL,                           -- 分集大纲
    composite_video_key VARCHAR(255),                -- 分集合成视频存储key
    is_deleted BOOLEAN DEFAULT FALSE,                -- 是否删除（软删除）
    created_at TIMESTAMP DEFAULT NOW(),              -- 创建时间
    updated_at TIMESTAMP DEFAULT NOW(),              -- 更新时间
    CONSTRAINT fk_drama_episode_drama FOREIGN KEY (drama_id) 
        REFERENCES drama_main(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_drama_episode_drama_id ON drama_episode (drama_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_episode_episode_number ON drama_episode (drama_id, episode_number) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_episode_name ON drama_episode (name) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_drama_episode_updated ON drama_episode (updated_at DESC);

-- 唯一约束
CREATE UNIQUE INDEX IF NOT EXISTS idx_drama_episode_unique ON drama_episode (drama_id, episode_number) WHERE is_deleted = FALSE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_drama_episode_name_unique ON drama_episode (name) WHERE is_deleted = FALSE;

-- ============================================================================
-- 5. 自动更新 updated_at 字段的触发器函数
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 drama_main 表添加触发器
DROP TRIGGER IF EXISTS update_drama_main_updated_at ON drama_main;
CREATE TRIGGER update_drama_main_updated_at
    BEFORE UPDATE ON drama_main
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为 drama_tag 表添加触发器
DROP TRIGGER IF EXISTS update_drama_tag_updated_at ON drama_tag;
CREATE TRIGGER update_drama_tag_updated_at
    BEFORE UPDATE ON drama_tag
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为 drama_tag_relation 表添加触发器
DROP TRIGGER IF EXISTS update_drama_tag_relation_updated_at ON drama_tag_relation;
CREATE TRIGGER update_drama_tag_relation_updated_at
    BEFORE UPDATE ON drama_tag_relation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为 drama_episode 表添加触发器
DROP TRIGGER IF EXISTS update_drama_episode_updated_at ON drama_episode;
CREATE TRIGGER update_drama_episode_updated_at
    BEFORE UPDATE ON drama_episode
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 完成提示
-- ============================================================================
-- 执行完成后，将创建以下表：
-- 1. drama_main        - 短剧主体信息表
-- 2. drama_tag         - 短剧标签表
-- 3. drama_tag_relation - 短剧-标签关联表
-- 4. drama_episode     - 短剧分集表
-- ============================================================================
