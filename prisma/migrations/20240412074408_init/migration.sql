-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "transactionType" AS ENUM ('EXPENSES', 'REVENUE');

-- CreateTable
CREATE TABLE "user" (
    "uid" STRING NOT NULL,
    "username" STRING(100) NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "role" "role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "sessions" (
    "uid" STRING NOT NULL,
    "session_id" STRING(500) NOT NULL,
    "user_id" STRING(40),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "transactions" (
    "uid" STRING NOT NULL,
    "user_id" STRING,
    "category_id" STRING,
    "amount" STRING(11) NOT NULL,
    "type" "transactionType" NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "categories" (
    "uid" STRING NOT NULL,
    "category" STRING NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
