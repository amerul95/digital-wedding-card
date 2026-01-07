import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Get or create admin role
  let adminRole = await prisma.role.findUnique({
    where: { name: 'admin' }
  })

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'admin' }
    })
    console.log('Created admin role')
  }

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin' }
  })

  if (existingAdmin) {
    console.log('Admin user already exists, updating password...')
    const hashedPassword = await bcrypt.hash('Senario@123', 10)
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        password: hashedPassword,
        roleId: adminRole.id
      }
    })
    console.log('Admin password updated')
  } else {
    // Create admin user
    const hashedPassword = await bcrypt.hash('Senario@123', 10)
    await prisma.user.create({
      data: {
        email: 'admin',
        password: hashedPassword,
        roleId: adminRole.id
      }
    })
    console.log('Created admin user with email: admin and password: Senario@123')
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

