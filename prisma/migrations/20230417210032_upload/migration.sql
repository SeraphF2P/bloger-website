-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `profileImage` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_id_name_profileImage_key`(`id`, `name`, `profileImage`),
    UNIQUE INDEX `User_name_profileImage_key`(`name`, `profileImage`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `content` VARCHAR(191) NOT NULL,
    `autherId` VARCHAR(191) NOT NULL,
    `autherName` VARCHAR(191) NOT NULL,
    `profileImage` VARCHAR(191) NOT NULL,

    INDEX `Post_autherId_idx`(`autherId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_autherId_autherName_profileImage_fkey` FOREIGN KEY (`autherId`, `autherName`, `profileImage`) REFERENCES `User`(`id`, `name`, `profileImage`) ON DELETE RESTRICT ON UPDATE CASCADE;
