import connectMongo from '../../../lib/mongodb';
import User from '../../../models/User';

// Named export for the POST method
export async function POST(req) {
  try {
    const { email, role } = await req.json(); // Extract data from the request body

    await connectMongo(); // Ensure MongoDB is connected

    const user = await User.findOneAndUpdate({ email }, { role }, { new: true });

    if (user) {
      return new Response(JSON.stringify({ message: 'Role updated successfully' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
  } catch (error) {
    console.error('Error updating role:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
