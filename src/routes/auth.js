import express from "express";
const router = express.Router();

router.post("/auth/signin", async (req, res) => {
  try {
    console.log("here");
    res.json("we are here");
    await signIn(req, res);
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Sign in failed");
  }
});

export default router;
