/*
  Warnings:

  - Added the required column `public_id` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "public_id" TEXT NOT NULL;
