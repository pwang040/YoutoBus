import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectMongo from '../../../../lib/mongodb';
import User from '../../../../models/User'; // Your User model

export const authOptions = {
  providers: [
    // Credentials provider for email/password login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        await connectMongo(); // Ensure MongoDB connection
        const user = await User.findOne({ email: credentials.email });
        if (user && user.password === credentials.password) {
          // Return user data on successful authentication
          return user;
        }
        // Return null if authentication fails
        return null;
      }
    }),

    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Attach the user role to session
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
    // Add user role to JWT token
    async jwt({ token, user }) {
        await connectMongo();
  
        // Check if user exists in the database
        const existingUser = await User.findOne({ email: token.email });
        
        if (!existingUser) {
          // If user doesn't exist, create a new record (without password for OAuth)
          const newUser = await User.create({
            name: token.name,
            email: token.email,
            role: 'consumer', // Default role for new users; adjust as needed
          });
  
          token.role = newUser.role;
        } else {
          // If user exists, attach their role
          token.role = existingUser.role;
        }
  
        return token;
      },
      async redirect({ url, baseUrl }) {
        // Redirect users based on their role after sign-in
        console.log("url:" + url)
        console.log("baseURL:" + baseUrl)
        if (url === `${baseUrl}/api/auth/callback/google`) {
          // Redirect vendors to /vdash, consumers to /cdash
          console.log('oauth successful')
          console.log(token.role);
          return token.role === 'vendor' ? `${baseUrl}/vdash` : `${baseUrl}/cdash`;
        }
        console.log('redirecting to root')
        return baseUrl;
      }
  },
  // Session management
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
