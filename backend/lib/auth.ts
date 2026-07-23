// lib/auth.ts - version me logging të plotë
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  providerStatus: string;
  sellerStatus: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        logger.info("🔐 ========== LOGIN ATTEMPT ==========", { email: credentials?.email });

        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email.toLowerCase().trim();

          // Gjej përdoruesin
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || "Përdorues",
            role: user.role,
            providerStatus: (user as unknown as AuthUser).providerStatus || "NONE",
            sellerStatus: (user as unknown as AuthUser).sellerStatus || "NONE"
          };

        } catch (error) {
          console.error("💥 Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        const u = user as unknown as AuthUser;
        token.id = u.id;
        token.role = u.role || "CLIENT";
        token.providerStatus = u.providerStatus || "NONE";
        token.sellerStatus = u.sellerStatus || "NONE";
        token.name = u.name;
        token.email = u.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.providerStatus = token.providerStatus as string;
        session.user.sellerStatus = token.sellerStatus as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });
        
        if (!existingUser) {
          // Krijojmë përdoruesin nëse nuk ekziston
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "",
              password: "", // No password for OAuth
              role: "CLIENT",
              avatar: user.image || "",
            }
          });
          user.id = newUser.id;
          (user as any).role = newUser.role;
          (user as any).providerStatus = "NONE";
          (user as any).sellerStatus = "NONE";
        } else {
          user.id = existingUser.id;
          (user as any).role = existingUser.role;
          (user as any).providerStatus = existingUser.providerStatus || "NONE";
          (user as any).sellerStatus = existingUser.sellerStatus || "NONE";
        }
        return true;
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false
};