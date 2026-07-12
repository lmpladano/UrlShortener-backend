import { getSession } from "@auth/express";
import { authConfig } from "../config/auth.js";

export async function authenticatedUser(req, res, next) {
  console.log("cookie header:", req.headers.cookie);
  const session = await getSession(req, authConfig);

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized. Please sign in." });
  }

  res.locals.session = session;
  next();
}
