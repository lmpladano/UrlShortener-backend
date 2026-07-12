const express = require("express");
const cors = require("cors"); // Import the cors package
const app = express();
const urlList = require("./routes/urlList");
app.use(
  cors({
    origin: "http://localhost:3001", // Allow requests only from your Next.js app
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies or authorization headers if needed
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", urlList);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
