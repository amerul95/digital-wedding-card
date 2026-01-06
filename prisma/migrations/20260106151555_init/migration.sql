/*
  Warnings:

  - Added the required column `updatedAt` to the `Theme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Theme" ADD COLUMN     "config_json" TEXT,
ADD COLUMN     "designer_id" TEXT,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Designer" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Designer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeSale" (
    "id" TEXT NOT NULL,
    "theme_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "sale_price" DECIMAL(65,30) NOT NULL,
    "designer_earning" DECIMAL(65,30) NOT NULL,
    "company_earning" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "designer_id" TEXT NOT NULL,

    CONSTRAINT "ThemeSale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Designer_user_id_key" ON "Designer"("user_id");

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_designer_id_fkey" FOREIGN KEY ("designer_id") REFERENCES "Designer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Designer" ADD CONSTRAINT "Designer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeSale" ADD CONSTRAINT "ThemeSale_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeSale" ADD CONSTRAINT "ThemeSale_designer_id_fkey" FOREIGN KEY ("designer_id") REFERENCES "Designer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeSale" ADD CONSTRAINT "ThemeSale_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
