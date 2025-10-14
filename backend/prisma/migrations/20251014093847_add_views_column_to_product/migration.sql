-- Migration: Add views column to Product table
-- Date: 2025-10-14
-- Description: Add the missing views column to the Product table to match the current schema

-- Add views column to Product table
ALTER TABLE "public"."Product" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;

-- Create index for views column
CREATE INDEX IF NOT EXISTS "Product_views_idx" ON "Product"("views" DESC);
