import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";

export const Authoptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.OAUTH_CLIENT,
      clientSecret: process.env.OAUTH_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile }) {
      if (!profile || !profile.email) return false;
      const token = jsonwebtoken.sign(
        { email: profile.email, name: profile.name, image: profile.picture },
        process.env.JWT_SECRET
      );
      return `/api/callback/${token}`;
    },
  },
};

const handler = NextAuth(Authoptions);
export { handler as GET, handler as POST };
