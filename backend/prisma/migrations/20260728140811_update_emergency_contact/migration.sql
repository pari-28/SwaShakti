-- AlterTable
ALTER TABLE "EmergencyContact" ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT '+91',
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;
