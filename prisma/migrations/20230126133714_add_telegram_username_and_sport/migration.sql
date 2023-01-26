/*
  Warnings:

  - Added the required column `sport` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegramUsername` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "sport" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "telegramUsername" TEXT NOT NULL;
