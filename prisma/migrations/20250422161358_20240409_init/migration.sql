-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "DaoType" AS ENUM ('CODE', 'MODEL', 'DATASET');

-- CreateEnum
CREATE TYPE "DaoStatus" AS ENUM ('INACTIVE', 'PRE_LAUNCH', 'LAUNCHED');

-- CreateEnum
CREATE TYPE "DaoPlatform" AS ENUM ('GITHUB', 'GITLAB');

-- CreateEnum
CREATE TYPE "DaoContentType" AS ENUM ('LIST_ROW', 'TEAM_COMMUNITY', 'ROADMAP', 'INFORMATION');

-- CreateTable
CREATE TABLE "t_api_key" (
    "key" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "user_address" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3),

    CONSTRAINT "t_api_key_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "t_user" (
    "address" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "referral_code" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invited_by" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "t_user_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "t_user_platform" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "platform" "DaoPlatform" NOT NULL DEFAULT 'GITHUB',
    "platform_id" VARCHAR(255) NOT NULL,
    "platform_name" VARCHAR(255) NOT NULL,
    "platform_avatar" VARCHAR(255) NOT NULL,
    "user_address" VARCHAR(255) NOT NULL,

    CONSTRAINT "t_user_platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_dao_star" (
    "dao_id" VARCHAR(255) NOT NULL,
    "user_address" VARCHAR(255) NOT NULL,

    CONSTRAINT "t_dao_star_pkey" PRIMARY KEY ("dao_id","user_address")
);

-- CreateTable
CREATE TABLE "t_dao" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "ticker" VARCHAR(255) NOT NULL,
    "type" "DaoType" NOT NULL,
    "description" TEXT NOT NULL,
    "avatar" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255) NOT NULL,
    "token_id" BIGINT NOT NULL,
    "links" JSONB NOT NULL DEFAULT '[]',
    "status" "DaoStatus" NOT NULL DEFAULT 'PRE_LAUNCH',
    "platform" "DaoPlatform" NOT NULL DEFAULT 'GITHUB',
    "market_cap_usd" DECIMAL(50,18) NOT NULL DEFAULT 0,
    "price_usd" DECIMAL(50,18) NOT NULL DEFAULT 0,

    CONSTRAINT "t_dao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_dao_content" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "dao_id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "DaoContentType" NOT NULL DEFAULT 'LIST_ROW',
    "data" JSONB NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_dao_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_dao_launch_holder" (
    "user_address" VARCHAR(255) NOT NULL,
    "token_id" BIGINT NOT NULL,
    "balance" DECIMAL(50,18) NOT NULL,

    CONSTRAINT "t_dao_launch_holder_pkey" PRIMARY KEY ("user_address","token_id")
);

-- CreateTable
CREATE TABLE "t_dao_graduation_holder" (
    "user_address" VARCHAR(255) NOT NULL,
    "token_id" BIGINT NOT NULL,
    "token_address" VARCHAR(255) NOT NULL,
    "balance" DECIMAL(50,18) NOT NULL,

    CONSTRAINT "t_dao_graduation_holder_pkey" PRIMARY KEY ("user_address","token_id")
);

