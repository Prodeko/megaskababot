/*
  Warnings:

  - You are about to drop the column `fileId` on the `Entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "fileId",
ADD COLUMN     "fileIds" TEXT[];
