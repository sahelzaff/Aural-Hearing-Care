import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Custom auth middleware to verify the token
async function verifyToken(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return null;
    }

    // Retrieve user from database based on token
    // This is a simplified example - you should implement proper token verification
    // based on your Express microservice authentication system
    const user = await prisma.User.findFirst({
      where: { 
        authToken: token,
        // Add any other conditions for token validation
      }
    });

    return user;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    // Verify authentication
    const user = await verifyToken(req);

    if (!user) {
      return res.status(401).json({ message: "You must be logged in." });
    }

    // Get user ID from authenticated user
    const userId = user.id;

    // Handle GET request - fetch user profile
    if (req.method === 'GET') {
      const userWithProfile = await prisma.User.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!userWithProfile) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove sensitive data
      const { password, ...userWithoutPassword } = userWithProfile;
      
      return res.status(200).json(userWithoutPassword);
    }
    
    // Handle PUT request - update user profile
    else if (req.method === 'PUT') {
      const { email, profile } = req.body;
      
      // Update user email if provided
      if (email) {
        await prisma.User.update({
          where: { id: userId },
          data: { email }
        });
      }
      
      // Check if profile exists
      const existingProfile = await prisma.Profile.findUnique({
        where: { userId }
      });
      
      let updatedProfile;
      
      // If profile exists, update it
      if (existingProfile) {
        updatedProfile = await prisma.Profile.update({
          where: { userId },
          data: profile
        });
      } 
      // If profile doesn't exist, create it
      else {
        updatedProfile = await prisma.Profile.create({
          data: {
            ...profile,
            userId
          }
        });
      }
      
      // Get the updated user with profile
      const updatedUser = await prisma.User.findUnique({
        where: { id: userId },
        include: { profile: true }
      });
      
      // Remove sensitive data
      const { password, ...userWithoutPassword } = updatedUser;
      
      return res.status(200).json(userWithoutPassword);
    }
    
    // Handle other methods
    else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Profile API error:", error);
    return res.status(500).json({ 
      message: "Error processing request", 
      error: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
} 