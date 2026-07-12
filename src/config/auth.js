import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import GitHub from "@auth/express/providers/github";
import PostgresAdapter from "@auth/pg-adapter";
import "dotenv/config";
import { pool } from "../db.js";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4000";

export const authConfig = {
  providers: [
    Google,
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,

      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  adapter: PostgresAdapter(pool),
  session: {
    strategy: "database",
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;

      return session;
    },
    async redirect({ url, baseUrl }) {
      return frontendUrl;
    },
  },
  cookies: {
    sessionToken: {
      name: "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
};

export const authHandler = ExpressAuth(authConfig);
