import connectMongo from '../../../lib/mongodb.js';
import User from '../../../models/User.js';

export async function POST(req) {
  try {
    const { email, isOAuth } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    if (isOAuth) {
      // Immediately mark OAuth users as verified
      await User.updateOne({ email }, { verified: "true" });
    } else {
      // Placeholder: Implement email verification for credential-based users
      console.log("Trigger email verification for:", email);
      return new Response(JSON.stringify({ message: 'Verification email sent' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'User verified successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error verifying user:', error);
    return new Response(JSON.stringify({ error: 'Verification failed' }), { status: 500 });
  }
}
