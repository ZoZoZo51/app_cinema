/*
  Warnings:

  - Added the required column `releaseDate` to the `ToSeeMovie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ToSeeMovie" ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;
