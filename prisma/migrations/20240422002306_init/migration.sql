-- AlterTable
ALTER TABLE `Room` ADD COLUMN `state` ENUM('IDLE', 'MATCHED', 'FINISHED') NOT NULL DEFAULT 'IDLE';