// lib/auth.ts - version me logging të plotë
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

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
            console.log("❌ Missing email or password");
            return null;
          }

          const email = credentials.email.toLowerCase().trim();
          console.log("🔍 Searching for user with email:", email);

          // Gjej përdoruesin
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user) {
            console.log("❌ User not found in database");
            return null;
          }

          console.log("✅ User found:", {
            id: user.id,
            email: user.email,
            name: user.name,
            passwordLength: user.password.length,
            passwordStartsWith: user.password.substring(0, 20) + "..."
          });

          // Krahaso fjalëkalimet
          console.log("🔑 Comparing passwords...");
          console.log("Input password:", credentials.password);
          console.log("Stored hash:", user.password.substring(0, 30) + "...");

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          console.log("Password match result:", passwordMatch ? "✅ MATCH" : "❌ NO MATCH");

          if (!passwordMatch) {
            console.log("❌ Password does not match");
            return null;
          }

          console.log("🎉 Login successful for:", user.email, "Role:", user.role);

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
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false
};