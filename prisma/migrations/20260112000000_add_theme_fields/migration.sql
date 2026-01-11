-- AlterTable
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "custom_id" TEXT,
ADD COLUMN IF NOT EXISTS "theme_name" TEXT,
ADD COLUMN IF NOT EXISTS "color" TEXT,
ADD COLUMN IF NOT EXISTS "running_number" INTEGER;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Theme_designerId_themeName_idx" ON "Theme"("designer_id", "theme_name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Theme_designerId_runningNumber_idx" ON "Theme"("designer_id", "running_number");

-- CreateIndex for unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS "Theme_custom_id_key" ON "Theme"("custom_id") WHERE "custom_id" IS NOT NULL;
