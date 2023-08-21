/*
  Warnings:

  - Added the required column `autherId` to the `LikedBy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `likedby` ADD COLUMN `autherId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `post` MODIFY `content` LONGTEXT NOT NULL;

-- CreateIndex
CREATE INDEX `LikedBy_autherId_idx` ON `LikedBy`(`autherId`);
