const { databasePlaceholder } = require("../dbMock");

const express = require("express");
const router = express.Router();
const encoderController = require("../controllers/encoder");

router.post("/", encoderController.handleEncode);

router.get("/", (req, res) => {
  res.send(databasePlaceholder);
});

router.get("/:slug", (req, res) => {
  const userSlug = req.params.slug;
  console.log(userSlug);

  const record = databasePlaceholder.find((item) => item.base62 === userSlug);

  if (record) {
    return res.redirect(record.original);
  } else {
    return res.status(404).send("Shortened URL not found");
  }
});

module.exports = router;
