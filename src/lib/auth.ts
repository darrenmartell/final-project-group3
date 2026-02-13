import NextAuth from "next-auth";
import type { NextAuthConfig, Session as NextAuthSession } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

// We'll type the parts of session we use
type SessionWithUser = NextAuthSession & {
  user: {
    id: string;
    isAdmin?: boolean;
  };
};

/**
 * Authorized admin emails from AUTHORIZED_ADMIN_EMAIL (comma-separated or single).
 * Only these can sign in. Example: AUTHORIZED_ADMIN_EMAIL=one@x.com,two@x.com
 */
function getAuthorizedAdminEmails(): Set<string> {
  const raw = process.env.AUTHORIZED_ADMIN_EMAIL?.trim() ?? "";
  if (!raw) return new Set<string>();
  const emails = raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  return new Set(emails);
}

const authorizedAdminEmails = getAuthorizedAdminEmails();

const config = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (authorizedAdminEmails.size === 0) {
        return false;
      }
      return user.email != null && authorizedAdminEmails.has(user.email);
    },

    async session({ session, user }) {
      const typedSession = session as SessionWithUser;

      if (typedSession.user) {
        typedSession.user.id = user.id;

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isAdmin: true },
        });

        typedSession.user.isAdmin = dbUser?.isAdmin ?? false;
      }

      return typedSession;
    },
  },

  events: {
    async signIn({ user }) {
      if (!user.email || !authorizedAdminEmails.has(user.email)) {
        return;
      }

      await prisma.user.updateMany({
        where: { email: user.email },
        data: { isAdmin: true },
      });
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/error",
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
