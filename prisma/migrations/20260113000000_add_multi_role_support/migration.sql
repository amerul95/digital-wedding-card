-- CreateTable: UserRole (many-to-many relationship)
CREATE TABLE IF NOT EXISTS "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Unique constraint on user_id and role_id
CREATE UNIQUE INDEX IF NOT EXISTS "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex: For faster lookups
CREATE INDEX IF NOT EXISTS "user_roles_user_id_idx" ON "user_roles"("user_id");
CREATE INDEX IF NOT EXISTS "user_roles_role_id_idx" ON "user_roles"("role_id");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing roleId data to UserRole table
-- This migrates all existing users with a roleId to the new UserRole table
INSERT INTO "user_roles" ("id", "user_id", "role_id", "created_at")
SELECT 
    gen_random_uuid()::text as id,
    "id" as user_id,
    "roleId" as role_id,
    "createdAt" as created_at
FROM "User"
WHERE "roleId" IS NOT NULL
ON CONFLICT ("user_id", "role_id") DO NOTHING;

-- Note: We keep the roleId field in User table for backward compatibility
-- You can remove it later after ensuring all code uses the new UserRole table
