/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_id_name_profileImage_key` ON `user`;

-- DropIndex
DROP INDEX `User_name_profileImage_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    DROP COLUMN `profileImage`,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `gender` ENUM('male', 'female') NOT NULL DEFAULT 'male',
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    ADD COLUMN `profileImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL DEFAULT 'new user';

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `User_id_username_key` ON `User`(`id`, `username`);
