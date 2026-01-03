import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/connectDb";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Login ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials || {};
        if (!email || !password) return null;

        // Accept either email or loginID in the same field
        const user = await User.findOne({ $or: [{ email }, { loginID: email }] }).select("+password");
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // return an object containing the information you want available in session/token
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in
      if (user) {
        token.id = user.id || token.id;
        token.role = user.role || token.role;
      }
      // Refresh role from DB on each token generation so changes reflect without re-login
      if (token?.id) {
        try {
          await dbConnect();
          const dbUser = await User.findById(token.id).select("role");
          if (dbUser) token.role = dbUser.role;
        } catch (e) {
          // ignore transient errors
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
