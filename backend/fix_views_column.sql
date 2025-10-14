-- Fix missing views column in Product table
-- This script adds the missing views column that exists in the schema but not in the database

-- Add views column to Product table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Product' 
        AND column_name = 'views'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "public"."Product" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Added views column to Product table';
    ELSE
        RAISE NOTICE 'Views column already exists in Product table';
    END IF;
END $$;

-- Create index for views column if it doesn't exist
CREATE INDEX IF NOT EXISTS "Product_views_idx" ON "Product"("views" DESC);
