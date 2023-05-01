/*
  Warnings:

  - You are about to drop the column `autherId` on the `likedby` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId]` on the table `LikedBy` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `likedby` DROP COLUMN `autherId`;

-- CreateIndex
CREATE UNIQUE INDEX `LikedBy_postId_key` ON `LikedBy`(`postId`);
