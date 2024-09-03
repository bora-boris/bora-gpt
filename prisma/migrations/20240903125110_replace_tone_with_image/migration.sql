/*
  Warnings:

  - You are about to drop the column `tone` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "tone",
ADD COLUMN     "image" TEXT;
