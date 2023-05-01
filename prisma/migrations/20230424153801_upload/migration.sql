/*
  Warnings:

  - You are about to drop the `like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `like`;

-- CreateTable
CREATE TABLE `LikedBy` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `autherId` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,

    INDEX `LikedBy_postId_idx`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
