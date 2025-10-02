-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "individualPackaging" TEXT,
ADD COLUMN     "packagingHeight" DOUBLE PRECISION,
ADD COLUMN     "packagingLength" DOUBLE PRECISION,
ADD COLUMN     "packagingWeight" DOUBLE PRECISION,
ADD COLUMN     "packagingWidth" DOUBLE PRECISION,
ADD COLUMN     "printingTypes" TEXT[],
ADD COLUMN     "productHeight" DOUBLE PRECISION,
ADD COLUMN     "productLength" DOUBLE PRECISION,
ADD COLUMN     "productWeight" DOUBLE PRECISION,
ADD COLUMN     "productWidth" DOUBLE PRECISION,
ADD COLUMN     "unitsPerBox" INTEGER;
