/*
  Warnings:

  - Made the column `releaseDate` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `releaseDate` on table `ToSeeMovie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "releaseDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "ToSeeMovie" ALTER COLUMN "releaseDate" SET NOT NULL;
