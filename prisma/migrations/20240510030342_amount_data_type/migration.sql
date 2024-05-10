/*
  Warnings:

  - Changed the type of `amount` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "amount";
ALTER TABLE "transactions" ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL;