-- CreateTable
CREATE TABLE "t_dao_token_info" (
    "token_id" BIGINT NOT NULL,
    "token_address" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "ticker" VARCHAR(255) NOT NULL,
    "creator" VARCHAR(255) NOT NULL,
    "is_graduated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liquidity" DECIMAL(50,18),
    "price" DECIMAL(50,18),
    "market_cap" DECIMAL(50,18),
    "total_supply" DECIMAL(78,0),
    "raised_asset_amount" DECIMAL(78,0),
    "sales_ratio" DECIMAL(5,4),
    "reserved_ratio" DECIMAL(5,4),
    "unlock_ratio" DECIMAL(5,4),
    "holder_count" INTEGER NOT NULL DEFAULT 0,
    "asset_token_address" VARCHAR(255),
    "graduated_at" TIMESTAMP(3),
    "uniswap_v3_pair" VARCHAR(255),

    CONSTRAINT "t_dao_token_info_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "t_asset_token" (
    "address" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(255) NOT NULL,
    "decimals" INTEGER NOT NULL,
    "logo_url" VARCHAR(255) NOT NULL,
    "price_usd" DECIMAL(50,18) NOT NULL DEFAULT 0,
    "launch_fee" DECIMAL(78,0) NOT NULL DEFAULT 0,
    "is_allowed" BOOLEAN NOT NULL DEFAULT false,
    "is_native" BOOLEAN NOT NULL DEFAULT false,
    "is_valid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "t_asset_token_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "t_forum_message" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "dao_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(255) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "reply_to_message" VARCHAR(255),
    "reply_to_user" VARCHAR(255),
    "root_message_id" VARCHAR(255),

    CONSTRAINT "t_forum_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_contributor" (
    "id" VARCHAR(255) NOT NULL DEFAULT gen_random_uuid(),
    "dao_id" TEXT NOT NULL,
    "user_address" TEXT,
    "is_valid" BOOLEAN NOT NULL DEFAULT false,
    "user_platform" "DaoPlatform" NOT NULL DEFAULT 'GITHUB',
    "user_platform_id" VARCHAR(255) NOT NULL,
    "user_platform_name" VARCHAR(255) NOT NULL,
    "user_platform_avatar" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshotValue" DECIMAL(50,18) NOT NULL DEFAULT 0,

    CONSTRAINT "t_contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_contributor_history" (
    "id" VARCHAR(255) NOT NULL DEFAULT gen_random_uuid(),
    "tag" VARCHAR(255) NOT NULL,
    "value" DECIMAL(50,18) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contributor_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "t_contributor_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_evt_txn_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "address" CHAR(42) NOT NULL,
    "topic_0" VARCHAR(255) NOT NULL,
    "topic_1" VARCHAR(255),
    "topic_2" VARCHAR(255),
    "topic_3" VARCHAR(255),
    "data" TEXT,

    CONSTRAINT "t_evt_txn_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_token_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "token_id" BIGINT NOT NULL,
    "asset_address" CHAR(42) NOT NULL,
    "init_price" DECIMAL(50,18) NOT NULL,
    "user_address" CHAR(42) NOT NULL,

    CONSTRAINT "t_evt_token_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_graduated_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "token_id" BIGINT NOT NULL,
    "token_address" CHAR(42) NOT NULL,
    "uniswap_pool" CHAR(42) NOT NULL,

    CONSTRAINT "t_evt_graduated_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_token_lock_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "token_address" CHAR(42) NOT NULL,
    "unlock_ratio" DECIMAL(40,0) NOT NULL,
    "lock_period" BIGINT NOT NULL,
    "lock_start" BIGINT NOT NULL,

    CONSTRAINT "t_evt_token_lock_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_trade_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "token_id" BIGINT NOT NULL,
    "user_address" CHAR(42) NOT NULL,
    "asset_address" CHAR(42) NOT NULL,
    "trade_type" INTEGER NOT NULL,
    "tax" DECIMAL(50,18) NOT NULL DEFAULT 0,
    "amount_in" DECIMAL(40,18) NOT NULL,
    "amount_out" DECIMAL(40,18) NOT NULL,
    "price" DECIMAL(40,18) NOT NULL,

    CONSTRAINT "t_evt_trade_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_asset_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "asset_address" CHAR(42) NOT NULL,
    "decimals" INTEGER NOT NULL,
    "is_allowed" BOOLEAN NOT NULL DEFAULT false,
    "launch_fee" DECIMAL(40,0),

    CONSTRAINT "t_evt_asset_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_asset_fee_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "asset_address" CHAR(42) NOT NULL,
    "old_launch_fee" DECIMAL(40,0) NOT NULL,
    "new_launch_fee" DECIMAL(40,0) NOT NULL,

    CONSTRAINT "t_evt_asset_fee_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_contribution_start_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "token_id" BIGINT NOT NULL,
    "cycle_id" BIGINT NOT NULL,

    CONSTRAINT "t_evt_contribution_start_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_contribution_update_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "token_id" BIGINT NOT NULL,
    "cycle_id" BIGINT NOT NULL,
    "contributor" CHAR(42) NOT NULL,
    "contributor_id" VARCHAR(255) NOT NULL,
    "score" DECIMAL(40,0) NOT NULL,

    CONSTRAINT "t_evt_contribution_update_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_evt_claim_log" (
    "block_number" BIGINT NOT NULL,
    "txn_index" BIGINT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_time" BIGINT NOT NULL,
    "txn_hash" CHAR(66) NOT NULL,
    "token_address" CHAR(42) NOT NULL,
    "user_address" CHAR(42) NOT NULL,
    "amount" DECIMAL(50,18) NOT NULL,
    "claim_type" INTEGER NOT NULL,

    CONSTRAINT "t_evt_claim_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateTable
CREATE TABLE "t_kline_5m" (
    "token_id" BIGINT NOT NULL,
    "open_ts" BIGINT NOT NULL,
    "close_ts" BIGINT NOT NULL,
    "open" DECIMAL(50,18) NOT NULL,
    "high" DECIMAL(50,18) NOT NULL,
    "low" DECIMAL(50,18) NOT NULL,
    "close" DECIMAL(50,18) NOT NULL,
    "volume" DECIMAL(50,18) NOT NULL,
    "amount" DECIMAL(50,18) NOT NULL,
    "txn_num" BIGINT NOT NULL,

    CONSTRAINT "t_kline_5m_pkey" PRIMARY KEY ("token_id","open_ts")
);

-- CreateTable
CREATE TABLE "t_kline_1m" (
    "token_id" BIGINT NOT NULL,
    "open_ts" BIGINT NOT NULL,
    "close_ts" BIGINT NOT NULL,
    "open" DECIMAL(50,18) NOT NULL,
    "high" DECIMAL(50,18) NOT NULL,
    "low" DECIMAL(50,18) NOT NULL,
    "close" DECIMAL(50,18) NOT NULL,
    "volume" DECIMAL(50,18) NOT NULL,
    "amount" DECIMAL(50,18) NOT NULL,
    "txn_num" BIGINT NOT NULL,

    CONSTRAINT "t_kline_1m_pkey" PRIMARY KEY ("token_id","open_ts")
);

-- CreateTable
CREATE TABLE "t_contribution_info" (
    "token_id" BIGINT NOT NULL,
    "cycle_id" BIGINT NOT NULL,
    "start_ts" BIGINT NOT NULL,

    CONSTRAINT "t_contribution_info_pkey" PRIMARY KEY ("token_id","cycle_id")
);

-- CreateTable
CREATE TABLE "t_contribution_detail" (
    "token_id" BIGINT NOT NULL,
    "cycle_id" BIGINT NOT NULL,
    "contributor" CHAR(42) NOT NULL,
    "contributor_id" VARCHAR(255) NOT NULL,
    "score" DECIMAL(40,0) NOT NULL,
    "update_ts" BIGINT NOT NULL,

    CONSTRAINT "t_contribution_detail_pkey" PRIMARY KEY ("token_id","cycle_id","contributor")
);

-- CreateTable
CREATE TABLE "t_user_claim_history" (
    "user_address" CHAR(42) NOT NULL,
    "token_address" CHAR(42) NOT NULL,
    "claim_type" INTEGER NOT NULL,
    "claim_amount" DECIMAL(50,18) NOT NULL,
    "claim_time" BIGINT NOT NULL,

    CONSTRAINT "t_user_claim_history_pkey" PRIMARY KEY ("user_address","token_address")
);

-- CreateTable
CREATE TABLE "t_evt_balance_log" (
    "block_number" BIGINT NOT NULL DEFAULT 0,
    "txn_index" BIGINT NOT NULL DEFAULT 0,
    "log_index" BIGINT NOT NULL DEFAULT 0,
    "user_address" CHAR(42) NOT NULL DEFAULT '',
    "token_address" CHAR(42) NOT NULL DEFAULT '',
    "block_time" BIGINT NOT NULL DEFAULT 0,
    "txn_hash" CHAR(66) NOT NULL DEFAULT '',
    "delta_amount" DECIMAL(50,18) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(50,18) NOT NULL DEFAULT 0,

    CONSTRAINT "t_evt_balance_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index","user_address")
);

-- CreateTable
CREATE TABLE "t_evt_transfer_log" (
    "block_number" BIGINT NOT NULL DEFAULT 0,
    "txn_index" BIGINT NOT NULL DEFAULT 0,
    "log_index" BIGINT NOT NULL DEFAULT 0,
    "block_time" BIGINT NOT NULL DEFAULT 0,
    "txn_hash" CHAR(66) NOT NULL DEFAULT '',
    "token_address" CHAR(42) NOT NULL DEFAULT '',
    "from_address" CHAR(42) NOT NULL DEFAULT '',
    "to_address" VARCHAR(255) NOT NULL DEFAULT '',
    "amount" DECIMAL(50,18) NOT NULL DEFAULT 0,

    CONSTRAINT "t_evt_transfer_log_pkey" PRIMARY KEY ("block_number","txn_index","log_index")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_api_key_key_key" ON "t_api_key"("key");

-- CreateIndex
CREATE UNIQUE INDEX "t_api_key_name_user_address_key" ON "t_api_key"("name", "user_address");

-- CreateIndex
CREATE UNIQUE INDEX "t_user_email_key" ON "t_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "t_user_referral_code_key" ON "t_user"("referral_code");

-- CreateIndex
CREATE INDEX "t_user_platform_platform_platform_id_idx" ON "t_user_platform"("platform", "platform_id");

-- CreateIndex
CREATE UNIQUE INDEX "t_user_platform_user_address_platform_key" ON "t_user_platform"("user_address", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "t_dao_name_key" ON "t_dao"("name");

-- CreateIndex
CREATE UNIQUE INDEX "t_dao_url_key" ON "t_dao"("url");

-- CreateIndex
CREATE UNIQUE INDEX "t_dao_ticker_key" ON "t_dao"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "t_dao_token_id_key" ON "t_dao"("token_id");

-- CreateIndex
CREATE INDEX "t_dao_launch_holder_token_id_idx" ON "t_dao_launch_holder"("token_id");

-- CreateIndex
CREATE INDEX "t_dao_launch_holder_user_address_idx" ON "t_dao_launch_holder"("user_address");

-- CreateIndex
CREATE INDEX "t_dao_graduation_holder_token_id_idx" ON "t_dao_graduation_holder"("token_id");

-- CreateIndex
CREATE INDEX "t_dao_graduation_holder_user_address_idx" ON "t_dao_graduation_holder"("user_address");

-- CreateIndex
CREATE INDEX "t_forum_message_root_message_id_idx" ON "t_forum_message"("root_message_id");

-- CreateIndex
CREATE INDEX "t_forum_message_created_at_idx" ON "t_forum_message"("created_at");

-- CreateIndex
CREATE INDEX "t_contributor_user_platform_user_platform_id_idx" ON "t_contributor"("user_platform", "user_platform_id");

-- CreateIndex
CREATE INDEX "t_evt_balance_log_token_address_idx" ON "t_evt_balance_log"("token_address");

-- CreateIndex
CREATE INDEX "t_evt_transfer_log_token_address_idx" ON "t_evt_transfer_log"("token_address");

-- AddForeignKey
ALTER TABLE "t_user_platform" ADD CONSTRAINT "t_user_platform_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "t_user"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_dao_star" ADD CONSTRAINT "t_dao_star_dao_id_fkey" FOREIGN KEY ("dao_id") REFERENCES "t_dao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_dao_star" ADD CONSTRAINT "t_dao_star_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "t_user"("address") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_dao" ADD CONSTRAINT "t_dao_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "t_user"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_dao" ADD CONSTRAINT "t_dao_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "t_dao_token_info"("token_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_dao_content" ADD CONSTRAINT "t_dao_content_dao_id_fkey" FOREIGN KEY ("dao_id") REFERENCES "t_dao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_dao_launch_holder" ADD CONSTRAINT "t_dao_launch_holder_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "t_dao_token_info"("token_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_dao_graduation_holder" ADD CONSTRAINT "t_dao_graduation_holder_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "t_dao_token_info"("token_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_dao_token_info" ADD CONSTRAINT "t_dao_token_info_asset_token_address_fkey" FOREIGN KEY ("asset_token_address") REFERENCES "t_asset_token"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_forum_message" ADD CONSTRAINT "t_forum_message_dao_id_fkey" FOREIGN KEY ("dao_id") REFERENCES "t_dao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_contributor" ADD CONSTRAINT "t_contributor_dao_id_fkey" FOREIGN KEY ("dao_id") REFERENCES "t_dao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_contributor" ADD CONSTRAINT "t_contributor_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "t_user"("address") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_contributor_history" ADD CONSTRAINT "t_contributor_history_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "t_contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
