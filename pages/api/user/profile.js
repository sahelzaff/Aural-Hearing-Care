import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Get the session to check authentication
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  // Get user ID from session
  const userId = session.user.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found in session" });
  }

  try {
    // Handle GET request - fetch user profile
    if (req.method === 'GET') {
      const user = await prisma.User.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove sensitive data
      const { password, ...userWithoutPassword } = user;
      
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