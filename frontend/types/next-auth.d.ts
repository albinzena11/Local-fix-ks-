import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      providerStatus?: string;
      sellerStatus?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    providerStatus?: string;
    sellerStatus?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    providerStatus?: string;
    sellerStatus?: string;
  }
}
