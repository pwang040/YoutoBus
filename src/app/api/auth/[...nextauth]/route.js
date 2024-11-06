import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectMongo from '../../../../lib/mongodb.js';
import User from '../../../../models/User'; // Your User model
import bcrypt from 'bcryptjs';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        try{
        await connectMongo();
        const user = await User.findOne({ email: credentials.email });
        console.log("searching for user..."+ credentials.email);
        if (user) {
          console.log("user found: " + user.email);
          console.log("matching password: "+ credentials.password);
          console.log("password on file: "+user.password);
          // Use bcrypt to compare the entered password with the stored hashed password
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (isMatch) {
            console.log("password matched, granting access");
            return user; // Return the user object if the password matches
          }
          else{
            console.log("passowrd mismatch");
            return null;
          }
        }
        // Return null if authentication fails
        return null;
      } catch (error){
        console.error('Error during auth: '+ error);
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
      // console.log('Session callback triggered');
      session.user.role = token.role || null;
      return session;
    },    
    async jwt({ token, user }) {
      // console.log("jwt triggered");
      await connectMongo();
      const existingUser = await User.findOne({ email: token.email });
      
      if (user) {
        // This runs when a new session is being established
        console.log("new session created");
        token.isNewSession = !existingUser;
      } else {
        console.log("not a new session");
        token.isNewSession = false;
      }
    
      // Attach role or other data as needed
      if (!existingUser) {
        // Create new user logic or other data setup
        const newUser = await User.create({
          name: token.name,
          email: token.email,
          role: 'new', // Example value for new user
        });
        token.role = newUser.role;
        console.log("Creating new user " + token.role);
      } else {
        token.role = existingUser.role;
        console.log("User exists " + token.role);
      }
    
      return token;
    }
    ,
    async redirect({ url, baseUrl }) {
      // console.log('Redirect Callback Triggered:', url, baseUrl);
      return `${baseUrl}/auth/after_auth`; // Unconditionally redirect to after_auth
    }
    
    
    
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
