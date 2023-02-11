/*
  Warnings:

  - You are about to alter the column `title` on the `Questions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(40)`.
  - You are about to alter the column `title` on the `Quiz` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(40)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(25)`.

*/
-- AlterTable
ALTER TABLE "Questions" ALTER COLUMN "title" SET DATA TYPE VARCHAR(40);

-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "title" SET DATA TYPE VARCHAR(40);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(25);
