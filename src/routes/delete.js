import { pool } from "../db.js";

import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  const entry = req.body.value;

  const record = await pool.query(
    "DELETE FROM public.links WHERE base62 = $1",
    [entry],
  );

  if (record) {
    console.log("itworkeeddd");
    res.status(201).json("Delete success");
  } else {
    return res.status(404).send("Delete failed");
  }
});

export default router;
