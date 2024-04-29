/*
  Warnings:

  - You are about to drop the column `type` on the `categories` table. All the data in the column will be lost.
  - Added the required column `transaction_type` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "type";
ALTER TABLE "categories" ADD COLUMN     "transaction_type" "transactionType" NOT NULL;
