/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_sessionId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "sessionId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Session";

-- CreateIndex
CREATE INDEX "Conversation_sessionId_idx" ON "Conversation"("sessionId");
