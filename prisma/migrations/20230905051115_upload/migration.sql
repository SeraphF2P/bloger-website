/*
  Warnings:

  - The primary key for the `friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `notification` table. All the data in the column will be lost.
  - Added the required column `from` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Friend_id_userId_key` ON `friend`;

-- AlterTable
ALTER TABLE `friend` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `userId`,
    ADD COLUMN `from` VARCHAR(191) NOT NULL,
    ADD COLUMN `onPost` VARCHAR(191) NULL,
    ADD COLUMN `to` VARCHAR(191) NOT NULL;
