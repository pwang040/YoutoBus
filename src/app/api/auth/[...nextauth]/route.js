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
    async jwt({ token, user, account }) {
      console.log("JWT callback triggered");
    
      // Connect to MongoDB
      await connectMongo();
    
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ email: token.email });
      console.log('Searching for user: ' + token.email);
      if (user) {
        console.log('Account provider:', account.provider);

      }
      
      // If the user exists and is an OAuth user, update the `verified` field
      if (user && account.provider === 'google' && existingUser && !existingUser.verified) {
        console.log('Google OAuth user detected, marking as verified');
        await User.updateOne({ email: token.email }, { verified: "true" });
        const updateResult = await User.updateOne({ email: token.email }, { verified: "true" });
        console.log(`Update Result:`, updateResult); // Check for `nModified` to confirm the update

        existingUser.verified = "true"; // Update locally in case it's reused in the function
        console.log('user verified: "' + token.email);
      }
    
      // If user is new (i.e., not in DB), create a new user document
      if (!existingUser) {
        console.log("Creating new user");
        const newUser = await User.create({
          name: token.name,
          email: token.email,
          role: 'new',  // Assign a default role
          verified: account?.provider === 'google' ? "true" : "false", // Automatically verify OAuth users
        });
        token.role = newUser.role;
        console.log("New user created: "+ account.provider + '||' + newUser.verified);
        token.isNewSession = true;
      } else {
        // If user already exists, assign their role and session status
        token.role = existingUser.role;
        token.isNewSession = false;
        console.log("Existing user detected: " + token.role);
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
