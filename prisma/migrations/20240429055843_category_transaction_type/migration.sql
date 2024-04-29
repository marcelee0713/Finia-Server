/*
  Warnings:

  - Added the required column `type` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "type" "transactionType" NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL;
