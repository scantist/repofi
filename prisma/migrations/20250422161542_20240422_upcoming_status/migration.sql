-- AlterEnum
ALTER TYPE "DaoStatus" ADD VALUE 'LAUNCHING';

-- AlterTable
ALTER TABLE "t_dao" ALTER COLUMN "token_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "t_dao_article" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "dao_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_dao_article_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "t_dao_article" ADD CONSTRAINT "t_dao_article_dao_id_fkey" FOREIGN KEY ("dao_id") REFERENCES "t_dao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
