/*
  Warnings:

  - The `status` column on the `SOSAlert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `EmergencyContact` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SOSStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "EmergencyContact" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SOSAlert" DROP COLUMN "status",
ADD COLUMN     "status" "SOSStatus" NOT NULL DEFAULT 'ACTIVE';
