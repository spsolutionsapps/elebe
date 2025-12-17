-- AlterTable: Cambiar category de String a String[]
-- CRÍTICO: Eliminar índice antes de cambiar el tipo de dato
DROP INDEX IF EXISTS "Product_category_idx";

-- Primero, convertir los datos existentes: crear una columna temporal
ALTER TABLE "public"."Product" ADD COLUMN "category_new" TEXT[];

-- Convertir los valores existentes de String a String[]
-- Manejar NULLs asignando valor por defecto
UPDATE "public"."Product" SET "category_new" = ARRAY["category"]::TEXT[] WHERE "category" IS NOT NULL;
UPDATE "public"."Product" SET "category_new" = ARRAY['General']::TEXT[] WHERE "category" IS NULL;

-- Eliminar la columna antigua
ALTER TABLE "public"."Product" DROP COLUMN "category";

-- Renombrar la nueva columna
ALTER TABLE "public"."Product" RENAME COLUMN "category_new" TO "category";

-- Establecer el valor por defecto
ALTER TABLE "public"."Product" ALTER COLUMN "category" SET DEFAULT ARRAY['General']::TEXT[];

-- Recrear el índice con tipo GIN (requerido para arrays en PostgreSQL)
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "public"."Product" USING GIN("category");

