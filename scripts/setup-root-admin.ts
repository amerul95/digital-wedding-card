import prisma from '../lib/prisma'

const ROOT_ADMIN_EMAIL = 'mirolesuperman@gmail.com'

async function setupRootAdmin() {
  try {
    console.log(`Setting up root admin for ${ROOT_ADMIN_EMAIL}...`)

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: ROOT_ADMIN_EMAIL },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user) {
      console.log('User does not exist. Please create the user first through sign-up.')
      return
    }

    // Get or create admin role
    let adminRole = await prisma.role.findUnique({
      where: { name: 'admin' }
    })

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: 'admin' }
      })
      console.log('Admin role created')
    }

    // Check if user already has admin role
    const hasAdminRole = user.roles.some(ur => ur.role.name === 'admin')

    if (!hasAdminRole) {
      // Add admin role to user
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id
        }
      })
      console.log('Admin role added to user')
    } else {
      console.log('User already has admin role')
    }

    // Also set roleId for backward compatibility
    if (user.roleId !== adminRole.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { roleId: adminRole.id }
      })
      console.log('Updated roleId for backward compatibility')
    }

    console.log('Root admin setup completed successfully!')
  } catch (error: any) {
    console.error('Error setting up root admin:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupRootAdmin()
