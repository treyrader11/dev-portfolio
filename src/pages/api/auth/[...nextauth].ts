import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || "developertrey@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

function isAdmin(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

const providers: NextAuthOptions["providers"] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // Always show Google's account chooser so you can pick which of your
    // accounts to sign in with, instead of Google silently reusing whichever
    // one the browser is already signed into (why each device defaulted to a
    // different email).
    authorization: { params: { prompt: "select_account" } },
  }),
];

// GitHub login (admin gate is still the ADMIN_EMAIL allow-list — sign in with
// the GitHub account whose email is in that list). Only enabled when the OAuth
// app credentials are configured. `user:email` so we always get the email even
// when it's private on GitHub.
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: "read:user user:email" } },
      // Link GitHub to the existing account that already uses the same (verified)
      // email — e.g. treyrdr09@gmail.com, which you first signed in with via
      // Google. Without this NextAuth blocks it with OAuthAccountNotLinked. Safe
      // here: both Google and GitHub verify email ownership and you own both.
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      const ok = isAdmin(user.email);
      if (!ok) {
        // Diagnostic: shows exactly which email was rejected and the allow-list
        // the running server actually loaded (env is read at server start, so a
        // stale ADMIN_EMAIL shows up here). Check your dev terminal.
        console.warn(
          `[auth] sign-in REJECTED — provider=${account?.provider} email=${
            user.email ?? "(none returned)"
          } | ADMIN_EMAIL allow-list=[${ADMIN_EMAILS.join(", ")}]`,
        );
      }
      return ok;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = isAdmin(user.email);
      }
      // Capture the GitHub username on a GitHub sign-in so the profile CMS can
      // auto-fill it.
      if (account?.provider === "github" && profile && "login" in profile) {
        token.githubUsername = (profile as { login?: string }).login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        if (token.githubUsername) {
          session.user.githubUsername = token.githubUsername as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/signin",
    error: "/admin/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
