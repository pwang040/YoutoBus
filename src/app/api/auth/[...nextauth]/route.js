import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectMongo from '../../../../lib/mongodb.js';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  session: {
    strategy: "jwt",
    // maxAge: 24 * 60 * 60,      // Session lifetime: 1 day
    // updateAge: 1 * 60 * 60,    // Token refresh interval: 1 hour
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          await connectMongo();
          const user = await User.findOne({ email: credentials.email });
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return user; // Authenticated user
          }
          return null; // Authentication failed
        } catch (error) {
          console.error('Error during auth:', error);
          return null;
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  
  callbacks: {
    async session({ session, token }) {
      console.log('session triggered');
      if (token.error === "session_error") {
        console.log("Session error detected; logging out user");
        // Optionally, show a message to the user about the session error here

        // Force a logout by redirecting to the sign-in page or the logout page
        session.error = "Session error. Please sign in again.";
        return null;  // Return null to invalidate the session
    }
      // Logging session time remaining
      // const currentTime = Date.now() / 1000; // Current time in seconds
      // const timeRemaining = token.exp - currentTime;
      // console.log(`Session time remaining: ${Math.floor(timeRemaining / 3600)}h ${Math.floor((timeRemaining % 3600) / 60)}m`);

      session.user.role = token.role || "new"; // Assign role from token
      session.user.verified = token.verified || "false"; // Pass verification status
      return session;
    },
    
    async jwt({ token, user, account }) {
      console.log("JWT callback triggered");
  
      try {
          await connectMongo();
          
          // Check if the user exists in the database
          const existingUser = await User.findOne({ email: token.email });
          console.log('Searching for user: ' + token.email);
  
          if (user) {
              console.log('Account provider:', account.provider);
          }
  
          // Automatically verify OAuth users
          if (user && account?.provider === 'google' && existingUser && !existingUser.verified) {
              await User.updateOne({ email: token.email }, { verified: "true" });
              token.verified = "true";
              console.log("OAuth user marked as verified");
          }
  
          // Create user if new
          if (!existingUser) {
              const newUser = await User.create({
                  name: token.name,
                  email: token.email,
                  role: 'new',
                  verified: account?.provider === 'google' ? "true" : "false",
              });
              token.role = newUser.role;
              token.verified = newUser.verified;
              token.isNewSession = true;
              console.log("New user created");
          } else {
              token.role = existingUser.role;
              token.verified = existingUser.verified;
              token.isNewSession = false;
              console.log("Existing user loaded: ", token.role);
          }
  
      } catch (error) {
          console.error("Error in JWT callback:", error);
  
          // Handle session cleanup on error
          token.error = "session_error";  // Mark this token as errored to trigger front-end logout
      }
  
      return token;
  },
  
    
    
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/auth/after_auth`; // Always redirect to after_auth
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
