import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import Email from "next-auth/providers/email";

const useRuntimeEnv = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production';

const authOptions = {
  providers: [ Email ],
  // This helps Next-Auth trust the Vercel dynamic URLs
  trustHost: useRuntimeEnv, 
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
