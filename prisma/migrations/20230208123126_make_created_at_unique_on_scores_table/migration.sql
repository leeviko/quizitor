/*
  Warnings:

  - A unique constraint covering the columns `[createdAt]` on the table `Scores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Scores_createdAt_key" ON "Scores"("createdAt");
