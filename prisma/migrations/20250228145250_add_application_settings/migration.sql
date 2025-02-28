-- CreateEnum
CREATE TYPE "Setting" AS ENUM ('ARCHIVE_MODE');

-- CreateTable
CREATE TABLE "ApplicationSettings" (
    "setting" "Setting" NOT NULL,
    "value" TEXT,

    CONSTRAINT "ApplicationSettings_pkey" PRIMARY KEY ("setting")
);
