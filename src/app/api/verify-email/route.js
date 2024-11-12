import connectMongo from '../../../lib/mongodb.js';
import User from '../../../models/User.js';
import { sendVerificationEmail } from '../../../lib/email.js';
import crypto from 'crypto';
import { NextResponse } from 'next/server.js';

export async function POST(req) {
  try {
    // resend flag allows for reuse
    const { email, isOAuth, resend } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    if (isOAuth) {
      await User.updateOne({ email }, { verified: "true" });
      return new Response(JSON.stringify({ message: 'OAuth user automatically verified' }), { status: 200 });
    } else {
      // Check for existing token or generate a new one if necessary
      let verificationToken = user.verificationToken;
      if (!verificationToken || resend) {
        verificationToken = crypto.randomBytes(32).toString('hex');  // For production
        user.verificationToken = verificationToken;
        await user.save();
      }

      // Send or resend verification email
      await sendVerificationEmail(email, verificationToken);
      console.log(`Verification email ${resend ? 'resent' : 'sent'} to:`, email);
      return new Response(JSON.stringify({ message: `Verification email ${resend ? 'resent' : 'sent'}` }), { status: 200 });
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return new Response(JSON.stringify({ error: 'Verification failed' }), { status: 500 });
  }
}

// Verification link handler
export async function GET(req) {
  console.log("is verify GET working?");
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  console.log("search params token received: "+ token);
  if (!token) {
    return new Response(JSON.stringify({ error: 'Invalid or missing token' }), { status: 400 });
  }

  await connectMongo();
  const user = await User.findOne({ verificationToken: token });
  console.log("verifying user, token: " + user.verificationToken);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Token not found or expired' }), { status: 400 });
  }

  // Update user to verified and clear the token
  user.verified = "true";
  user.verificationToken = null;
  await user.save();

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/after_auth`);
}
