/*
  Warnings:

  - You are about to alter the column `friends` on the `friend` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `friend` MODIFY `friends` JSON NOT NULL;
