// src/app/api/testConnection/route.js
import connectMongo from '../../../lib/mongodb';

export async function GET(req, res) {
  try {
    // Attempt to connect to the database
    await connectMongo();

    // If successful, send a success message
    return new Response(JSON.stringify({ message: "MongoDB connection successful!" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // If there's an error, return a failure message
    return new Response(JSON.stringify({ error: "MongoDB connection failed", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
