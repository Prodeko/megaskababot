/*
  Warnings:

  - Added the required column `earnedPoints` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sportMultiplier` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN "sportMultiplier" DOUBLE PRECISION;

UPDATE "Entry"
SET "sportMultiplier" = 
    CASE 
        WHEN "sport" = 'swim' THEN 5
        WHEN "sport" IN ('run', 'walk') THEN 1
        WHEN "sport" IN ('ski', 'rollerski', 'rollerblade', 'skateboard') THEN 0.5
        WHEN "sport" = 'cycle' THEN 0.2
    END;

ALTER TABLE "Entry"
ALTER COLUMN "sportMultiplier" SET NOT NULL;

ALTER TABLE "Entry" ADD COLUMN "earnedPoints" DOUBLE PRECISION;

UPDATE "Entry"
SET "earnedPoints" = 
    CASE
        WHEN "doublePoints" THEN "distance" * "sportMultiplier" * 2
        ELSE "distance" * "sportMultiplier"
    END;

ALTER TABLE "Entry"
ALTER COLUMN "earnedPoints" SET NOT NULL;
