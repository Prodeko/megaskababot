-- CreateTable
CREATE TABLE "PrivacyAccepted" (
    "telegramUserId" BIGINT NOT NULL,
    "accepted" BOOLEAN NOT NULL,

    CONSTRAINT "PrivacyAccepted_pkey" PRIMARY KEY ("telegramUserId")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_telegramUserId_fkey" FOREIGN KEY ("telegramUserId") REFERENCES "PrivacyAccepted"("telegramUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
