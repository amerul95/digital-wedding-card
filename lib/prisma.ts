import { PrismaClient } from './generated/prisma'

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

// IMPORTANT: If DATABASE_URL starts with "prisma://", Prisma will automatically use Accelerate
// Accelerate doesn't support ALTER statements (P2038 error), which can break write operations
// For local development, use a direct PostgreSQL connection:
// DATABASE_URL="postgresql://postgres:postgres@localhost:5433/wedding_app?schema=public"
const databaseUrl = process.env.DATABASE_URL || ''

if (databaseUrl.startsWith('prisma://')) {
    console.warn(
        '⚠️  WARNING: DATABASE_URL uses Prisma Accelerate (prisma://). ' +
        'Accelerate doesn\'t support ALTER statements and may cause P2038 errors with write operations. ' +
        'For local development, use a direct PostgreSQL connection string instead.'
    )
}

// Create Prisma client - it will use DATABASE_URL from environment
// The issue with P2038 is that Prisma Client detects connection poolers and blocks ALTER statements
// Since we're using a direct connection, this should work, but we need to ensure
// the client is properly initialized without any pooler detection
const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma