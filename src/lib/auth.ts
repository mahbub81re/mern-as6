import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import bcrypt from "bcryptjs";
import { dbConnect } from "./db";
import { User } from "@/models/User";

// Extend JWT to include our user object
declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      email: string;
      name?: string;
      role?: string;
    };
  }
}

// Extend Session to include our user object
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
    };
  }
}

// Define custom user type to avoid `any`
interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isMatch) {
          throw new Error("Invalid Email or Password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }): Promise<boolean> {
      return !!user;
    },
    async jwt({ token, user }): Promise<typeof token> {
      if (user) {
        const typedUser = user as AuthUser;
        token.user = {
          id: typedUser.id,
          email: typedUser.email,
          name: typedUser.name,
          role: typedUser.role,
        };
      }
      return token;
    },
    async session({ session, token }): Promise<typeof session> {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
