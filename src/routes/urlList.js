import { pool } from "../db.js";
import express from "express";
import { authenticatedUser } from "../middleware/auth.js";
const router = express.Router();
import handleEncode from "../controllers/encoder.js";

router.post("/", authenticatedUser, handleEncode);

router.get("/", authenticatedUser, async (req, res) => {
  const userId = res.locals.session.user.id;
  const record = await pool.query(
    "SELECT * FROM public.links WHERE user_id = $1",
    [userId],
  );
  res.send(record.rows);
});

router.get("/:slug", async (req, res) => {
  const userSlug = req.params.slug;
  const record = await pool.query(
    "SELECT * FROM public.links WHERE base62 = $1",
    [userSlug],
  );

  if (record.rows[0]) {
    console.log(record.rows[0]);
    return res.redirect(record.rows[0].original);
  } else {
    return res.status(404).send("Shortened URL not found");
  }
});

export default router;
