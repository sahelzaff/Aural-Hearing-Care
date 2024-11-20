import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize PrismaClient
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    email,
    password,
    first_name,
    last_name,
    gender,
    mobile,
    alternate_mobile,
    country,
    address,
    default_address,
  } = req.body;

  // Check required fields
  if (!email || !password || !first_name || !last_name || !mobile) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      received: { email, first_name, last_name, mobile }
    });
  }

  try {
    // Check if user exists
    const existingUser = await prisma.User.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await prisma.User.create({
      data: {
        email,
        password: hashedPassword,
        name: `${first_name} ${last_name}`,
        profile: {
          create: {
            first_name,
            last_name,
            gender,
            mobile,
            alternate_mobile: alternate_mobile || '',
            country: country || '',
            address: address || '',
            default_address: default_address || false,
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
