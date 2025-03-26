import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Get all users
    const users = await prisma.User.findMany({
      include: {
        profile: true
      }
    });

    // Check if profiles exist
    const profiles = users.filter(user => user.profile).map(user => user.profile);

    return res.status(200).json({
      totalUsers: users.length,
      usersWithProfiles: profiles.length,
      users: users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      })
    });
  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({
      message: 'Error checking collections',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
} 