/*
  Warnings:

  - A unique constraint covering the columns `[updatedAt]` on the table `Scores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recent` to the `Scores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scores" ADD COLUMN     "recent" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Scores_updatedAt_key" ON "Scores"("updatedAt");
