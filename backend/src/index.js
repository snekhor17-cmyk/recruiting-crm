const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: require("path").resolve(__dirname, "../../.env") });

const app = express();
const port = process.env.PORT || 4000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
