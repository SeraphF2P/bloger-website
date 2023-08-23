-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `autherId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,

    INDEX `Comment_postId_idx`(`postId`),
    INDEX `Comment_autherId_idx`(`autherId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_friendship` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_friendship_AB_unique`(`A`, `B`),
    INDEX `_friendship_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
