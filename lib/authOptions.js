import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          await dbConnect();

          const email = credentials.email.trim().toLowerCase();
          const user = await User.findOne({ email });
          
          if (!user) {
            console.log("User not found");
            return null;
          }

          if (user.role !== "admin" && !user.isActivated) {
            console.log("Account not activated");
            throw new Error("Account not activated. Please check your email for activation link.");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            console.log("Password incorrect");
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name ?? null,
            email: user.email ?? null,
            role: user.role ?? "user",
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.role = user.role ?? "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
