import connectMongo from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(req) {
  try {
    const { email, role } = await req.json();
    await connectMongo();
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found, possibly due to premature call');
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Update role if user exists
    user.role = role;
    await user.save();

    return new Response(JSON.stringify({ message: 'Role updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating role:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
