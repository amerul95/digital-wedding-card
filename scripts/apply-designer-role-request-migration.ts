import prisma from '../lib/prisma'

async function applyMigration() {
  try {
    console.log('Applying designer_role_requests table migration...')
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "designer_role_requests" (
        "id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "full_name" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        "reviewed_at" TIMESTAMP(3),
        "reviewed_by" TEXT,

        CONSTRAINT "designer_role_requests_pkey" PRIMARY KEY ("id")
      );
    `)

    // Check if foreign key already exists before adding
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'designer_role_requests_user_id_fkey'
        ) THEN
          ALTER TABLE "designer_role_requests" 
          ADD CONSTRAINT "designer_role_requests_user_id_fkey" 
          FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `)

    console.log('Migration applied successfully!')
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('Table already exists, skipping...')
    } else {
      console.error('Error applying migration:', error)
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

applyMigration()
