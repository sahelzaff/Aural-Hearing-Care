import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow POST requests for this operation
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get all users without profiles
    const usersWithoutProfiles = await prisma.User.findMany({
      where: {
        profile: null
      }
    });

    console.log(`Found ${usersWithoutProfiles.length} users without profiles`);

    // Create profiles for users that don't have them
    const results = [];
    for (const user of usersWithoutProfiles) {
      // Extract first and last name from the name field
      const nameParts = user.name.split(' ');
      const first_name = nameParts[0] || 'Unknown';
      const last_name = nameParts.slice(1).join(' ') || 'User';

      try {
        // Create a profile for the user
        const profile = await prisma.Profile.create({
          data: {
            userId: user.id,
            first_name,
            last_name,
            gender: 'other',
            mobile: '0000000000', // Default placeholder
            alternate_mobile: '',
            country: '',
            address: '',
            default_address: false,
          }
        });

        results.push({
          userId: user.id,
          email: user.email,
          profileCreated: true,
          profileId: profile.id
        });
      } catch (error) {
        results.push({
          userId: user.id,
          email: user.email,
          profileCreated: false,
          error: error.message
        });
      }
    }

    return res.status(200).json({
      message: `Fixed ${results.filter(r => r.profileCreated).length} out of ${usersWithoutProfiles.length} users`,
      results
    });
  } catch (error) {
    console.error('Fix profiles error:', error);
    return res.status(500).json({
      message: 'Error fixing profiles',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
} 