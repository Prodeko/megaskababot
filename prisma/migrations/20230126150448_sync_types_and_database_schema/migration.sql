/*
  Warnings:

  - You are about to drop the column `distanceTravelled` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `photoId` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `distance` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileId` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "distanceTravelled",
DROP COLUMN "photoId",
ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fileId" TEXT NOT NULL;
