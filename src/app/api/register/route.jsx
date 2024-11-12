import crypto from 'crypto';
import connectMongo from '../../../lib/mongodb.js';
import User from '../../../models/User.js';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email.js';

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    await connectMongo();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
    }

    // Hash password
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verified: 'false',
      verificationToken, // Stores the token in the database for later verification
    });

    // Send verification email with token link
    await sendVerificationEmail(email, verificationToken);

    return new Response(JSON.stringify({ message: 'User created successfully, please verify your email' }), { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 500 });
  }
}
