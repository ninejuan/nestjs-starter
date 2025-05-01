/*
  Warnings:

  - Added the required column `isHello` to the `Hello` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hello" ADD COLUMN     "isHello" BOOLEAN NOT NULL;
