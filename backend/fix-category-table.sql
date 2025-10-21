-- Script to create Category table in production database
-- Run this script on your production database to fix the missing Category table

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "hoverText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (only if they don't exist)
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "public"."Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "public"."Category"("slug");
