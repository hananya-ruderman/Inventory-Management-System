/*
  Warnings:

  - Added the required column `price` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "price" INTEGER NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'general',
ALTER COLUMN "stock" SET DEFAULT 1;
