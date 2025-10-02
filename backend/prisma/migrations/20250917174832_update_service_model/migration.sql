/*
  Warnings:

  - You are about to drop the column `name` on the `Service` table. All the data in the column will be lost.
  - Added the required column `title` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "name",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT NOT NULL;
