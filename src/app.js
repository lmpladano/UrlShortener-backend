import express from "express";
import { authConfig, authHandler } from "./config/auth.js";
import { authenticatedUser } from "./middleware/auth.js";
import cors from "cors";
import urlList from "../src/routes/urlList.js";
import deleter from "../src/routes/delete.js";

const app = express();
const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:4000").replace(
  /\/+$/,
  "",
);

app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies or authorization headers if needed
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", urlList);
app.use("/delete", deleter);

app.get("/api/auth/me", authenticatedUser, (req, res) => {
  // Returns the user's name, email, and avatar image
  return res.json({
    authenticated: true,
    user: res.locals.session.user,
  });
});

app.use("/auth/", authHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
